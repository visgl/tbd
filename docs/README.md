---
slug: /
title: GPU compute
---

# GPU compute for the web

Compose GPU command graphs, operate on chunked data without implicit concatenation, and reuse per-batch results as data changes.

This repository brings together the compute runtime and its analytical, spatial, raster, graph, trace, and table modules. **tbd is a provisional repository name.** Package names remain private during extraction.

- [Start developing](./getting-started.md)
- [GPU command graphs](./api-reference/experimental/gpu-core/gpu-command-graph.md)
- [Logical programs](./api-reference/experimental/gpu-core/gpu-program.md)
- [Chunked vectors](./api-reference/gpgpu/gpu-vector.mdx)
- [Incremental execution](./api-reference/experimental/gpu-core/gpu-incremental-execution.md)
- [Examples](/examples)

The first import preserves the existing luma device and renderer dependencies. API references retain their current package paths while the standalone boundary is established.
