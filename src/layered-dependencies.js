import {
  getLayersPathsOfApplication,
  getPrefixAndContextAndAggregateAndLayerOfDirectory,
  getFilesPerLayerByPath,
  readFile
} from './shared/shared-testing-tools.js';

function checkDependenciesInFile(file, illegalLayers) {
  let hasIllegalDeps = false;
  illegalLayers.forEach((illegalLayer) => {
    const matchIllegalImportStatement = new RegExp(
      // Allowed to call upper layers only if response-api
      // eslint-disable-next-line
      'from [\'|"]../' + illegalLayer + '/(.*[\'|"])',
      'gim',
    );
    if (matchIllegalImportStatement.test(file)) {
      hasIllegalDeps = true;
    }
  });
  return hasIllegalDeps;
}

function checkFileForIllegalDependencies(file, ownLayer) {
  switch (ownLayer) {
    case 'interface':
      return checkDependenciesInFile(file, []);
    case 'application':
      return checkDependenciesInFile(file, ['interface']);
    case 'domain':
      return checkDependenciesInFile(file, ['interface', 'application']);
    default:
      return false;
  }
}

export function layeredDependenciesTest() {
  console.log('Layers: In DDD architecture');
  getLayersPathsOfApplication().forEach((layerPath) => {
    const [prefix, context, aggregate, layer] =
      getPrefixAndContextAndAggregateAndLayerOfDirectory(
        layerPath,
      );

    if (prefix && context && aggregate && layer) {
      console.log('dependencies in aggregate ' + aggregate + ' in layer ' + layer);
      runTestForLayer(layer, layerPath);
    }
  });
}

function runTestForLayer(layer, layerPath) {
  console.log('do not depend on upper layers in own aggregate')
  let hasIllegalDeps = false;
  getFilesPerLayerByPath(layerPath).forEach((file) => {
    const fileAsString = readFile(layerPath + '/' + file);
    if (checkFileForIllegalDependencies(fileAsString, layer)) {
      hasIllegalDeps = true;
      console.log(file + ' has illegal dependencies');
    }
  });
  return hasIllegalDeps === false;
}
