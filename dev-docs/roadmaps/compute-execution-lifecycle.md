# GPU compute execution lifecycle

**Status:** Landed in [#3282](https://github.com/visgl/luma.gl/pull/3282).
The [current GPU compute tranche map](./compute-roadmap.md) owns delivery order and remaining work.

## FFT2D consolidation

`GPUFFT2D` now follows the ordinary primitive contract: CPU-only construction, graph views,
`getCommandNodes(graph)`, graph-owned scratch, and compiled-node lifetime for kernels and immutable
parameters. The standalone device/encode/destroy API and its encode-options type are removed.
Ocean, FFT bloom and Spectral Wave Lab use compiled graphs with explicit direction and normal
external buffer rebinding. No compatibility wrapper is retained.

The contiguous path preserves the existing 8-by-8 FFT kernel, pass order and packed batch dispatch.
Parameters now include input/output view offsets. Chunked or oversized packed batches use two
single-transform scratch fields and storage-only gather/scatter passes over borrowed spans.
Scratch does not grow with the logical batch count. A complete matrix must still fit one storage
binding; this is a bounded radix-2 FFT, not an out-of-core transform.

Forward and inverse are separate operations. Consumers retaining separate compiled graphs keep
one scratch allocation per direction; FFT bloom therefore reports five complex buffers instead
of four. A later shared execution planner can reuse scratch across separately compiled plans.

## Validation

Numerical tests compare rectangular and square forward transforms with a CPU DFT, then check
inverse round trips. They cover multiple transforms, independently split chunks, nonzero offsets,
sentinels around borrowed spans, repeated encoding, binding replacement, and partial compilation
failure cleanup. Ocean and bloom integration tests exercise the production callers.

## Follow-through and current limits

The subsequent [solver consolidation](./compute-solver-consolidation.md) landed in
[#3284](https://github.com/visgl/luma.gl/pull/3284). It added chunked PCG warm starts and
convergence/breakdown coverage, unified hierarchical dot/reduction execution, and removed the
unfinished duplicate CG executable. These are no longer pending lifecycle migrations.

A complete FFT matrix must still fit one storage binding. Separately compiled forward/inverse
plans retain their own scratch. Solver numerical scope and remaining planning, streaming, and
interoperability work are tracked in the [current tranche map](./compute-roadmap.md).
