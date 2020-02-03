# @umijs/plugin-layout

Umi plugin for build-in ant-design-pro-layout .

为了进一步降低研发成本，我们尝试将布局通过 umi 插件的方式内置，只需通过简单的配置即可拥有 Ant Design Pro 风格的布局，包括导航以及侧边栏。从而做到用户无需关心布局。

## Features
- ✔︎ 支持 pro 的全部配置项。
- ✔︎ 侧边栏数据根据路由中的 menu 配置自动生成。
- ✔︎ 可根据路由中的 layout 配置决定是否渲染默认布局，同时支持只渲染导航或者侧边栏。
- ✔︎ 默认的路由 403/404 处理，error boundary。
- ✔︎ 搭配 [@umijs/plugin-access](https://www.npmjs.com/package/@umijs/plugin-access) 插件一起使用，可以完成对路由权限的控制，且同时拥有默认的权限处理 UI。

## Prerequisites
使用此插件之前，您需要安装并启用
- [@umijs/plugin-initial-state](https://www.npmjs.com/package/@umijs/plugin-initial-state)
- [@umijs/plugin-model](https://www.npmjs.com/package/@umijs/plugin-model)

## Install
```bash
# or yarn
$ npm install @umijs/plugin-layout --save
```

## Usage
1. 配置 .umirc.js | config/config.js

    启用 layout 插件以及依赖的相关插件，注意必须是以下顺序。

    ```js
    export default {
      plugins: [
        ['@umijs/plugin-layout'],
        ['@umijs/plugin-initial-state'],
        ['@umijs/plugin-model'],
      ],
    };
    ```

2. 新建 src/app.js 文件并导出 getInitialState() 

    您可以异步或同步获取一些数据，然后在 getInitialState（）函数中返回任何值，umi 将返回的值保存为初始状态（基本信息）。

    **约定：** layout 插件导航头右上角的默认 UI 会获取初始状态中的用户名（name）以及 头像（avatar）字段，并展示。

    ```js
    // src/app.js

    export async function getInitialState() {
      const { userId, fole } = await getCurrentRole();
      return {
        name, // 默认 layout 导航右上角展示的用户名字段
        avatar,  // 默认 layout 导航右上角展示的用户头像字段
        ...
      };
    }
    ```

## Plugin API
### 1. 编译时配置
**name**
- Type: String
- Default: packageName
产品名，默认值为包名。

**logo**
- Type: URL
- Default: 金融科技小蚂蚁 LOGO
产品 logo。

**locale**
- Type: Boolean
- Default: false
是否开始国际化配置。

开启后：路由里配置的菜单名会被当作菜单名国际化的 key，插件会去 locales 文件中查找 'menu.[key]'
对应的文案。默认值为改 key。 

关闭时：路由菜单中的菜单名直接为设置的 name 。

🌰：
```js
// .umirc.js | config/config.js
export default {
  plugins: [
    ['@umijs/plugin-layout',{
      name: '服务网格'; 
      locale: true;
    }],
    ['@umijs/plugin-initial-state'],
    ['@umijs/plugin-model'],
  ],
};
```

### 2. 运行时配置
**logout**
- Type:  () => void 
- Default:  null 
用于运行时配置默认 Layout 的 UI 中，点击退出登录的处理逻辑。默认不做处理。

**rightRender**
- Type:  (initialState) => React.ReactNode 

  用于运行时自定义配置导航头右侧的展示内容。
- 默认情况下：
  展示用户名 & 头像 & 退出登录 

  ⚠️ 需搭配 @umijs/plugin-initial-state 一起使用。

  一起使用时，会将 initialState  注入函数作为入参，也是默认主题的用户名等信息的数据来源。合适的数据格式为：

  initialState: {name: string , userId: string, avatar?:url}

🌰：
```js
// src/app.js
export const layout = { 
  logout: () => {}, // do something 
  rightRender:(initInfo)=> { return 'hahah'; },// return string || ReactNode; 
};
```

## 路由配置
Layout 插件会基于 [umi 的配置式路由](https://umijs.org/zh/guide/router.html#%E9%85%8D%E7%BD%AE%E5%BC%8F%E8%B7%AF%E7%94%B1)，封装了更多的配置项，支持更多配置式的能力。新增：

- 侧边栏菜单配置。
- 布局路由级别展示/隐藏相关配置。
- 与权限插件结合，配置式实现权限路由的功能。


每一个 routeItem 都新增如下配置项：
- menu
- layout
- access

比如：
```js
//config/route.ts
export const routes =  [
  {
    path: '/welcome',
    component: 'IndexPage',
    menu: {
      name: '欢迎', // 兼容此写法
      icon: 'testicon',
    },
    layout:{
      hideNav: true,
    },
    access: 'canRead',
  }
]
```
更多路由配置参考，可前往：https://github.com/umijs/plugin-layout/tree/master/test/routes

**name**
- Type: string

菜单上显示的名称，没有则不显示。

**icon**
- Type: string 

菜单上显示的 Icon。 

**menu**
- Type: false |IRouteMenuConfig
- Default: false 

SideMenu 相关配置。默认为 false，表示在菜单中隐藏此项包括子项。

menu 的可配置项包括：
1. name
    - Type: string 

    当前菜单名，无默认值，必选，不填则表示不展示。

2. icon
    - Type: string 

    当前菜单的左侧 icon，可选 antd 的 icon name 和 url，可选。

3. hideChildren
    -  Type: boolean

    在菜单中隐藏他的子项，只展示自己。

4. flatMenu
    - Type: boolean

    默认为false 在菜单中只隐藏此项，子项往上提，仍旧展示。

**layout**
- Type: false | IRouteLayoutConfig
- Default: false
Layout 相关配置。 默认为 false， 默认展示选择的 layout 主题。

layout 的可配置项包括：
1. hideMenu
    - Type: boolean
    - Default: false
    
    当前路由隐藏左侧菜单，默认不隐藏。

2. hideNav
    - Type: boolean
    - Default: false

    当前路由隐藏导航头，默认不隐藏。

**access**
- Type: string

可选。

🌈当 layout 插件配合 access 插件使用时生效。

权限插件会将用户在这里配置的 access 字符串与当前用户所有权限做匹配，如果找到相同的项，并当该权限的值为 false，则当用户访问该路由时，默认展示 403 模版页面。


## LICENSE

MIT