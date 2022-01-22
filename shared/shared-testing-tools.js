import * as fs from 'fs';
import * as path from 'path';

const matchDDDLayerNames = new RegExp('interface$|domain$|application$', 'gim');

const matchTypescriptFileEnding = new RegExp('.ts$', 'gim');

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
        const re = /\/(context-(.*))\/.*\/.*$/;
        const context = dirPath.split(re)[1];

        if (context && !contexts.includes(context)) {
            contexts.push(context);
        }
    });

    return contexts;
};

export const getLayersPathsOfApplication = () => {
    const dirs = getDirectoriesRecursive('src');
    return dirs.filter((dir) => dir.match(matchDDDLayerNames));
};

export const getPrefixAndContextAndAggregateAndLayerOfDirectory = (
    dirPath,
) => {
    const re = /\/context-(.*)\/(.*)\/(.*)$/;
    return dirPath.split(re);
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
