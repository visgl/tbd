//
import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { DeviceTabs, ExampleLoadingIndicator, ExamplePage, getCanvasContainer, InfoBox, LumaExample, ReactExample, type ExampleDisplayProps, useStore } from './react-luma';
import type { Device } from '@luma.gl/core';
import { makeHtmlCustomPanel } from '../../examples/example-panels';
import type { GPUSortExampleHandle } from '../../examples/experimental/gpu-sort/src/app';
import type { GPUDataAnalysisExampleHandle } from '../../examples/experimental/gpu-data-analysis/src/app';
import type { GPGPUShowcaseHandle } from '../../examples/v10/gpgpu/src/app';
import { getErrorMessage, logError } from './react-luma/utils/error-utils';
import { startExclusiveExample } from './react-luma/utils/example-lifecycle';


const exampleConfig = {};

const loadArrowDggsPolygonsApp = () => import('../../examples/arrow/arrow-dggs-polygons/app');

const loadArrowColumnRendererApp = () => import('../../examples/arrow/arrow-columns/app');

const loadArrowMeshGeometryApp = () => import('../../examples/arrow/arrow-mesh-geometry/app');

const loadArrowGeoArrowApp = () => import('../../examples/arrow/arrow-geoarrow/app');

const loadArrowLinesApp = () => import('../../examples/arrow/arrow-lines/app');

const loadArrowFloat64PrecisionApp = () => import('../../examples/arrow/arrow-float64-precision/app');

const loadArrowPointRendererApp = () => import('../../examples/arrow/arrow-points/app');

const loadArrowFilteringApp = () => import('../../examples/arrow/arrow-filtering/app');

const loadArrowPolygonRendererApp = () => import('../../examples/arrow/arrow-polygons/app');

const loadGPUFrustumCullingApp = () => import('../../examples/experimental/gpu-frustum-culling/app');

const loadGPUParquetConstellationApp = () =>
  import('../../examples/experimental/gpu-parquet-constellation/app');

const loadGPUSceneGraphApp = () => import('../../examples/experimental/gpu-scene-graph/app');

const loadGPUTraceSceneApp = () => import('../../examples/experimental/gpu-trace-scene/app');

const loadGPUTraceViewerApp = () => import('../../examples/experimental/gpu-trace-viewer/app');

const loadGPUGraphExplorerApp = () => import('../../examples/experimental/gpu-graph-explorer/app');

const loadLuCIMVolumeLabApp = () => import('../../examples/experimental/lucim-volume-lab/app');

const loadGPT2App = () => import('../../examples/experimental/gpt-2/app');

const loadVideoTextureApp = () => import('../../examples/api/video-texture/app');

const loadArrowParticlesApp = () => import('../../examples/arrow/arrow-particles/app');

const loadDOFApp = () => import('../../examples/showcase/dof/app');

const loadFluidFoundryApp = () => import('../../examples/experimental/fluid-foundry/app');

const loadSpectralCausticsApp = () => import('../../examples/experimental/spectral-caustics/app');

const loadVolumetricFireForgeApp = () => import('../../examples/experimental/volumetric-fire-forge/app');

const loadVirtualGeometryCanyonApp = () => import('../../examples/experimental/virtual-geometry-canyon/app');

const loadGaussianSplatsApp = () => import('../../examples/showcase/gaussian-splats/app');

const loadArrowTemporalStarfieldApp = () => import('../../examples/arrow/arrow-temporal-starfield/app');

const loadArrowTimeColumnsApp = () => import('../../examples/arrow/arrow-time-columns/app');

const loadArrowText2DApp = () => import('../../examples/arrow/arrow-text-2d/app');

const loadInstancingApp = () => import('../../examples/showcase/instancing/app');

const loadLightstormMegacityApp = () => import('../../examples/showcase/lightstorm-megacity/app');

const loadVectorFieldLabApp = () => import('../../examples/showcase/vector-field-lab/app');

const loadSpectralWaveLabApp = () => import('../../examples/showcase/spectral-wave-lab/app');

const loadQuantumStateStudioApp = () => import('../../examples/showcase/quantum-state-studio/app');

const loadTempestOceanApp = () => import('../../examples/showcase/tempest-ocean/app');

const loadTextSpaceCrawlApp = () => import('../../examples/experimental/text-space-crawl/app');

const loadTransformApp = () => import('../../examples/tutorials/transform/app');


const loadBillionPointSpatialAtlasExample = () =>
  import('../../examples/showcase/billion-point-spatial-atlas/app');

const loadMillionRowCrossfilterExample = () =>
  import('../../examples/showcase/million-row-crossfilter/app');

const loadRasterLabExample = () => import('../../examples/showcase/raster-lab/app');

const loadGPUSpatialTaxiExample = () => import('../../examples/deck/luspatial-taxi/app');

const loadGPUGraphExplorerDeckExample = () => import('../../examples/deck/gpu-graph-explorer/app');

const loadGPUSortExample = () => import('../../examples/experimental/gpu-sort/src/app');

const loadGPUDataAnalysisExample = () =>
  import('../../examples/experimental/gpu-data-analysis/src/app');

const loadGPGPUShowcaseExample = () => import('../../examples/v10/gpgpu/src/app');

const loadArrowPathLayerDeckExample = () => import('../../examples/deck/arrow-path-layer/app');

const loadArrowPolygonLayerDeckExample = () =>
  import('../../examples/deck/arrow-polygon-layer/app');

