import {
  getLayersPathsOfApplication,
  splitDirectoryPathInPrefixContextAggregateLayer,
  getFilesInLayer,
  readFile,
  getFileType,
  removeElementFromArray, getAllAggregatesOfProject, successLog, errorLog
} from './utils.js';

export function innerAggregateCommunicationTests() {
  console.log('Inner Aggregate Communication:');
  console.log('\tonly apis are allowed to communicate to other aggregates');
  const dirPaths = getLayersPathsOfApplication();
  const aggregatesOfProject = getAllAggregatesOfProject(dirPaths);

  dirPaths
    .sort()
    .forEach((dirPath) => {
      // noinspection JSUnusedLocalSymbols
      const [_, context, aggregate, layer] =
        splitDirectoryPathInPrefixContextAggregateLayer(
          dirPath,
        );
      if (context && aggregate && layer) {
        runTestForLayer(aggregatesOfProject, aggregate, dirPath)
      }
    });

  successLog('\t\tand no illegal cross aggregate communication found here');
}

function runTestForLayer(aggregatesOfProject, aggregateOfLayer, dirPath) {
  const illegalAggregates = removeElementFromArray(aggregatesOfProject, aggregateOfLayer);

  getFilesInLayer(dirPath).forEach((fileName) => {
    const fileType = getFileType(fileName);
    const fileAsString = readFile(
      dirPath + '/' + fileName,
    );

    if (fileType !== 'api') {
      illegalAggregates.forEach((illegalAggregate) => {
        const matchIllegalImportStatement = new RegExp(
          'from [\'|\"](.*)?/' + illegalAggregate + '/.*[\'|\"]',
          'gim',
        );
        if (matchIllegalImportStatement.test(fileAsString)) {
          errorLog('\t\tbut an illegal dependency is found')
          throw '\t\t\t' + fileName + ' in ' + aggregateOfLayer + ' has dependencies to another aggregate';
        }
      });
    }
  });
}
