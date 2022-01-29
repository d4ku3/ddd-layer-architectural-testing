import {
  getLayersPathsOfApplication,
  splitDirectoryPathInPrefixContextAggregateLayer,
  getFilesInLayer,
  getFileType
} from './utils.js';

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

export function layeredFileTypeTest() {
  console.log('Structure: In DDD architecture');
  getLayersPathsOfApplication().forEach((layerPath) => {
    const [prefix, context, aggregate, layer] =
      splitDirectoryPathInPrefixContextAggregateLayer(
        layerPath,
      );

    if (prefix && context && aggregate && layer) {
      console.log('in aggregate ' + aggregate + ' the file')
      const fileNames = getFilesInLayer(layerPath);
      if (fileNames) {
        fileNames.forEach((fileName) => {
          runTestForFile(
            fileName,
            getFileType(fileName),
            layer,
          );
        });
      }
    }
  });
}

function runTestForFile(fileName, fileType, layer) {
  console.log(fileName + ' with fileType ' + fileType + ' is in correct layer');
  let fileInCorrectLayer = true;
  if (!checkIfFileTypeIsInCorrectLayer(fileType, layer)) {
    fileInCorrectLayer = false;
    console.log(fileType + ' is in layer ' + layer);
  }
  return fileInCorrectLayer === true;
}
