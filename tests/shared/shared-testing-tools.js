import * as fs from 'fs';
import * as path from 'path';

const matchDDDLayerNames = new RegExp('interface$|domain$|application$', 'gim');
const matchTypescriptFileEnding = new RegExp('.ts$', 'gim');
const contextRegex = /\/((.*)-context)\/.*\/.*$/;

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcPath) {
    return fs
        .readdirSync(srcPath)
        .map((file) => path.join(srcPath, file))
        .filter((dirPath) => fs.statSync(dirPath).isDirectory());
}

function getDirectoriesRecursive(srcPath) {
    return [
        srcPath,
        ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive)),
    ];
}

export const getContexts = (dirPaths) => {
    const contexts = [];

    dirPaths.forEach((dirPath) => {
        const context = dirPath.split(contextRegex)[1];

        if (context && !contexts.includes(context)) {
            contexts.push(context);
        }
    });

    return contexts;
};

export const getLayersPathsOfApplication = () => {
    const dirs = getDirectoriesRecursive('/Volumes/ExternalVol/External-Development/npm-packages/test-nest-prject/src');
    return dirs.filter((dir) => dir.match(matchDDDLayerNames));
};

export const getPrefixContextAggregateLayerOfDirectory = (
    dirPath,
) => {
    return dirPath.split(contextRegex);
};

export const getFilesPerLayerByPath = (layerPath) => {
    const files = fs.readdirSync(layerPath);
    return files.filter((file) => file.match(matchTypescriptFileEnding));
};

export const readFile = (file) => fs.readFileSync(file, 'utf8');

const matchFileType = new RegExp(
    '[a-zA-Z-]*.([a-zA-Z-]*).',
    'g',
);

export const getFileType = (fileName) => {
    return fileName.split(matchFileType)[1];
};
