import React, {type ReactNode} from 'react';
import {DocsPageTabs} from './docs-page-tabs';

type TutorialDocsTab = {
  id: TutorialDocsTabId;
  label: string;
  href: string;
};

/** Tutorial documentation tab identifiers. */
export type TutorialDocsTabId =
  | 'setup'
  | 'hello-triangle'
  | 'hello-cube'
  | 'hello-instancing'
  | 'shader-modules'
  | 'shader-hooks'
  | 'shader-plugins'
  | 'lighting'
  | 'transform'
  | 'transform-feedback';

/** Tutorial documentation tab group identifiers. */
export type TutorialDocsTabGroupId = 'fundamentals' | 'shaders' | 'transforms';

const TUTORIAL_DOCS_TABS: Record<TutorialDocsTabGroupId, TutorialDocsTab[]> = {
  fundamentals: [
    {id: 'setup', label: 'Overview', href: 'https://luma.gl/docs/tutorials'},
    {id: 'hello-triangle', label: 'Triangle', href: 'https://luma.gl/docs/tutorials/hello-triangle'},
    {id: 'hello-cube', label: 'Cube', href: 'https://luma.gl/docs/tutorials/hello-cube'},
    {id: 'hello-instancing', label: 'Instancing', href: 'https://luma.gl/docs/tutorials/hello-instancing'}
  ],
  shaders: [
    {id: 'shader-modules', label: 'Modules', href: 'https://luma.gl/docs/tutorials/shader-modules'},
    {id: 'shader-hooks', label: 'Hooks', href: 'https://luma.gl/docs/tutorials/shader-hooks'},
    {id: 'shader-plugins', label: 'Plugins', href: 'https://luma.gl/docs/tutorials/shader-plugins'},
    {id: 'lighting', label: 'Lighting', href: 'https://luma.gl/docs/tutorials/lighting'}
  ],
  transforms: [
    {id: 'transform', label: 'Transform', href: 'https://luma.gl/docs/tutorials/transform'},
    {
      id: 'transform-feedback',
      label: 'Transform Feedback',
      href: 'https://luma.gl/docs/tutorials/transform-feedback'
    }
  ]
};

/** Renders page links with the same visual treatment as tabs for related tutorials. */
export function TutorialDocsTabs({
  group,
  active
}: {
  group: TutorialDocsTabGroupId;
  active: TutorialDocsTabId;
}): ReactNode {
  return (
    <DocsPageTabs
      active={active}
      group={{label: 'Tutorial sections', tabs: TUTORIAL_DOCS_TABS[group]}}
    />
  );
}
