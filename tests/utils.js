import * as fs from 'fs';
import * as path from 'path';
import {argv} from 'process';

const projectName = argv[2];
const sourceFolder = argv[3];

const matchDDDLayerNames = new RegExp('interface$|domain$|application$', 'gim');
const matchTypescriptFileEnding = new RegExp('.(ts|js)$', 'gim');
const matchFileType = new RegExp('[a-zA-Z-]*\.([a-zA-Z-]*)\.(ts|js)$', 'g');
const contextRegex = /.*\/(.*-context)\/(.*)\/(.*)$/;

function getDirectories(srcPath) {
  const dirs = fs
    .readdirSync(srcPath)
    .map((file) => path.join(srcPath, file))
    .filter(path => fs.statSync(path).isDirectory()
      && !path.includes('ddd-layer-architectural-testing')
      && !path.includes('node_modules')
      && !path.includes('.git'));

  if (dirs.length <= 0) throw 'No directories found'

  return dirs
}

export const getAllContextsOfProject = (dirPaths) => {
  const contexts = [];

  dirPaths.forEach((dirPath) => {
    const context = dirPath.split(contextRegex)[1];
    if (context && !contexts.includes(context)) {
      contexts.push(context);
    }
  });

  if (contexts.length === 0) throw "No contexts found"
  return contexts;
};

export const getAllAggregatesOfProject = (dirPaths) => {
  const aggregates = [];

  dirPaths.forEach((dirPath) => {
    const aggregate = dirPath.split(contextRegex)[2];
    if (aggregate && !aggregates.includes(aggregate)) {
      aggregates.push(aggregate);
    }
  });

  if (aggregates.length === 0) throw "No aggregates found"
  return aggregates;
};

export const getLayersPathsOfApplication = () => {
  const dirs = getDirectoriesRecursive(path.join('..', projectName, sourceFolder));

  const filteredDirs = dirs.filter((dir) => dir.match(matchDDDLayerNames));

  if (filteredDirs.length === 0) throw "No paths found"

  return filteredDirs;
};

export const getFilesInLayer = (layer) => {
  const files = fs.readdirSync(layer);
  return files.filter((file) => file.match(matchTypescriptFileEnding));
};

const flatten = lists => lists.reduce((a, b) => a.concat(b), []);

const getDirectoriesRecursive = srcPath => [srcPath, ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive))];

export const splitDirectoryPathInPrefixContextAggregateLayer = dirPath => dirPath.split(contextRegex);

export const readFile = file => fs.readFileSync(file, 'utf8');

export const getFileType = fileName => fileName.split(matchFileType)[1];

export const removeElementFromArray = (array, element) => array.splice(array.indexOf(element), 1);

export const successLog = log => console.log('\x1b[32m', log, '\x1b[0m')

export const errorLog = log => console.log('\x1b[31m', log)
