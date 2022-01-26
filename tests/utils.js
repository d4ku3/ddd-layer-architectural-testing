import * as fs from 'fs';
import * as path from 'path';

const matchDDDLayerNames = new RegExp('interface$|domain$|application$', 'gim');
const matchTypescriptFileEnding = new RegExp('.(ts|js)$', 'gim');
const matchFileType = new RegExp('[a-zA-Z-]*\.([a-zA-Z-]*)\.(ts|js)$', 'g');
const contextRegex = /.*\/(.*-context)\/(.*)\/(.*)$/;

function getDirectories(srcPath) {
  return fs
    .readdirSync(srcPath)
    .map((file) => path.join(srcPath, file))
    .filter(path => fs.statSync(path).isDirectory()
      && !path.includes('ddd-layer-architectural-testing')
      && !path.includes('node_modules')
      && !path.includes('.git'));
}

export const getContexts = (dirPaths) => {
  const contexts = [];

  dirPaths.forEach((dirPath) => {
    const context = dirPath.split(contextRegex)[1];
    if (context && !contexts.includes(context)) {
      contexts.push(context);
    }
  });

  if (dirPaths.length === 0) throw "No contexts found"

  return contexts;
};

export const getLayersPathsOfApplication = () => {
  const dirs = getDirectoriesRecursive(path.join('..', 'test-nest-prject', 'src'));

  const filteredDirs = dirs.filter((dir) => dir.match(matchDDDLayerNames));

  if (filteredDirs.length === 0) throw "No paths found"

  return filteredDirs;
};

export const getFilesPerLayerByPath = (layerPath) => {
  const files = fs.readdirSync(layerPath);
  return files.filter((file) => file.match(matchTypescriptFileEnding));
};

const flatten = lists => lists.reduce((a, b) => a.concat(b), []);

const getDirectoriesRecursive = srcPath => [srcPath, ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive))];

export const getPrefixContextAggregateLayerOfDirectory = dirPath => dirPath.split(contextRegex);

export const readFile = file => fs.readFileSync(file, 'utf8');

export const getFileType = fileName => fileName.split(matchFileType)[1];
