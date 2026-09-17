const {getDocusaurusConfig} = require('@vis.gl/docusaurus-website');
const path = require('node:path');
const config = getDocusaurusConfig({
  projectName: 'tbd',
  tagline: 'GPU command graphs and data compute for the web',
  siteUrl: 'https://visgl.github.io/tbd/',
  repoUrl: 'https://github.com/visgl/tbd',
  docsTableOfContents: require('../docs/table-of-contents.json'),
  examplesDir: './content/examples',
  exampleTableOfContents: require('./content/examples/table-of-contents.json'),
  search: 'local',
  webpackConfig: {resolve: {alias: {
    'apache-arrow/type$': path.resolve(__dirname, '../examples/experimental/gpu-parquet-constellation/apache-arrow-type-compat.js'),
    '@deck.gl-community/arrow-layers$': path.resolve(__dirname, '../modules/deck-arrow-layers/src/index.ts'),
    '@deck.gl-community/gpu-layers$': path.resolve(__dirname, '../modules/deck-gpu-layers/src/index.ts'),
    '@deck.gl-community/gpu-layers/query$': path.resolve(__dirname, '../modules/deck-gpu-layers/src/query/index.ts')
  }}},
  customCss: ['./src/custom.css']
});
config.baseUrl = process.env.WEBSITE_BASE_URL || '/tbd/';
config.staticDirectories.push('.generated/example-assets');
config.presets = config.presets.map(preset => Array.isArray(preset) && preset[0] === 'classic' ? [preset[0], {...preset[1], blog: false}] : preset);
config.plugins = config.plugins.map(plugin => Array.isArray(plugin) && plugin[0] === '@cmfcmf/docusaurus-search-local' ? [plugin[0], {...plugin[1], indexBlog: false}] : plugin);
config.onBrokenLinks = 'throw';
config.markdown.hooks.onBrokenMarkdownLinks = 'throw';
module.exports = config;
