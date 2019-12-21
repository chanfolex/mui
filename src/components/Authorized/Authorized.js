import CheckPermissions from './CheckPermissions';

/**
 * authority 路由配置的权限数组
 * children 通过鉴权的组件
 * @param {*} param0
 */
const Authorized = ({ children, authority, noMatch = null }) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  return CheckPermissions(authority, childrenRender, noMatch);
};

export default Authorized;
