const Router = require('smart-koa-router');
const fs = require('fs');
const path = require('path');
const util = require('ys-utils');

module.exports = (app, configs) => {
  app.on('serverWillStart', () => {
    const routerPath = path.resolve(app.options.baseDir, 'app/router.js');
    if (!fs.existsSync(routerPath)) {
      throw new Error(`router of '${routerPath}' must be exists`);
    }
    const exports = util.file.load(routerPath);
    app.router = new Router(configs);
    exports(app, app.router);
    app.koa.use(app.router.routes());
  });
}