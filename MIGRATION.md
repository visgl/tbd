# Migration boundaries

## Initial import

The repository owns the GPU compute foundation and its add-on modules. The first import preserves source layouts and existing package identities so that tested code, documentation, and examples can move together.

### Primary code

- `modules/gpgpu`: GPU data, programs, command graphs, operations, graph algorithms, parsing, vector search, DGGS, H3, and A5.
- `modules/experimental/src/gpu-*`: tables, DataFrame, SQL, crossfilter, projection, raster, and trace; `lucim` provides volume workflows.
- Arrow and deck.gl integration modules and their tests.
- Compute documentation and live examples, including incremental streaming analytics.

### Temporary dependencies

The initial tree includes the complete `core`, `constants`, `engine`, `shadertools`, `webgpu`, `webgl`, `test-utils`, `effects`, `scene`, `gltf`, `splats`, and `text` packages, plus rendering helpers in `experimental`. They support existing imports, tests, demos, and adapters. Their inclusion does not establish a permanent ownership boundary.

There are no paths or symlinks back to another checkout. The repository installs and builds independently, but the compute runtime is still coupled to the copied luma device and engine implementations.

## Next extraction tranches

1. Establish standalone compute package names and exports, then update documentation and examples together. Keep publishing disabled until names and ownership are agreed.
2. Separate the minimal device/kernel boundary from rendering. Move retained rendering dependencies to explicit external dependencies once a compatible upstream release is available, or replace them with the intended independent runtime.
3. Split domain add-ons into their own workspaces without duplicating vector, table, ownership, or chunk metadata.
4. Continue the [compute roadmap](dev-docs/roadmaps/compute-roadmap.md): optimization inspection, semantic DataFrame lowering, streaming query integration, and bounded residency.

## Verification scope

- `yarn build` builds every copied workspace package, including temporary dependencies.
- `yarn test` runs Node and headless-browser tests for compute, domain modules, Arrow, and deck adapters. Renderer-only package tests are retained as reference but excluded from the default suite in `vitest.config.ts`.
- Existing upstream exclusions for disabled, type-only, duplicate-wrapper, and opt-in benchmark suites are preserved.
- `yarn examples:typecheck` checks the copied standalone examples supported by the upstream typecheck tool.
- `yarn website:build` builds the compute documentation and selected live examples with strict broken-link checks.
- Links to foundation documentation that remains in luma.gl point explicitly to the upstream website.

## Publishing and deployment

All workspace packages are private. No package publishing or automatic website deployment is configured. CI builds and uploads the website as an artifact; choosing a final domain and enabling hosting is a separate step.
