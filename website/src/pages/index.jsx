import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {ExampleCard} from '../components/example-card';
import {HeroStreamingExample} from '../components/hero-streaming-example';
import styles from './index.module.css';

const FEATURED_EXAMPLES = [
  ['GPU Data Analysis', 'GPU compute', 'Stream batches through reductions, histograms, grids, and grouped aggregates.', 'experimental/gpu-data-analysis', 'experimental/gpu-data-analysis.jpg', ['streaming', 'compute'], 'advanced', 'experimental'],
  ['Million Row Crossfilter', 'Data visualization', 'Brush, filter, and explore a linked GPU-resident dataset without readbacks.', 'showcase/million-row-crossfilter', 'showcase/million-row-crossfilter.jpg', ['data', 'interactive'], 'advanced', 'experimental'],
  ['GPU Frustum Culling', 'GPU rendering', 'Cull and draw thousands of objects with a command graph on the GPU.', 'experimental/gpu-frustum-culling', 'experimental/gpu-frustum-culling.jpg', ['rendering', 'compute'], 'advanced', 'experimental'],
  ['Raster Lab', 'Raster analytics', 'Compose raster operations over chunked data and keep intermediate results reusable.', 'showcase/raster-lab', 'showcase/raster-lab.jpg', ['raster', 'data'], 'intermediate', 'stable'],
  ['Arrow Filtering', 'GPU data', 'Filter Arrow columns in place and pass the selected vector to the next stage.', 'arrow/arrow-filtering', 'arrow/arrow-filtering.jpg', ['arrow', 'data'], 'intermediate', 'stable'],
  ['Fluid Foundry', 'Simulation', 'A real-time fluid simulation built from reusable GPU compute primitives.', 'experimental/fluid-foundry', 'experimental/fluid-foundry.jpg', ['simulation', 'compute'], 'advanced', 'experimental']
];

export default function Home() {
  const baseUrl = useBaseUrl('/');
  return (
    <Layout title="GPU compute" description="GPU command graphs and data compute for the web">
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>vis.gl · a GPU compute foundation</p>
            <h1 id="hero-title">GPU compute, from batches to live views.</h1>
            <p className={styles.heroLead}>
              Build command graphs over chunked data. Keep vectors on the GPU, compose reusable
              operations, and turn a stream of batches into a living analytical view.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} to="/docs/getting-started">
                Get started <span aria-hidden="true">→</span>
              </Link>
              <Link className={styles.secondaryAction} to="/examples">
                Browse examples <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <ul className={styles.capabilities} aria-label="Capabilities">
              <li>WebGPU + WebGL2</li>
              <li>Zero-copy batches</li>
              <li>Incremental graphs</li>
            </ul>
          </div>
          <div className={styles.heroExample}>
            <HeroStreamingExample />
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-title">
          <div>
            <p className={styles.sectionEyebrow}>The foundation</p>
            <h2 id="intro-title">One graph for every batch.</h2>
          </div>
          <p>
            Treat a single resource or a vector of chunks the same way. The graph tracks ownership,
            dependencies, and invalidation so new data can reuse the work already done.
          </p>
        </section>

        <section className={styles.gallery} aria-labelledby="featured-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Explore the system</p>
              <h2 id="featured-title">Featured examples</h2>
            </div>
            <Link to={`${baseUrl}examples`} className={styles.textLink}>
              See all examples <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className={styles.cardGrid}>
            {FEATURED_EXAMPLES.map(([title, category, description, route, image, topics, difficulty, maturity]) => (
              <ExampleCard
                key={route}
                title={title}
                category={category}
                description={description}
                href={`${baseUrl}examples/${route}`}
                imageUrl={`${baseUrl}images/examples/${image}`}
                backends={['webgpu']}
                difficulty={difficulty}
                maturity={maturity}
                topics={topics}
                mobile="reduced"
              />
            ))}
          </div>
        </section>

        <section className={styles.callout} aria-labelledby="callout-title">
          <div>
            <p className={styles.sectionEyebrow}>Ready to compose?</p>
            <h2 id="callout-title">Start with a vector. End with a view.</h2>
          </div>
          <Link className={styles.primaryAction} to="/docs">
            Read the docs <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
