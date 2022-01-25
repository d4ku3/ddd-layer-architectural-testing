import {
  getContexts,
  getLayersPathsOfApplication,
  getPrefixContextAggregateLayerOfDirectory,
  getFilesPerLayerByPath,
  readFile,
  getFileType
} from './utils.js';

function checkDependenciesInFile(file, illegalContexts) {
  let hasIllegalDeps = false;
  illegalContexts.forEach((context) => {
    const matchLayerOfImportStatement = new RegExp(
      // eslint-disable-next-line
      'from [\'|"](.*)?/' + context + '/[a-zA-Z-]*/([a-zA-Z-]*)/.*[\'|"]',
      'gim',
    );
    const layer = file.split(matchLayerOfImportStatement)[1];
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

export function crossContextCommunicationTests() {
  console.log('Cross Context Communication: In DDD architecture');
  const dirPaths = getLayersPathsOfApplication();
  const contexts = getContexts(dirPaths);

  dirPaths
    .sort()
    .forEach((layerPath) => {
      const [prefix, context, aggregate, layer] =
        getPrefixContextAggregateLayerOfDirectory(
          layerPath,
        );

      if (prefix && context && aggregate && layer) {
        console.log('dependencies of context ' + context + ' in aggregate ' + aggregate);
        runTestForContext(contexts, context, layerPath);
      }
    });
}

function runTestForContext(contexts, context, layerPath) {
  console.log('only access other contexts via api to interface')
  let hasIllegalDeps = false;
  getFilesPerLayerByPath(layerPath).forEach((fileName) => {
    const fileType = getFileType(fileName);
    const fileAsString = readFile(
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
  return hasIllegalDeps === false;
}
