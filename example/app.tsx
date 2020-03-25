import React from 'react';

export async function getInitialState() {
  return {
    name: 'umijs',
  };
}

export const layout = {
  logout: () => {
    alert('退出登陆成功');
  },
  patchMenus: (menus: any) => {
    return [
      ...menus,
      {
        name: '自定义',
        path: 'https://bigfish.alipay.com/',
      },
    ];
  },
  childrenRender: children => {
    return (
      <>
        {children}
        <div id="xxx">hahha</div>
      </>
    );
  },
};
