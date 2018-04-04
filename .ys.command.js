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
      document: {
        title: 'Swagger Demo',
        version: '1.0.0',
        description: '演示如何使用Swagger-UI来展示API文档。**所有的description都支持markdown语法。**',
        host: '127.0.0.1:8444',
        basePath: '/',
        tags: {
          category: '分类相关',
          article: '文章相关'
        },
        // schemes: ['http', 'https', 'ws', 'wss'],
        // optional external docs, for example: wiki
        externalDocs: {
          description: '关于Router', // 支持markdown
          url: 'http://cnpm.51.nb/package/@u51/router'
        }
      }
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