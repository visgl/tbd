import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="GPU compute" description="GPU command graphs and data compute for the web">
      <main className="container" style={{padding: '5rem 1rem', maxWidth: 960}}>
        <p>vis.gl · tbd</p>
        <h1>GPU compute, from batches to live views.</h1>
        <p>Build command graphs over chunked data. Compose analytics, spatial queries, raster processing, graph algorithms, and streaming updates.</p>
        <p><Link className="button button--primary margin-right--md" to="/docs">Documentation</Link><Link className="button button--secondary" to="/examples">Explore examples</Link></p>
        <h2>One compute foundation</h2>
        <p>Shared vectors and tables, explicit resource ownership, reusable kernels, and incremental execution. The repository name and package boundaries are provisional.</p>
      </main>
    </Layout>
  );
}
