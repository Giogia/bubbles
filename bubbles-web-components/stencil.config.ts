import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'bubbles',
  globalStyle: 'src/index.css',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: 'bubbles',
      proxiesFile: '../bubbles-react/src/components/index.ts',
      includeImportCustomElements: true
    }),
    vueOutputTarget({
      componentCorePackage: 'bubbles',
      proxiesFile: '../bubbles-vue/src/components.ts',
      includeImportCustomElements: true
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
