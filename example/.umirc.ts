import { join } from 'path';
import { IConfig } from 'umi-types';

export default {
  routes: [
    { path: '/', component: './index', name: '测试', icon: 'home' },
    { path: '/login', component: './login', name: '退出系统'},
  ],
  disableCSSModules: true,
  plugins: [
    [join(__dirname, '..', require('../package').main || 'index.js'), {
      name: 'test'
    }],
    ['@umijs/plugin-initial-state'],
    ['@umijs/plugin-model'],
  ],
} as IConfig;
