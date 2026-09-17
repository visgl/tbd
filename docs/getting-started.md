# Getting started

This repository is a development workspace; its packages are not published.

```sh
git clone https://github.com/visgl/tbd.git
cd tbd
nvm use
corepack enable
yarn install --immutable
yarn build
yarn playwright:install
yarn test
yarn website:start
```

The website is served at `http://localhost:3000/tbd/`. Interactive GPU examples require a browser with WebGPU enabled.

Run the streaming analytics example separately:

```sh
yarn workspace luma.gl-examples-experimental-gpu-data-analysis start
```

Existing `@luma.gl/gpgpu/*` and `@luma.gl/experimental/gpu-*` imports resolve to local workspaces. See the repository [migration notes](https://github.com/visgl/tbd/blob/master/MIGRATION.md) for package boundaries and remaining work.
