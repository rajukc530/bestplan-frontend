import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      {src: 'aos/dist/aos.js', inject: 'libs'},
      {src: 'file-saver/dist/FileSaver.min.js', inject: 'libs'},
      {src: 'chart.js/dist/Chart.min.js', inject: 'libs'},
      // {src: 'chart.js/src/chart.js', inject: 'libs'}
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
      {src: 'node_modules/ngx-toastr/toastr.css', inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
    const additionalPackages: ExtendPackages[] = [{
      name: 'ng5-slider',
      // Path to the package's bundle
      path: 'node_modules/ng5-slider/bundles/ng5-slider.umd.js'
    },
    {
      name: 'ngx-mydatepicker',
      // Path to the package's bundle
      path: 'node_modules/ngx-mydatepicker/bundles/ngx-mydatepicker.umd.js'
    },
    {
      name: 'ngx-toastr',
      // Path to the package's bundle
      path: 'node_modules/ngx-toastr/bundles/ngx-toastr.umd.js'
    },
    {
      name: 'ngx-loading',
      // Path to the package's bundle
      path: 'node_modules/ngx-loading/bundles/ngx-loading.umd.js'
    },
    {
      name: 'ngx-page-scroll',
      // Path to the package's bundle
      path: 'node_modules/ngx-page-scroll/bundles/ngx-page-scroll.umd.js'
    },
    {
      name: 'ng2-charts',
      // Path to the package's bundle
      path: 'node_modules/ng2-charts/bundles/ng2-charts.umd.js'
    },
  ];
    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
