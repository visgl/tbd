# Development instructions

- Use the Node version in `.nvmrc` and Yarn through Corepack.
- Install with `yarn install --immutable`.
- Before committing, run `yarn lint fix`. Check package changes with `yarn build` and `yarn test`; check documentation or website changes with `yarn website:build`.
- Preserve existing copyright and third-party license notices.
- All packages are private during extraction. Do not publish or rename packages without an explicit task.
- See `MIGRATION.md` for the temporary luma dependency boundary.
- GPUVector is an ordered list of chunks. Preserve zero-copy source batches; never implicitly concatenate or repack them.
- Respect ownership: aggregate vectors must not destroy borrowed chunks.
- GPUVector.format is canonical type metadata. Arrow conversion belongs in the Arrow adapter.
- Prefer precise TypeScript types, explicit metadata, and small runtime validation.
- Keep PRs substantial and stacks shallow.
