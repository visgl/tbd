import React, {Suspense, useEffect, useState} from 'react';
import styles from './hero-streaming-example.module.css';

const LazyGPUDataAnalysisExample = React.lazy(async () => {
  const {GPUDataAnalysisExample} = await import('../examples');
  return {default: GPUDataAnalysisExample};
});

/** The homepage's live, graph-native data example. It loads after the first paint. */
export function HeroStreamingExample(): React.JSX.Element {
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsRequested(true), 260);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.shell} aria-label="Live GPU streaming analytics example">
      <div className={styles.chrome}>
        <span className={styles.liveDot} aria-hidden="true" />
        <span>Live GPU stream</span>
        <span className={styles.chromeMeta}>append · reuse · remove</span>
      </div>
      <div className={styles.stage}>
        {isRequested ? (
          <Suspense fallback={<LoadingState />}>
            <LazyGPUDataAnalysisExample
              embedded
              embeddedHeight={560}
              showHeader={false}
              showStats={false}
            />
          </Suspense>
        ) : (
          <LoadingState />
        )}
      </div>
      <div className={styles.caption}>
        <span>GPUDataFrame</span>
        <span>Incremental command graph</span>
        <span>Zero-copy batches</span>
      </div>
    </div>
  );
}

function LoadingState(): React.JSX.Element {
  return (
    <div className={styles.loading} aria-live="polite" role="status">
      <span className={styles.loadingOrb} aria-hidden="true" />
      <strong>Starting a live batch view…</strong>
      <span>Requesting a WebGPU device and preparing the graph.</span>
    </div>
  );
}