const loadArrowTextLayerDeckExample = () => import('../../examples/deck/arrow-text-layer/app');

const loadGPUCulledTraceDeckExample = () => import('../../examples/deck/gpu-culled-trace/app');


type WebsiteExampleProps = React.PropsWithChildren<
  ExampleDisplayProps & {
    autoStart?: boolean;
    panel?: boolean;
    showHeader?: boolean;
    showStats?: boolean;
    templateInfoPlacement?: 'header' | 'page';
  }
>;


type DeferredExampleModuleState<Module> = {
  module: Module | null;
  errorMessage: string | null;
};


function useDeferredExampleModule<Module>(
  loadModule: () => Promise<Module>,
  enabled = true
): DeferredExampleModuleState<Module> {
  const [moduleState, setModuleState] = useState<DeferredExampleModuleState<Module>>({
    module: null,
    errorMessage: null
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isCancelled = false;
    const loadingTimeout = window.setTimeout(() => {
      void loadModule()
        .then(module => {
          if (!isCancelled) {
            setModuleState({module, errorMessage: null});
          }
        })
        .catch(error => {
          if (!isCancelled) {
            setModuleState({module: null, errorMessage: getErrorMessage(error)});
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(loadingTimeout);
    };
  }, [enabled, loadModule]);

  return moduleState;
}


function DeferredGPUExampleStatus({
  title,
  description,
  errorMessage,
  embedded,
  embeddedHeight,
  style
}: {
  title: string;
  description: string;
  errorMessage?: string | null;
} & WebsiteExampleProps): React.JSX.Element {
  return (
    <ExamplePage
      embedded={embedded}
      embeddedHeight={embeddedHeight}
      runtimeState={errorMessage ? 'failed' : 'loading'}
      style={{
        background:
          'radial-gradient(ellipse at 22% 16%, rgba(56, 189, 248, 0.16), transparent 42%), #07101d',
        ...style
      }}
    >
      <div
        aria-live="polite"
        role={errorMessage ? 'alert' : 'status'}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          alignContent: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 32,
          color: '#f1f5f9',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            color: '#7dd3fc',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          {errorMessage ? 'Unable to load GPU experience' : 'Preparing GPU experience'}
        </span>
        <strong style={{fontSize: 22, lineHeight: 1.2}}>{title}</strong>
        <span style={{maxWidth: 420, color: '#b6c5d7', fontSize: 14, lineHeight: 1.6}}>
          {errorMessage || description}
        </span>
      </div>
    </ExamplePage>
  );
}


type DeckExampleHandle = {
  finalize: () => void;
};

type CreateDeckExample = (
  parent: HTMLDivElement,
  options: {device: Device}
) =>
  | DeckExampleHandle
  | Promise<DeckExampleHandle>;


const createDeferredArrowPathLayerDeck: CreateDeckExample = (parent, options) =>
  loadArrowPathLayerDeckExample().then(({createArrowPathLayerDeck}) =>
    createArrowPathLayerDeck(parent, options)
  );

const createDeferredArrowPolygonLayerDeck: CreateDeckExample = (parent, options) =>
  loadArrowPolygonLayerDeckExample().then(({createArrowPolygonLayerDeck}) =>
    createArrowPolygonLayerDeck(parent, options)
  );

const createDeferredArrowTextLayerDeck: CreateDeckExample = (parent, options) =>
  loadArrowTextLayerDeckExample().then(({createArrowTextLayerDeck}) =>
    createArrowTextLayerDeck(parent, options)
  );

const createDeferredGPUCulledTraceDeck: CreateDeckExample = (parent, options) =>
  loadGPUCulledTraceDeckExample().then(({createGPUCulledTraceDeck}) =>
    createGPUCulledTraceDeck(parent, options)
  );


type DeckArrowLayerPanelProps = {
  id: string;
  title: string;
  devices?: Array<'webgpu' | 'webgl2'>;
};


async function makeDeckArrowLayerInfoPanel({id, title}: DeckArrowLayerPanelProps) {
  const {makeArrowExamplePanelHostHtml} = await import('../../examples/arrow/arrow-example-panels');
  return makeHtmlCustomPanel({
    id: `${id}-info`,
    title,
    html: makeArrowExamplePanelHostHtml()
  });
}


function DeckArrowLayerPanel({id, title, devices = ['webgpu', 'webgl2']}: DeckArrowLayerPanelProps) {
  const [panel, setPanel] = useState<Awaited<ReturnType<typeof makeDeckArrowLayerInfoPanel>>>();

  useEffect(() => {
    let isCancelled = false;
    void makeDeckArrowLayerInfoPanel({id, title})
      .then(nextPanel => {
        if (!isCancelled) {
          setPanel(nextPanel);
        }
      })
      .catch(error => {
        if (!isCancelled) {
          logError(`Failed to load ${id} Arrow inspection panel`, error);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id, title]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 20,
        padding: '12px 20px',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <InfoBox
          id={id}
          title={title}
          sourcePath={`examples/deck/${id}/app.ts`}
          style={{pointerEvents: 'auto'}}
          panel={panel}
        />
        <DeviceTabs
          devices={devices}
          style={{flexShrink: 0, marginLeft: 'auto', pointerEvents: 'auto'}}
        />
      </div>
    </div>
  );
}


function DeckArrowLayerCanvas({
  createDeck,
  panel
}: {
  createDeck: CreateDeckExample;
  panel: DeckArrowLayerPanelProps;
}): React.ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const device = useStore(state => state.device);
  const [runtimeState, setRuntimeState] = useState<'loading' | 'running' | 'failed'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !device) {
      return;
    }
    setRuntimeState('loading');
    setErrorMessage(null);

    const deviceCanvas = device.getDefaultCanvasContext().canvas;
    if (!(deviceCanvas instanceof HTMLCanvasElement)) {
      throw new Error('Website Deck examples require the shared device canvas to be an HTMLCanvasElement');
    }
    let isFinalized = false;
    let deck: DeckExampleHandle | null = null;
    const stopExclusiveExample = startExclusiveExample({
      start: async () => {
        Object.assign(deviceCanvas.style, {
          display: 'block',
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%'
        });
        container.replaceChildren(deviceCanvas);
        void device.lost.then(loss => {
          if (!isFinalized && loss.reason !== 'destroyed') {
            setErrorMessage(loss.message || 'The graphics device was lost while this example ran.');
            setRuntimeState('failed');
          }
        });
        deck = await createDeck(container, {device});
        if (!isFinalized) {
          setRuntimeState('running');
        }
      },
      stop: () => {
        isFinalized = true;
        deck?.finalize();
        deck = null;
        container.replaceChildren();
        getCanvasContainer().appendChild(deviceCanvas);
      },
      onError: error => {
        if (!isFinalized) {
          setErrorMessage(getErrorMessage(error));
          setRuntimeState('failed');
          logError(`Failed to initialize ${panel.id} Deck example`, error);
        }
      }
    });

    return () => {
      isFinalized = true;
      container.replaceChildren();
      stopExclusiveExample();
    };
  }, [createDeck, device, panel.id]);

  return (
    <div data-luma-example-state={runtimeState} style={{position: 'absolute', inset: 0}}>
      <div ref={containerRef} style={{position: 'absolute', inset: 0, overflow: 'hidden'}} />
      <DeckArrowLayerPanel {...panel} />
      {runtimeState === 'loading' ? <ExampleLoadingIndicator /> : null}
      {errorMessage ? (
        <div role="alert" style={{position: 'absolute', inset: 20, zIndex: 30}}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}


type DeckArrowLayerExampleProps = {
  embedded?: boolean;
};


const DECK_ARROW_LAYER_EMBEDDED_STYLE: React.CSSProperties = {
  boxSizing: 'border-box',
  height: '640px',
  minHeight: '640px',
  margin: '1rem 0 2rem',
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '8px',
  overflow: 'hidden'
};


export const DeckArrowPathLayerExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => (
  <ReactExample
    component={DeckArrowLayerCanvas}
    componentProps={{
      createDeck: createDeferredArrowPathLayerDeck,
      panel: {
        id: 'arrow-path-layer',
        title: 'Arrow Path Layer'
      }
    }}
    showStats={false}
    style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
  />
);


export const DeckArrowPolygonLayerExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => (
  <ReactExample
    component={DeckArrowLayerCanvas}
    componentProps={{
      createDeck: createDeferredArrowPolygonLayerDeck,
      panel: {
        id: 'arrow-polygon-layer',
        title: 'Arrow Polygon Layer'
      }
    }}
    showStats={false}
    style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
  />
);


export const DeckArrowTextLayerExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => (
  <ReactExample
    component={DeckArrowLayerCanvas}
    componentProps={{
      createDeck: createDeferredArrowTextLayerDeck,
      panel: {
        id: 'arrow-text-layer',
        title: 'Arrow Text Layer'
      }
    }}
    showStats={false}
    style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
  />
);


export const DeckGPUCulledTraceExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => (
  <ReactExample
    component={DeckArrowLayerCanvas}
    componentProps={{
      createDeck: createDeferredGPUCulledTraceDeck,
      panel: {
        id: 'gpu-culled-trace',
        title: 'GPU-Culled Trace with Arrow Text',
        devices: ['webgpu']
      }
    }}
    showStats={false}
    style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
  />
);


export const DeckGPUSpatialTaxiExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => {
  const {module, errorMessage} = useDeferredExampleModule(loadGPUSpatialTaxiExample);

  if (!module) {
    return (
      <DeferredGPUExampleStatus
        title="GPU Project + luSpatial Taxi Explorer"
        description="Loading the projection, spatial-query, and interactive map tools."
        errorMessage={errorMessage}
        embedded={embedded}
        style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
      />
    );
  }

  return (
    <ReactExample
      component={DeckArrowLayerCanvas}
      componentProps={{
        createDeck: module.createGPUSpatialTaxiDeck,
        panel: {
          id: 'luspatial-taxi',
          title: 'GPU Project + luSpatial Taxi Explorer',
          devices: ['webgpu']
        }
      }}
      showStats={false}
      style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
    />
  );
};


/** Loads the optional deck.gl graph integration only when its WebGPU example is opened. */
export const DeckGPUGraphExplorerExample: React.FC<DeckArrowLayerExampleProps> = ({
  embedded = false
}) => {
  const {module, errorMessage} = useDeferredExampleModule(loadGPUGraphExplorerDeckExample);

  if (!module) {
    return (
      <DeferredGPUExampleStatus
        title="GPU Graph + deck.gl Network Explorer"
        description="Loading GPU graph analytics, progressive layout, and direct deck.gl layers."
        errorMessage={errorMessage}
        embedded={embedded}
        style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
      />
    );
  }

  return (
    <ReactExample
      component={DeckArrowLayerCanvas}
      componentProps={{
        createDeck: module.createGPUGraphExplorerDeck,
        panel: {
          id: 'gpu-graph-explorer',
          title: 'GPU Graph + deck.gl Network Explorer',
          devices: ['webgpu']
        }
      }}
      showStats={false}
      style={embedded ? DECK_ARROW_LAYER_EMBEDDED_STYLE : undefined}
    />
  );
};


type DeckArrowLayerExampleId = 'path' | 'polygon' | 'text';


const DECK_ARROW_LAYER_DOC_EXAMPLES: Array<{
  id: DeckArrowLayerExampleId;
  label: string;
  Example: React.FC<DeckArrowLayerExampleProps>;
}> = [
  {id: 'path', label: 'Paths', Example: DeckArrowPathLayerExample},
  {id: 'polygon', label: 'Polygons', Example: DeckArrowPolygonLayerExample},
  {id: 'text', label: 'Text', Example: DeckArrowTextLayerExample}
];


/** Embeds one live Arrow renderer example at a time in the luma.gl Arrow documentation. */
export const ArrowRenderingDocsExample: React.FC = () => {
  const [activeExampleId, setActiveExampleId] = useState<DeckArrowLayerExampleId>('path');
  const activeExample = DECK_ARROW_LAYER_DOC_EXAMPLES.find(
    example => example.id === activeExampleId
  )!;
  const ActiveExample = activeExample.Example;

  return (
    <section aria-label="Arrow rendering examples">
      <div className="docs-page-tabs" role="tablist" aria-label="Arrow renderers">
        {DECK_ARROW_LAYER_DOC_EXAMPLES.map(example => (
          <button
            key={example.id}
            className={
              example.id === activeExampleId
                ? 'docs-page-tabs__tab docs-page-tabs__tab--active'
                : 'docs-page-tabs__tab'
            }
            type="button"
            role="tab"
            aria-selected={example.id === activeExampleId}
            onClick={() => setActiveExampleId(example.id)}
          >
            {example.label}
          </button>
        ))}
      </div>
      <ActiveExample embedded />
    </section>
  );
};


const GPGPU_EXAMPLE_STYLE = `
  .gpgpu-showcase {
    box-sizing: border-box;
    min-height: 100%;
    padding: 22px;
    background: #f7f8fb;
    color: #16202f;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .gpgpu-showcase * {
    box-sizing: border-box;
  }

  .gpgpu-showcase h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1.2;
    font-weight: 720;
  }

  .gpgpu-showcase .subtitle {
    max-width: 860px;
    margin: 8px 0 18px;
    color: #5b6678;
    font-size: 14px;
    line-height: 1.45;
  }

  .gpgpu-showcase .metadata-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(140px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }

  .gpgpu-showcase .metric {
    border: 1px solid #d9dee8;
    border-radius: 8px;
    background: #fff;
    padding: 10px 12px;
  }

  .gpgpu-showcase .metric span,
  .gpgpu-showcase .header-cell small,
  .gpgpu-showcase .expression-note,
  .gpgpu-showcase .status {
    color: #697386;
    font-size: 12px;
  }

  .gpgpu-showcase .metric strong {
    display: block;
    margin-top: 3px;
    font-size: 16px;
    font-variant-numeric: tabular-nums;
  }

  .gpgpu-showcase .expression-panel {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  .gpgpu-showcase .expression-panel label {
    font-size: 13px;
    font-weight: 680;
  }

  .gpgpu-showcase .expression-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  .gpgpu-showcase .expression-row input,
  .gpgpu-showcase .expression-row button {
    border: 1px solid #cfd6e2;
    border-radius: 8px;
    background: #fff;
    color: inherit;
    font: 14px/1.4 ui-monospace, "SFMono-Regular", Consolas, monospace;
    padding: 9px 10px;
  }

  .gpgpu-showcase .expression-row button {
    min-width: 76px;
    background: #eef2f7;
    color: #7b8494;
  }

  .gpgpu-showcase .table-panel {
    min-width: 0;
    border: 1px solid #d9dee8;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }

  .gpgpu-showcase .table-row-grid {
    display: grid;
    grid-template-columns: var(
      --table-grid-template,
      112px minmax(300px, 1.2fr) minmax(120px, 0.45fr) minmax(320px, 1.25fr)
    );
  }

  .gpgpu-showcase .table-header-clip {
    border-bottom: 1px solid #d9dee8;
    background: #f2f5f9;
    overflow: hidden;
  }

  .gpgpu-showcase .table-header {
    min-width: 880px;
    will-change: transform;
  }

  .gpgpu-showcase .header-cell,
  .gpgpu-showcase .table-cell {
    min-width: 0;
    border-right: 1px solid #e4e8f0;
    padding: 8px 10px;
  }

  .gpgpu-showcase .header-cell:last-child,
  .gpgpu-showcase .table-cell:last-child {
    border-right: 0;
  }

  .gpgpu-showcase .header-cell span {
    display: block;
    font-size: 13px;
    font-weight: 720;
  }

  .gpgpu-showcase .header-cell small {
    display: block;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .gpgpu-showcase .table-scroll {
    height: calc(100vh - 380px);
    min-height: 360px;
    overflow: auto;
    position: relative;
    contain: strict;
  }

  .gpgpu-showcase .row-layer {
    position: relative;
    min-width: 880px;
  }

  .gpgpu-showcase .data-row {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 34px;
  }

  .gpgpu-showcase .data-row .table-cell {
    height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #edf0f5;
    font: 12px/33px ui-monospace, "SFMono-Regular", Consolas, monospace;
    font-variant-numeric: tabular-nums;
  }

  .gpgpu-showcase .row-index {
    color: #596579;
    background: #fbfcfe;
  }

  .gpgpu-showcase .status {
    border-top: 1px solid #d9dee8;
    padding: 8px 10px;
    min-height: 30px;
  }

  @media (max-width: 760px) {
    .gpgpu-showcase {
      padding: 14px;
    }

    .gpgpu-showcase .metadata-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .gpgpu-showcase .table-row-grid {
      grid-template-columns: var(--table-grid-template, 96px 260px 120px 280px);
    }
  }
`;


// Showcase Examples

export const ANARIPlaygroundExample: React.FC = () => {
  const source = useBaseUrl('/standalone-examples/scene/playground.html');

  return (
    <ExamplePage style={{background: '#070913', minHeight: '720px'}}>
      <iframe
        title="ANARI Scene Lab"
        src={source}
        allow="clipboard-write"
        style={{border: 0, height: '100%', inset: 0, position: 'absolute', width: '100%'}}
      />
    </ExamplePage>
  );
};


export const GaussianSplatsExample: React.FC<WebsiteExampleProps> = props => {
  if (typeof window !== 'undefined') {
    delete window.__lumaGaussianSplatsLoaderBundleUrl;
  }

  return (
    <LumaExample
      id="gaussian-splats"
      title="Gaussian Splats"
      subtitle="Progressive HDR Gaussian splat rendering"
      directory="showcase"
      devices={['webgpu', 'webgl2']}
      loadTemplate={loadGaussianSplatsApp}
      config={exampleConfig}
      canvasContextProfile="high-dynamic-range"
      showStats
      {...props}
    />
  );
};


export const InstancingExample: React.FC = props => (
  <LumaExample
    id="instancing"
    directory="showcase"
    loadTemplate={loadInstancingApp}
    config={exampleConfig}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const LightstormMegacityExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="lightstorm-megacity"
    title="Lightstorm Megacity"
    subtitle="GPU-driven city at data scale"
    directory="showcase"
    devices={['webgpu']}
    loadTemplate={loadLightstormMegacityApp}
    config={exampleConfig}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const VectorFieldLabExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="vector-field-lab"
    title="Vector Field Lab"
    subtitle="Orbit linked 3D gradient, divergence, curl, and Laplacian volumes"
    directory="showcase"
    devices={['webgpu']}
    loadTemplate={loadVectorFieldLabApp}
    config={exampleConfig}
    {...props}
  />
);


export const SpectralWaveLabExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="spectral-wave-lab"
    title="Spectral Dynamics Lab"
    subtitle="One GPU wave state in synchronized physical and Fourier views"
    directory="showcase"
    devices={['webgpu']}
    loadTemplate={loadSpectralWaveLabApp}
    config={exampleConfig}
    {...props}
  />
);


export const QuantumStateStudioExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="quantum-state-studio"
    title="Quantum State Studio"
    subtitle="GPU-resident state vectors · linked probability, phase, Bloch, and correlation views"
    directory="showcase"
    devices={['webgpu']}
    loadTemplate={loadQuantumStateStudioApp}
    config={exampleConfig}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const BillionPointSpatialAtlasExample: React.FC<WebsiteExampleProps> = props => {
  const {module, errorMessage} = useDeferredExampleModule(loadBillionPointSpatialAtlasExample);

  if (!module) {
    return (
      <DeferredGPUExampleStatus
        {...props}
        title="Billion-Point Spatial Atlas"
        description="Loading the GPU-native spatial index and interactive atlas."
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <LumaExample
      id="billion-point-spatial-atlas"
      title="Billion-Point Spatial Atlas"
      subtitle="Indexed geospatial queries and indirect rendering at data scale"
      directory="showcase"
      devices={['webgpu']}
      template={module.default}
      config={exampleConfig}
      canvasContextProfile="high-dynamic-range"
      {...props}
    />
  );
};


export const MillionRowCrossfilterExample: React.FC<WebsiteExampleProps> = props => {
  const {module, errorMessage} = useDeferredExampleModule(loadMillionRowCrossfilterExample);

  if (!module) {
    return (
      <DeferredGPUExampleStatus
        {...props}
        title="GPUCrossfilter: Million-Row Crossfilter Explorer"
        description="Loading the million-row linked dashboard and GPU filtering pipeline."
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <LumaExample
      id="million-row-crossfilter"
      title="Million-Row Crossfilter Explorer"
      subtitle="One million points · one GPU-resident linked dashboard"
      directory="showcase"
      devices={['webgpu']}
      template={module.default}
      config={exampleConfig}
      {...props}
    />
  );
};


export const RasterLabExample: React.FC<WebsiteExampleProps> = props => {
  const {module, errorMessage} = useDeferredExampleModule(loadRasterLabExample);

  if (!module) {
    return (
      <DeferredGPUExampleStatus
        {...props}
        title="GPURaster: Satellite Raster Lab"
        description="Loading synthetic satellite bands and the GPU-native raster-analysis graph."
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <LumaExample
      id="raster-lab"
      title="Satellite Raster Lab"
      subtitle="GPU-resident reflectance · masked NDVI · valid-pixel histograms"
      directory="showcase"
      devices={['webgpu']}
      template={module.default}
      config={exampleConfig}
      {...props}
    />
  );
};


export const TempestOceanExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="tempest-ocean"
    title="Tempest Ocean: Spectral Stormfront"
    subtitle="GPUFFT2D displacement · HDR whitecaps"
    directory="showcase"
    devices={['webgpu']}
    loadTemplate={loadTempestOceanApp}
    config={exampleConfig}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const ArrowText2DExample: React.FC = props => (
  <LumaExample
    id="arrow-text-2d"
    title="Text"
    directory="arrow"
    loadTemplate={loadArrowText2DApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowTimeColumnsExample: React.FC = props => (
  <LumaExample
    id="arrow-time-columns"
    title="Time"
    directory="arrow"
    loadTemplate={loadArrowTimeColumnsApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowTemporalStarfieldExample: React.FC = props => (
  <LumaExample
    id="arrow-temporal-starfield"
    title="Durations"
    directory="arrow"
    loadTemplate={loadArrowTemporalStarfieldApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowLinesExample: React.FC = props => (
  <LumaExample
    id="arrow-lines"
    title="Lines"
    directory="arrow"
    loadTemplate={loadArrowLinesApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowFloat64PrecisionExample: React.FC = props => (
  <LumaExample
    id="arrow-float64-precision"
    title="Float64 Origin Rebasing"
    directory="arrow"
    loadTemplate={loadArrowFloat64PrecisionApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowGeoArrowExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="arrow-geoarrow"
    title="GeoArrow"
    directory="arrow"
    loadTemplate={loadArrowGeoArrowApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowPointRendererExample: React.FC = props => (
  <LumaExample
    id="arrow-points"
    title="Points"
    directory="arrow"
    loadTemplate={loadArrowPointRendererApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowFilteringExample: React.FC = props => (
  <LumaExample
    id="arrow-filtering"
    title="ShaderPlugin Filtering"
    directory="arrow"
    loadTemplate={loadArrowFilteringApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowColumnRendererExample: React.FC = props => (
  <LumaExample
    id="arrow-columns"
    title="DGGS + time"
    directory="arrow"
    loadTemplate={loadArrowColumnRendererApp}
    config={exampleConfig}
    devices={['webgpu']}
    showStats
    {...props}
  />
);


export const ArrowPolygonRendererExample: React.FC = props => (
  <LumaExample
    id="arrow-polygons"
    title="Polygons"
    directory="arrow"
    loadTemplate={loadArrowPolygonRendererApp}
    config={exampleConfig}
    showStats
    {...props}
  />
);


export const ArrowDggsPolygonsExample: React.FC = props => (
  <LumaExample
    id="arrow-dggs-polygons"
    title="Global Grids"
    directory="arrow"
    loadTemplate={loadArrowDggsPolygonsApp}
    config={exampleConfig}
    devices={['webgpu']}
    showStats
    {...props}
  />
);


export const GPGPUExample: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const deviceType = useStore(store => store.deviceType);
  const device = useStore(store => store.device);

  useEffect(() => {
    if (!deviceType?.startsWith('webgpu-') || !device) {
      return;
    }

    let handle: GPGPUShowcaseHandle | null = null;
    setErrorMessage(null);
    setIsRunning(false);
    let isCancelled = false;
    const stopExclusiveExample = startExclusiveExample({
      start: async () => {
        const {initializeGPGPUShowcase} = await loadGPGPUShowcaseExample();
        if (!isCancelled) {
          handle = initializeGPGPUShowcase({device});
          setIsRunning(true);
        }
      },
      stop: () => {
        isCancelled = true;
        setIsRunning(false);
        handle?.destroy();
        handle = null;
      },
      onError: error => {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error));
          logError('Failed to initialize GPGPU example', error);
        }
      }
    });

    return () => {
      isCancelled = true;
      stopExclusiveExample();
    };
  }, [deviceType, device]);

  return (
    <ExamplePage
      runtimeState={errorMessage ? 'failed' : isRunning ? 'running' : 'loading'}
      style={{background: '#f7f8fb', overflow: 'hidden'}}
    >
      <style>{GPGPU_EXAMPLE_STYLE}</style>
      <main id="app" className="gpgpu-showcase">
        <DeviceTabs devices={['webgpu']} style={{marginBottom: 16}} />
        <h1>@luma.gl/gpgpu evaluator showcase</h1>
        <p className="subtitle">
          Arrow-backed source columns are extracted as typed-array views and wrapped in
          GPUDataEvaluator inputs.
        </p>

        <div className="metadata-grid">
          <div className="metric">
            <span>Rows</span>
            <strong id="metadata-rows">-</strong>
          </div>
          <div className="metric">
            <span>Columns</span>
            <strong id="metadata-columns">-</strong>
          </div>
          <div className="metric">
            <span>Metric Values</span>
            <strong id="metadata-metric-values">-</strong>
          </div>
          <div className="metric">
            <span>Arrow Batches</span>
            <strong id="metadata-arrow-batches">-</strong>
          </div>
        </div>

        <form id="expression-form" className="expression-panel">
          <label htmlFor="expression-input">Expression</label>
          <div className="expression-row">
            <input
              id="expression-input"
              type="text"
              defaultValue="fround(coordinates)"
              spellCheck={false}
            />
            <button id="expression-run" type="submit" disabled>
              Run
            </button>
          </div>
          <div id="expression-message" className="expression-note">
            Run an expression to append its evaluated output as the last table column.
          </div>
          {errorMessage ? (
            <div className="expression-note" role="alert">
              {errorMessage}
            </div>
          ) : null}
        </form>

        <section className="table-panel">
          <div className="table-header-clip">
            <div id="table-header" className="table-header table-row-grid" />
          </div>
          <div id="table-scroll" className="table-scroll">
            <div id="table-row-layer" className="row-layer" />
          </div>
          <div id="table-status" className="status">
            Generating Arrow table...
          </div>
        </section>
      </main>
    </ExamplePage>
  );
};


/** Docusaurus wrapper for the graph-native paired GPU sort example. */
export const GPUSortExample: React.FC<WebsiteExampleProps> = ({embeddedHeight, ...props}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let handle: GPUSortExampleHandle | null = null;
    const stopExclusiveExample = startExclusiveExample({
      start: async () => {
        const {initializeGPUSortExample} = await loadGPUSortExample();
        if (!isCancelled) {
          handle = initializeGPUSortExample();
          setIsRunning(true);
        }
      },
      stop: () => {
        isCancelled = true;
        setIsRunning(false);
        handle?.destroy();
        handle = null;
      },
      onError: error => {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error));
          logError('Failed to initialize GPU sort example', error);
        }
      }
    });

    return () => {
      isCancelled = true;
      stopExclusiveExample();
    };
  }, []);

  return (
    <ExamplePage
      {...props}
      embeddedHeight={embeddedHeight ?? (props.embedded ? 720 : undefined)}
      runtimeState={errorMessage ? 'failed' : isRunning ? 'running' : 'loading'}
      style={{background: '#f7f8fb', overflow: 'auto', ...props.style}}
    >
      <main id="gpu-sort-app" />
      {errorMessage ? (
        <p role="alert" style={{padding: 22}}>
          {errorMessage}
        </p>
      ) : null}
    </ExamplePage>
  );
};


/** Docusaurus wrapper for the graph-native data-analysis example. */
export const GPUDataAnalysisExample: React.FC<WebsiteExampleProps> = ({
  embeddedHeight,
  ...props
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let handle: GPUDataAnalysisExampleHandle | null = null;
    const stopExclusiveExample = startExclusiveExample({
      start: async () => {
        const {initializeGPUDataAnalysisExample} = await loadGPUDataAnalysisExample();
        if (!isCancelled) {
          handle = initializeGPUDataAnalysisExample();
          setIsRunning(true);
        }
      },
      stop: () => {
        isCancelled = true;
        setIsRunning(false);
        handle?.destroy();
        handle = null;
      },
      onError: error => {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error));
          logError('Failed to initialize GPU data-analysis example', error);
        }
      }
    });
    return () => {
      isCancelled = true;
      stopExclusiveExample();
    };
  }, []);

  return (
    <ExamplePage
      {...props}
      embeddedHeight={embeddedHeight ?? (props.embedded ? 720 : undefined)}
      runtimeState={errorMessage ? 'failed' : isRunning ? 'running' : 'loading'}
      style={{background: '#f6f8fb', overflow: 'auto', ...props.style}}
    >
      <main id="gpu-data-analysis-app" />
      {errorMessage ? (
        <p role="alert" style={{padding: 22}}>
          {errorMessage}
        </p>
      ) : null}
    </ExamplePage>
  );
};


export const GPT2Example: React.FC = props => (
  <LumaExample
    id="gpt-2"
    title="GPT-2 Transformer"
    directory="experimental"
    devices={['webgpu']}
    showHeader={false}
    showStats={false}
    templateInfoPlacement="page"
    loadTemplate={loadGPT2App}
    config={exampleConfig}
    {...props}
  />
);


export const TextSpaceCrawlExample: React.FC = props => (
  <LumaExample
    id="text-space-crawl"
    title="Text Space Crawl"
    directory="experimental"
    loadTemplate={loadTextSpaceCrawlApp}
    config={exampleConfig}
    {...props}
  />
);


export const DOFExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="dof"
    title="Depth of Field"
    directory="showcase"
    loadTemplate={loadDOFApp}
    config={exampleConfig}
    {...props}
  />
);


export const FluidFoundryExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="fluid-foundry"
    title="Fluid Foundry: Liquid Metal Press"
    subtitle="GPU-resident MLS-MPM fluid"
    directory="experimental"
    loadTemplate={loadFluidFoundryApp}
    config={exampleConfig}
    devices={['webgpu']}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const SpectralCausticsExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="spectral-caustics"
    title="Spectral Caustics: Prism Cathedral"
    directory="experimental"
    loadTemplate={loadSpectralCausticsApp}
    config={exampleConfig}
    devices={['webgpu']}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const VolumetricFireForgeExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="volumetric-fire-forge"
    title="Volumetric Fire Forge"
    subtitle="Reactive HDR fire on the GPU"
    directory="experimental"
    loadTemplate={loadVolumetricFireForgeApp}
    config={exampleConfig}
    devices={['webgpu']}
    canvasContextProfile="high-dynamic-range"
    {...props}
  />
);


export const LuCIMVolumeLabExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="lucim-volume-lab"
    title="LuCIM Volume Lab"
    subtitle="GPU-resident tri-planar volume segmentation"
    directory="experimental"
    loadTemplate={loadLuCIMVolumeLabApp}
    config={exampleConfig}
    devices={['webgpu']}
    {...props}
  />
);


export const VirtualGeometryCanyonExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="virtual-geometry-canyon"
    title="Virtual Geometry Canyon"
    subtitle="GPU-driven hierarchical terrain LOD"
    directory="experimental"
    loadTemplate={loadVirtualGeometryCanyonApp}
    config={exampleConfig}
    devices={['webgpu']}
    {...props}
  />
);


export const VideoTextureExample: React.FC<WebsiteExampleProps> = props => {
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'pending' | 'live' | 'error'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraBlocked, setIsCameraBlocked] = useState(false);
  const handleUseCamera = async () => {
    const app = (await loadVideoTextureApp()).default.current;
    if (!app) {
      setCameraStatus('error');
      setCameraError('Example is still starting');
      return;
    }

    setCameraStatus('pending');
    setCameraError(null);
    setIsCameraBlocked(false);
    try {
      await app.useCamera();
      setCameraStatus('live');
    } catch (error) {
      setCameraStatus('error');
      setCameraError(getCameraErrorMessage(error));
      setIsCameraBlocked(isCameraPermissionBlocked(error));
    }
  };

  return (
    <LumaExample
      id="video-texture"
      title="Video Texture"
      directory="api"
      loadTemplate={loadVideoTextureApp}
      config={exampleConfig}
      headerControls={
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 12}}>
          <button
            type="button"
            onClick={() => void handleUseCamera()}
            disabled={cameraStatus === 'pending' || cameraStatus === 'live' || isCameraBlocked}
            style={{
              border: '1px solid #0f766e',
              borderRadius: 999,
              background: cameraStatus === 'live' ? '#ccfbf1' : '#fff',
              color: '#0f172a',
              cursor:
                cameraStatus === 'pending' || cameraStatus === 'live' || isCameraBlocked
                  ? 'default'
                  : 'pointer',
              font: '600 14px system-ui, sans-serif',
              padding: '8px 12px'
            }}
          >
            {cameraStatus === 'pending'
              ? 'Starting camera'
              : cameraStatus === 'live'
                ? 'Camera live'
                : isCameraBlocked
                  ? 'Camera blocked'
                : cameraStatus === 'error'
                  ? 'Retry camera'
                  : 'Use camera'}
          </button>
          {cameraStatus === 'pending' ? <span>Waiting for first frame</span> : null}
          {cameraError ? <span>{cameraError}</span> : null}
        </div>
      }
      {...props}
    />
  );
};


function isCameraPermissionBlocked(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}


function getCameraErrorMessage(error: unknown): string {
  return isCameraPermissionBlocked(error)
    ? 'Allow camera access in browser or system settings'
    : getErrorMessage(error);
}


export const GPUTraceViewerExample: React.FC = props => (
  <LumaExample
    id="gpu-trace-viewer"
    title="GPU Hierarchical Trace Viewer"
    directory="experimental"
    devices={['webgpu-max']}
    loadTemplate={loadGPUTraceViewerApp}
    config={exampleConfig}
    {...props}
  />
);


export const GPUGraphExplorerExample: React.FC<WebsiteExampleProps> = props => (
  <LumaExample
    id="gpu-graph-explorer"
    title="GPU Graph Interactive Graph Explorer"
    subtitle="GPU-native topology, analytics, selection, and progressive force layout"
    directory="experimental"
    devices={['webgpu']}
    loadTemplate={loadGPUGraphExplorerApp}
    config={exampleConfig}
    {...props}
  />
);


export const GPUTraceSceneExample: React.FC = props => (
  <LumaExample
    id="gpu-trace-scene"
    title="GPU Scene Trace Explorer"
    directory="experimental"
    devices={['webgpu-max']}
    loadTemplate={loadGPUTraceSceneApp}
    config={exampleConfig}
    {...props}
  />
);


export const GPUSceneGraphExample: React.FC = props => (
  <LumaExample
    id="gpu-scene-graph"
    title="GPU Scene Graph Explorer"
    directory="experimental"
    devices={['webgpu-max']}
    loadTemplate={loadGPUSceneGraphApp}
    config={exampleConfig}
    {...props}
  />
);


export const GPUFrustumCullingExample: React.FC = props => (
  <LumaExample
    id="gpu-frustum-culling"
    title="GPU Frustum Culling"
    directory="experimental"
    devices={['webgpu']}
    loadTemplate={loadGPUFrustumCullingApp}
    config={exampleConfig}
    {...props}
  />
);


export const GPUParquetConstellationExample: React.FC = props => (
  <LumaExample
    id="gpu-parquet-constellation"
    title="GPU Parquet Constellation"
    directory="experimental"
    devices={['webgpu-max']}
    loadTemplate={loadGPUParquetConstellationApp}
    config={exampleConfig}
    {...props}
  />
);


export const ArrowMeshGeometryExample: React.FC = props => (
  <LumaExample
    id="arrow-mesh-geometry"
    title="Matrices"
    directory="arrow"
    loadTemplate={loadArrowMeshGeometryApp}
    config={exampleConfig}
    {...props}
  />
);


export const ArrowParticlesExample: React.FC = props => (
  <LumaExample
    id="arrow-particles"
    title="Particles"
    directory="arrow"
    loadTemplate={loadArrowParticlesApp}
    config={exampleConfig}
    {...props}
  />
);


export const TransformExample: React.FC = props => (
  <LumaExample
    id="transform"
    directory="tutorials"
    loadTemplate={loadTransformApp}
    config={exampleConfig}
    showStats={false}
    stackBlitz
    devices={['webgl2']}
    {...props}
  />
);