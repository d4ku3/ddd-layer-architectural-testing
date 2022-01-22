import * as SharedTestingTools from '../shared/shared-testing-tools';

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

function runTestForLayer(layer, layerPath) {
  it('do not depend on upper layers in own aggregate', () => {
    let hasIllegalDeps = false;
    SharedTestingTools.getFilesPerLayerByPath(layerPath).forEach((file) => {
      const fileAsString = SharedTestingTools.readFile(layerPath + '/' + file);
      if (checkFileForIllegalDependencies(fileAsString, layer)) {
        hasIllegalDeps = true;
        console.log(file + ' has illegal dependencies');
      }
    });
    return expect(hasIllegalDeps).toBe(false);
  });
}

describe('Layers: In DDD architecture', () => {
  SharedTestingTools.getLayersPathsOfApplication().forEach((layerPath) => {
    const [prefix, context, aggregate, layer] =
      SharedTestingTools.getPrefixAndContextAndAggregateAndLayerOfDirectory(
        layerPath,
      );

    if (prefix && context && aggregate && layer) {
      describe(
        'dependencies in aggregate ' + aggregate + ' in layer ' + layer,
        () => {
          runTestForLayer(layer, layerPath);
        },
      );
    }
  });
});
