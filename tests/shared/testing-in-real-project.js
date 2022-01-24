import fs from "fs";
import path from "path";


export function testingInRealProject() {
  function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
  }

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
      .map(file => path.join(srcpath, file))
      .filter(path => fs.statSync(path).isDirectory());
  }

  function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
  }

  const dirs = getDirectoriesRecursive('/Volumes/ExternalVol/External-Development/npm-packages/test-nest-prject/src');
  console.log(dirs);
}