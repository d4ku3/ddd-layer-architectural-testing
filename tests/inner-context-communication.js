import {
  getAllContextsOfProject,
  getLayersPathsOfApplication,
  splitDirectoryPathInPrefixContextAggregateLayer,
  getFilesInLayer,
  readFile,
  getFileType,
  removeElementFromArray
} from './utils.js';

export function innerContextCommunicationTests() {
  console.log('Inner Context Communication:');
  console.log('\tonly apis are allowed to communicate to other contexts');
  const dirPaths = getLayersPathsOfApplication();
  const contextsOfProject = getAllContextsOfProject(dirPaths);

  dirPaths
    .sort()
    .forEach((dirPath) => {
      // noinspection JSUnusedLocalSymbols
      const [_, context, aggregate, layer] =
        splitDirectoryPathInPrefixContextAggregateLayer(
          dirPath,
        );
      if (context && aggregate && layer) {
        runTestForLayer(contextsOfProject, context, dirPath)
      }
    });

  console.log('\t\tand no illegal cross context communication found here');
}

function runTestForLayer(contextsOfProject, contextOfLayer, dirPath) {
  const illegalContexts = removeElementFromArray(contextsOfProject, contextOfLayer);

  getFilesInLayer(dirPath).forEach((fileName) => {
    const fileType = getFileType(fileName);
    const fileAsString = readFile(
      dirPath + '/' + fileName,
    );

    if (fileType !== 'api') {
      illegalContexts.forEach((illegalContext) => {
        const matchIllegalImportStatement = new RegExp(
          'from [\'|\"](.*)?/' + illegalContext + '/.*[\'|\"]',
          'gim',
        );
        if (matchIllegalImportStatement.test(fileAsString)) {
          console.log('\t\tbut an illegal dependency is found')
          throw '\t\t\t' + fileName + ' in ' + contextOfLayer + ' has dependencies to another context';
        }
      });
    }
  });
}
