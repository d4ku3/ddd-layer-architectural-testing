import * as SharedTestingTools from '../shared/shared-testing-tools';

function checkDependenciesInFile(file, illegalContexts) {
  let hasIllegalDeps = false;
  illegalContexts.forEach((context) => {
    const matchLayerOfImportStatement = new RegExp(
      // eslint-disable-next-line
      'from [\'|"](.*)?/' + context + '/[a-zA-Z-]*/([a-zA-Z-]*)/.*[\'|"]',
      'gim',
    );
    const layer = file.split(matchLayerOfImportStatement)[1];
    console.log(layer);
    if (layer !== 'interface') {
      hasIllegalDeps = true;
    }
  });
  return hasIllegalDeps;
}

function checkDependenciesInFileForIllegalContexts(
  fileAsString,
  illegalContexts,
) {
  let hasIllegalDeps = false;
  illegalContexts.forEach((illegalContext) => {
    const matchIllegalImportStatement = new RegExp(
      // eslint-disable-next-line
      'from [\'|"](.*)?/' + illegalContext + '/.*[\'|"]',
      'gim',
    );
    if (matchIllegalImportStatement.test(fileAsString)) {
      hasIllegalDeps = true;
    }
  });
  return hasIllegalDeps;
}

function checkFileForIllegalDependencies(
  contexts,
  context,
  fileAsString,
  fileType,
) {
  console.log(fileType);
  switch (fileType) {
    case 'api':
      return checkDependenciesInFile(fileAsString, contexts);
    default:
      return checkDependenciesInFileForIllegalContexts(fileAsString, contexts);
  }
}

function runTestForContext(contexts, context, layerPath) {
  it('only access other contexts via api to interface', () => {
    let hasIllegalDeps = false;
    SharedTestingTools.getFilesPerLayerByPath(layerPath).forEach((fileName) => {
      const fileType = SharedTestingTools.getFileType(fileName);
      const fileAsString = SharedTestingTools.readFile(
        layerPath + '/' + fileName,
      );
      if (
        checkFileForIllegalDependencies(
          contexts,
          context,
          fileAsString,
          fileType,
        )
      ) {
        hasIllegalDeps = true;
        console.log(fileName + ' has illegal dependencies');
      }
    });
    return expect(hasIllegalDeps).toBe(false);
  });
}

describe.skip('Cross Context Communication: In DDD architecture', () => {
  const dirPaths = SharedTestingTools.getLayersPathsOfApplication();
  const contexts = SharedTestingTools.getContexts(dirPaths);

  SharedTestingTools.getLayersPathsOfApplication()
    .sort()
    .forEach((layerPath) => {
      const [prefix, context, aggregate, layer] =
        SharedTestingTools.getPrefixAndContextAndAggregateAndLayerOfDirectory(
          layerPath,
        );

      if (prefix && context && aggregate && layer) {
        describe(
          'dependencies of context ' + context + ' in aggregate ' + aggregate,
          () => {
            runTestForContext(contexts, context, layerPath);
          },
        );
      }
    });
});
