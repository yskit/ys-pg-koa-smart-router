const fs = require('fs-extra');
const path = require('path');
const jsbeautifier = require('js-beautify');

module.exports = class CommanderModule {
  constructor(thread, installer) {
    this.installer = installer;
    this.thread = thread;
  }

  beautiful(str) {
    return jsbeautifier.js_beautify(str, {
      indent_size: 2
    })
  }

  ['env:common']() {
    return {
      prefix: '/',
      methods: ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowCross: false
    }
  }

  ['options:plugin']() {
    return {
      enable: true,
      package: 'ys-pg-koa-smart-router'
    }
  }

  async ['life:created']({
    cwd
  }) {
    const appDir = path.resolve(cwd, 'app');
    const routerFilePath = path.resolve(appDir, 'router.js');
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir);
      this.thread.on('beforeRollback', async () => {
        this.installer.spinner.debug('-', path.relative(process.cwd(), appDir));
        fs.removeSync(routerDir);
        await this.installer.delay(50);
      });
    }
    if (fs.existsSync(routerFilePath)) {
      throw new Error(`file '${routerFilePath}' is already exists.`);
    }
    const data = `module.exports = (app, router) => {
      router.get('/', app.controller.index);
    }`;
    fs.writeFileSync(routerFilePath, this.beautiful(data), 'utf8');
    this.thread.on('beforeRollback', async () => {
      this.installer.spinner.debug('-', path.relative(process.cwd(), routerFilePath));
      fs.unlinkSync(indexFilePath);
      await this.installer.delay(50);
    });
    this.installer.spinner.success('+', path.relative(process.cwd(), routerFilePath));
  }

  async ['life:destroyed']({
    cwd
  }) {
    this.installer.spinner.warn('正在删除项目中的路由文件 ...');
    await this.installer.execScript(cwd, 'rm', 'app/router.js');
    this.installer.spinner.warn('项目中的路由文件删除成功！');
    await this.installer.delay(50);
  }
}