// https://stackoverflow.com/questions/50171412/jest-typescript-absolute-paths-baseurl-gives-error-cannot-find-module

function makeModuleNameMapper(rootPath, jsConfigPath) {
  // Get paths from tsconfig
  // const { paths } = require(jsConfigPath).compilerOptions;

  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  // Object.keys(paths).forEach((item) => {
  //   const key = item.replace('/*', '/(.*)');
  //   const path = paths[item][0].replace('/*', '/$1');
  //   aliases[key] = `${rootPath}/${path}`;
  // });
  return aliases;
}

const JS_CONFIG_PATH = './jsconfig.json';
const ROOT_PATH = '<rootDir>';

module.exports = {
  roots: [ROOT_PATH],
  moduleNameMapper: makeModuleNameMapper(ROOT_PATH, JS_CONFIG_PATH),
};
