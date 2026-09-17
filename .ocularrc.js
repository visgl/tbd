import {fileURLToPath} from 'node:url';
export default {
  lint: {paths: ['modules', 'docs', 'test', 'examples'], extensions: ['js', 'ts', 'jsx', 'tsx']},
  aliases: {test: fileURLToPath(new URL('./test', import.meta.url)), 'dev-modules': fileURLToPath(new URL('./dev-modules', import.meta.url))}
};
