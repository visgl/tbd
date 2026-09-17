import type {DocumentationTab} from './docs-page-tabs';

export type AnariGuideTabId = 'overview' | 'first-scene' | 'architecture' | 'json-scenes';

export const ANARI_GUIDE_TABS: readonly DocumentationTab<AnariGuideTabId>[] = [
  {id: 'overview', label: 'Overview', href: 'https://luma.gl/docs/api-guide/engine/anari-rendering'},
  {id: 'first-scene', label: 'First scene', href: 'https://luma.gl/docs/api-guide/engine/anari-first-scene'},
  {id: 'architecture', label: 'Architecture', href: 'https://luma.gl/docs/api-guide/engine/anari-architecture'},
  {id: 'json-scenes', label: 'JSON scenes', href: 'https://luma.gl/docs/api-guide/engine/anari-json-scenes'}
];

export type SplatsDocsTabId =
  | 'overview'
  | 'renderers'
  | 'data-shading'
  | 'streaming'
  | 'picking-scenes'
  | 'formats-loaders';

export const SPLATS_DOCS_TABS: readonly DocumentationTab<SplatsDocsTabId>[] = [
  {id: 'overview', label: 'Overview', href: 'https://luma.gl/docs/api-reference/splats'},
  {id: 'renderers', label: 'Renderers', href: 'https://luma.gl/docs/api-reference/splats/renderers'},
  {id: 'data-shading', label: 'Data & shading', href: 'https://luma.gl/docs/api-reference/splats/data-and-shading'},
  {id: 'streaming', label: 'Streaming', href: 'https://luma.gl/docs/api-reference/splats/streaming-and-residency'},
  {id: 'picking-scenes', label: 'Picking & scenes', href: 'https://luma.gl/docs/api-reference/splats/picking-and-scenes'},
  {id: 'formats-loaders', label: 'Formats & loaders', href: 'https://luma.gl/docs/api-reference/splats/formats-and-loaders'}
];

export type GltfCrowdDocsTabId = 'overview' | 'usage' | 'performance' | 'api';

export const GLTF_CROWD_DOCS_TABS: readonly DocumentationTab<GltfCrowdDocsTabId>[] = [
  {id: 'overview', label: 'Overview', href: 'https://luma.gl/docs/api-reference/gltf/gltf-animated-crowd'},
  {id: 'usage', label: 'Usage', href: 'https://luma.gl/docs/api-reference/gltf/gltf-crowd-usage'},
  {id: 'performance', label: 'Performance & LOD', href: 'https://luma.gl/docs/api-reference/gltf/gltf-crowd-performance'},
  {id: 'api', label: 'API', href: 'https://luma.gl/docs/api-reference/gltf/gltf-crowd-api'}
];
