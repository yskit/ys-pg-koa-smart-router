const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

exports.use = `{ enable: true, package: 'ys-pg-koa-smart-router', , agent: 'agent' }`;
exports.common = `{
  prefix: '/',
  methods: ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowCross: false
}`;

exports.installer = async ({ cwd, log }) => {
  const appDir = path.resolve(cwd, 'app');
  const routerFilePath = path.resolve(appDir, 'router.js');
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }
  if (fs.existsSync(routerFilePath)) {
    throw new Error(`file '${routerFilePath}' is already exists.`);
  }
  const data = `module.exports = (app, router) => {
  router.get('/', app.controller.index);
}`;
  fs.writeFileSync(routerFilePath, data, 'utf8');
  log.success(`写入初始路由文件成功 - '${routerFilePath}'`);
}

exports.uninstaller = async ({ cwd }) => {
  const code = spawnSync('rm', ['app/router.js'], {
    stdio: 'inherit',
    cwd
  });
  if (!code) {
    throw new Error('Run command catch error');
  }
}