# tbd

GPU command graphs, chunked data, and compute modules for the web. Part of [vis.gl](https://vis.gl).

**The repository name is provisional. Packages are private and are not published.**

## Included

- **Compute foundation:** GPUProgram, GPUCommandGraph, kernels, vectors, chunk topology, resource ownership, scheduling, and incremental execution.
- **Operations:** reductions, scans, sorting, Top-K building blocks, histograms, joins, spatial indexes, sparse/dense linear algebra, solvers, and transforms.
- **Add-on modules:** DataFrame, SQL, crossfilter, tables, graph algorithms, parsing, vector search, geographic grids, projection, raster, trace, volume, and GPU scene workflows.
- **Integrations:** Arrow and deck.gl adapters, interactive examples, documentation, and a Docusaurus website built with `@vis.gl/docusaurus-website`.

This is an initial extraction from luma.gl. Device, shader, and rendering packages remain in the workspace to keep the complete example and integration dependency graph buildable. See [migration boundaries](MIGRATION.md) and [source provenance](UPSTREAM.md).

## Development

Requires Node 22 (see `.nvmrc`) and Yarn 4 through Corepack.

```sh
nvm use
corepack enable
yarn install --immutable
yarn build
yarn playwright:install
yarn test
yarn lint
yarn website:build
yarn website:start
```

The local website opens at `http://localhost:3000/tbd/`.

```sh
# Standalone streaming analytics demo
yarn workspace luma.gl-examples-experimental-gpu-data-analysis start
```

## Structure

| Directory | Purpose |
| --- | --- |
| `modules/gpgpu` | Compute foundation and algorithm packages |
| `modules/experimental` | Domain modules and retained integration helpers |
| `modules/arrow`, `modules/deck-*-layers` | Data and visualization adapters |
| Other `modules/*` | Temporary luma runtime and renderer dependency snapshot |
| `docs` | Compute and add-on API documentation |
| `examples` | GPU graph, data, and dependent visualization demonstrations |
| `website` | vis.gl Docusaurus website and live examples |
| `dev-docs/roadmaps` | Execution, optimization, streaming, and independence tranches |

Existing package names are retained to avoid combining extraction with an API rename. They resolve to local workspaces and must not be published from this repository.

## License

[MIT](LICENSE), with existing file-level third-party licenses and attribution preserved.
