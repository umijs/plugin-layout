import React from 'react';
import { Link, useModel } from 'umi';
import pathToRegexp from 'path-to-regexp';
import history from '@@/history';
import { formatMessage } from 'umi-plugin-locale';
import ProLayout from '@ant-design/pro-layout';
import './style.less';
import ErrorBoundary from '../component/ErrorBoundary';
import useRightContent from './useRightContent';
import { WithExceptionOpChildren } from '../component/Exception';
import getLayoutConfigFromRoute from '../utils/getLayoutConfigFromRoute';
import getMenuDataFromRoutes from '../utils/getMenuFromRoute';
import { MenuItem } from '../types/interface.d';
import logo from '../assets/logo.svg';

const BasicLayout = (props: any) => {
  const { children, userConfig, location } = props;
  const { initialState, loading } = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
  }; // plugin-initial-state 未开启
  const _routes = require('@@/router').routes;
  const rightContentRender = useRightContent(userConfig, loading, initialState);
  const layoutConfig = getLayoutConfigFromRoute(_routes);
  const patchMenus: (ms: MenuItem[]) => MenuItem[] =
    userConfig.patchMenus || ((ms: MenuItem[]): MenuItem[] => ms);
  const menus = patchMenus(getMenuDataFromRoutes(_routes[0].routes));

  // layout 是否渲染相关
  const pathName = location.pathname;
  const layoutRender: any = {};

  // 动态路由匹配
  const currentMatchPaths = Object.keys(layoutConfig).filter(item =>
    pathToRegexp(`${item}(.*)`).test(pathName),
  );

  const currentPathConfig = currentMatchPaths.length
    ? layoutConfig[currentMatchPaths[currentMatchPaths.length - 1]]
    : undefined;

  if (currentPathConfig && currentPathConfig.hideMenu) {
    layoutRender.menuRender = false;
  }

  if (currentPathConfig && currentPathConfig.hideNav) {
    layoutRender.headerRender = false;
  }

  return (
    <ProLayout
      title={userConfig.name || userConfig.title}
      className="umi-plugin-layout-main"
      navTheme="dark"
      siderWidth={256}
      onMenuHeaderClick={e => {
        e.stopPropagation();
        e.preventDefault();
        history.push('/');
      }}
      menu={{ locale: userConfig.locale }}
      menuDataRender={() => menus}
      formatMessage={formatMessage}
      logo={initialState?.logo || logo}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path || ''}>{defaultDom}</Link>;
      }}
      disableContentMargin
      rightContentRender={rightContentRender}
      fixSiderbar
      fixedHeader
      {...userConfig}
      {...props}
      {...layoutRender}
    >
      <ErrorBoundary>
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          {userConfig.childrenRender
            ? userConfig.childrenRender(children)
            : children}
        </WithExceptionOpChildren>
      </ErrorBoundary>
    </ProLayout>
  );
};

export default BasicLayout;
