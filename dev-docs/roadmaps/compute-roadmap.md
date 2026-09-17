# GPU compute roadmap

Status checked against `visgl/luma.gl` master `02a8a13a4` on 2026-09-17, after
[PR #3294](https://github.com/visgl/luma.gl/pull/3294) landed.

This is the current cross-cutting tranche map for GPU compute. The original composition and batching
plan is the completed foundation below. The current numbering retains **3 — fragmentation** and
**5 — incremental streaming**; delivery order follows dependencies, not the numbers. The separate
[GPU Core roadmap](./gpugraph-roadmap.md) continues to own domain algorithms, scenes, and spatial
contracts. Its phase/tranche numbers are a separate namespace.

## Direction and invariants

Build a small, composable GPU compute layer whose results stay GPU-resident and can feed analytical
views, simulations, and renderers. `GPUData` owns or borrows one buffer; `GPUVector` describes one
logical column across ordered chunks. Algorithms consume that shared model.

- Preserve source batches and borrowed storage. Packing is an explicit choice, never a fallback
  hidden inside append, planning, or execution.
- Compose existing operations with `graph.add([...])`, `getNodes()`, and `getCommandNodes(graph)`.
  Do not reintroduce `addToGraph()` shims or parallel batch-only operation APIs.
- Reuse `GPUVector`/`GPUVectorLike`, existing operation metadata, and program bindings. Add a public
  wrapper only when it has distinct semantics that cannot live on an existing abstraction.
- PLOOR is analysis, rewriting, and physical planning between `GPUProgram` and `GPUCommandGraph`.
  It must not introduce a third public graph, mirrored operation family, or mandatory optimizer API.
- Keep ownership, submission, change tracking, numerical semantics, and recomputation boundaries
  explicit. Unknown effects or incomplete metadata block unsafe optimizations.
- Every optimization must name its workload, preserve correctness, and report measurable costs.
  Keep existing kernel strategy selectors below the planner until evidence warrants moving them.

## Landed foundation

| Area | Evidence | Remaining boundary |
| --- | --- | --- |
| Composition and canonical vectors | Existing graph/program composition, `GPUVectorLike`, vector bindings, and shared chunk descriptors | Semantic program vectors still exist; simplify them only where real duplication can be removed |
| General column-operation batching | [#3279](https://github.com/visgl/luma.gl/pull/3279), [batching audit](./gpu-batching-audit.md), and preceding grouped operation PRs | Packed tree storage and specialized partition semantics remain deliberate limits |
| Kernel execution | [#3281](https://github.com/visgl/luma.gl/pull/3281), [migration evidence](./compute-kernel-migration.md) | Kernel still depends on luma device/engine resources |
| Graph-owned FFT2D | [#3282](https://github.com/visgl/luma.gl/pull/3282), [lifecycle audit](./compute-execution-lifecycle.md) | One complete FFT matrix must fit a storage binding |
| Hierarchical reductions and solver correctness | [#3284](https://github.com/visgl/luma.gl/pull/3284), [solver audit](./compute-solver-consolidation.md) | Float32 SPD methods, absolute tolerance, bounded iterations |
| Fragmentation planning and SpMV routing | [#3292](https://github.com/visgl/luma.gl/pull/3292), [measurements](./compute-fragmentation.md) | General indirect routing, shader variants, and texture planning remain |
| Explicit incremental execution | [#3294](https://github.com/visgl/luma.gl/pull/3294), [API contract](../../docs/api-reference/experimental/gpu-core/gpu-incremental-execution.md) | Explicit map/merge composition; query decomposition and hierarchical merge caching remain |

## Tranche map

| Tranche | Status | Outcome / completion criterion |
| --- | --- | --- |
| **1 — Unify execution and lifecycle** | **Landed for the audited core scope** | Kernel execution, graph-owned FFT2D, shared hierarchical reductions, and tested CG/PCG convergence; preserve these contracts |
| **2 — PLOOR analysis and optimization** | **Next: read-only inspector** | Explain program dataflow and costs first; then prove small rewrites, shared work, topology scheduling, and materialization decisions |
| **3 — Make fragmentation inexpensive** | **Foundation landed; follow-up planned** | Preserve #3292's structural gains; reduce remaining indirect routing and pipeline-variant overhead with measured workloads |
| **4 — DataFrame as a semantic program producer** | **Planned** | A representative analytical query exposes predicates, derived columns, and aggregates to the shared program/compiler without duplicate public operations |
| **5 — Incremental execution over streaming batches** | **V1 acceptance met; integration follow-up planned** | Live views reuse unchanged GPU partials across append/replace/remove and prove that reuse through actual command counters |
| **6 — Native WebGPU and renderer independence** | **Planned** | Raw WebGPU and a non-luma renderer consume shared GPU results without mandatory luma engine imports or readback/upload round trips |
| **7 — Bounded residency and datasets larger than GPU memory** | **Later; contract first** | A supported analytical workload stays within a declared memory budget with explicit transfers, eviction, and backpressure |
| **8 — Performance evidence and API graduation** | **Continuous evidence; graduation gated** | Reproducible hardware results, stable ownership/numerical contracts, and examples/package checks justify a small supported API |

## 2. PLOOR: observe, then optimize

### First block: inspector and sufficient metadata

Extend the existing program/compilation inspector rather than building a separate inspector system.
Today `inspectGPUProgramCompilation()` summarizes counts and lowering decisions; it does not provide
complete pre-lowering dataflow, liveness, effects, partitionability, or materialization analysis.

- Inspect inputs/outputs, producer-consumer relationships, shared predicates/reductions, chunk
  topology, intermediate sizes, and operations with supported partial/merge decompositions.
- Make resource identity, aliasing, effects, and externally observable outputs precise enough for
  subsequent safety decisions. Keep incomplete producer metadata explicitly unknown.
- Separate estimates from measurements, logical rows from physical work, and unavailable metrics
  from measured zero. Preserve operation-to-command provenance.
- Reuse existing command-graph statistics and inspector presentation where applicable.

**Done when:** a representative program explains its shared consumers, chunk topology, intermediate
bytes, and analysis gaps without changing its commands, allocations, submission, or results.

### Second block: rewrite proof and common work

Add an internal identity transformation and one conservative rewrite, then share identical pure
predicates, expressions, or reductions where the same rules apply. Group these into one substantial
PR if the correctness contract remains reviewable.

**Done when:** enabled and disabled plans match on GPU results, observable writes, conditional/loop
behavior, aliases, and provenance; the accepted workload shows fewer redundant operations or dead
intermediates. Unknown effects remain barriers. No WGSL fusion is required for this block.

### Third block: topology scheduling and materialization

Use the same kernels to compare chunk-major and operation-major schedules. Then choose whether to
retain or recompute a mask/intermediate using consumer count, reuse, predicate cost, and memory.
Expose the choice and reason in inspection. Require explicit permission for any physical repacking.

**Done when:** a shared-filter analytical workload preserves results and source topology while
showing a measured reduction in intermediate memory or execution cost; unfavorable cases retain
an explainable baseline plan.

**Fusion gate:** consider bounded WGSL fusion only after these stages identify a real bottleneck.
Do not add a generic fusion framework in anticipation of workloads.

## 3. Make fragmentation inexpensive

The first block is complete: canonical graph chunk descriptors, indexed range lookup, scalable
validation/scheduling/allocation, and reused SpMV gathers landed in #3292. Its structural fixture
reduces 8,192 commands to 768; hardware-dependent timing observations remain labeled as such.

Group the remaining work by shared mechanism:

- Routing/merging for general gather, scatter, sort, joins, binning, and other indirect consumers.
- Runtime dispatch parameters and compatible dispatch grouping to reduce shader/pipeline variants.
- Texture hazard and allocation planning where measured workloads justify the change.

**Done when:** fixed logical datasets with contiguous, many tiny, skewed, and empty chunks retain
identical semantics while reporting compilation, encoding, dispatch, pipeline, and scratch costs.
Demonstrate improved scaling for the targeted families without regressing their contiguous path or
silently concatenating source storage. This is not a claim that all chunk overhead can disappear.

## 4. DataFrame becomes a semantic program producer

The current dataframe query compiler still constructs execution graph work directly. Preserve its
existing behavior while making useful semantics visible before lowering.

- Carry filters, derived expressions, selection reuse, and supported aggregates into the existing
  program/operation model. Avoid parallel `GPUProgramHistogram`-style public families.
- Preserve dictionaries, null/NaN behavior, parameter updates, stable row IDs, and source partitions.
- Feed query dependencies and parameter revisions into the streaming execution contract where a
  batch-local partial/merge decomposition is valid.
- Keep table/schema ownership above primitive GPU data and compute resources.

**Entry:** the inspector can represent known dependencies and explicitly unknown operations.
**Done when:** one real filter + multiple aggregates + rendering consumer shares the program path,
retains batch boundaries, matches the existing query oracle, and exposes optimization/invalidation
reasons. Migrate related query families together, not one PR per operation.

## 5. Incremental execution over streaming batches

**V1 is landed and its requested live-view acceptance criterion is met.** `GPUIncrementalExecution`
uses ordered snapshots of batch IDs, revisions, and data identities. Append/replacement executes
changed batches, removal/reordering runs the merge, and an unchanged snapshot submits nothing.
Persistent partials are executor-owned; source storage and final outputs remain caller-owned.
Synchronous failures preserve the last committed cache for retry.

The live analytical composition supplies unsigned sum, fixed-domain histograms, grouped counts,
and stable unsigned Top-K. At six batches, an append computes one batch and reuses five; repeating
the snapshot records zero batch and merge commands. Removing a batch avoids surviving source work.
Tests cover these transitions, empty inputs, stable ties, changed bytes with revision bumps, and
query-wide invalidation.

### Next integration block

- Reuse the executor from supported DataFrame queries, with dependency-specific invalidation.
- Group validity-aware extrema and means, grouped sums, and floating/null Top-K support by their
  shared numerical and selection contracts. Batch means and zero-sentinel extrema cannot simply
  be merged as if they were sums.
- Add hierarchical merge caches and reusable preparation only when measurement shows that merging
  all live partials or rebuilding changed graphs dominates update cost.
- Define cache retention budgets and asynchronous preparation/lifetime rules before adding eviction.

**Done when:** supported live DataFrame views prove source and partial reuse, bounded retained state,
and result parity through append, replacement, removal, and parameter changes. Instrumentation must
separate changed-source work, cached-partial merging, compilation, retained bytes, and transfers.

Automatic-domain histograms require broader recomputation when their global extent changes.
Scans, ranks, full sorts, joins, and iterative solvers need operation-specific incremental contracts;
the generic executor does not automatically incrementalize them.

## 6. Native WebGPU and renderer independence

Audit the actual device, buffer, pipeline, kernel, and ownership boundary before choosing package
names. Coordinate this work with GPU Core graduation phases 7.1–7.3 instead of running two competing
extractions. Reuse logical vector contracts; keep format adapters and rendering above compute.

**Done when:** raw WebGPU and a Three.js or equivalent external-renderer example share a device and
consume computed GPU buffers directly, with no mandatory luma engine dependency, hidden device
creation, readback/upload round trip, or ambiguous destruction. Package/dependency tests enforce
the boundary. Keep this to one extraction PR and, if necessary, one consumer migration PR.

## 7. Bounded residency and out-of-core analytics

Streaming source preservation is a prerequisite, not proof that arbitrary operations can run on
data larger than GPU memory. Start with a decomposable analytical workload and a fixed budget.

Specify upload/download ownership, in-flight pins, eviction order, backpressure, cancellation, and
failure/retry behavior. Account for source, partial, merge, staging, and renderer memory separately.
Transfers and unsupported global operations must remain visible to the application.

**Done when:** a dataset larger than the selected budget produces verified live results, peak GPU
memory stays bounded, unchanged resident batches are reused, and every transfer/recompute has an
inspectable cause. Require explicit spill/transfer policy; never silently pack or evict borrowed data.

## 8. Evidence and graduation

Maintain shared correctness oracles and workload fixtures across analytical, sparse/solver, spatial,
and compute-to-render consumers. Include contiguous and fragmented layouts, cold preparation,
warm reuse, and streaming updates. Report CPU build/encode time, GPU time when available, actual
commands, pipeline variants, memory, and transfer bytes. Software GPU results establish correctness;
hardware measurements support performance claims.

**Done when:** the supported surface has stable ownership, invalidation, numeric, and failure
contracts; cross-package builds, GPU tests, examples, and documentation pass; and representative
hardware evidence shows where each optimization helps or should be bypassed.

## Recommended next delivery order

1. **PLOOR inspector + metadata (2, first block)** — observational and useful immediately.
2. **Rewrite proof + common work (2, second block)** — one bounded optimization contract.
3. **DataFrame semantic integration + supported streaming reuse (4 + 5 integration)** — group
   related analytics; split into at most two PRs if needed for review.
4. **Topology scheduling/materialization + measured fragmentation follow-up (2 + 3)** — reuse
   inspector evidence to select the actual bottlenecks before fusion.
5. **Native interoperability (6)** — can proceed independently after its dependency audit.
6. **Residency (7)** — after streaming lifetime, retention, and transfer contracts are ready.

Tranche 8 supplies evidence throughout. Prefer one substantial PR per block, at most two when a
shared contract and its consumers genuinely need separate review. Default to master-based PRs;
keep a dependent stack at depth two or less. Completion means code, numerical/structural evidence,
docs, and relevant CI are landed; residual work stays named here rather than disappearing behind
a blanket “done” label.
