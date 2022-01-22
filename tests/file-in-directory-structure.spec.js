import * as SharedTestingTools from '../shared/shared-testing-tools';

function checkIfFileTypeIsInCorrectLayer(fileType, layer) {
  switch (fileType) {
    case 'controller':
    case 'data-controller':
      return layer === 'interface';
    case 'api':
      return layer === 'application';
    case 'service':
      return layer === 'application' || 'domain';
    case 'dto':
    case 'model':
    case 'entity':
    case 'repository':
      return layer === 'domain';
    default:
      return false;
  }
}

function runTestForFile(fileName, fileType, layer) {
  it(fileName + ' with fileType ' + fileType + ' is in correct layer', () => {
    let fileInCorrectLayer = true;
    if (!checkIfFileTypeIsInCorrectLayer(fileType, layer)) {
      fileInCorrectLayer = false;
      console.log(fileType + ' is in layer ' + layer);
    }
    return expect(fileInCorrectLayer).toBe(true);
  });
}

describe('Structure: In DDD architecture', () => {
  SharedTestingTools.getLayersPathsOfApplication().forEach((layerPath) => {
    const [prefix, context, aggregate, layer] =
      SharedTestingTools.getPrefixAndContextAndAggregateAndLayerOfDirectory(
        layerPath,
      );

    if (prefix && context && aggregate && layer) {
      describe('in aggregate ' + aggregate + ' the file', () => {
        const fileNames = SharedTestingTools.getFilesPerLayerByPath(layerPath);
        if (fileNames) {
          fileNames.forEach((fileName) => {
            runTestForFile(
              fileName,
              SharedTestingTools.getFileType(fileName),
              layer,
            );
          });
        }
      });
    }
  });
});
