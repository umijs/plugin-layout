export async function getInitialState() {
  return {
    name: 'umijs',
  };
}

export const layout = {
  logout: () => {
    alert('退出登陆成功');
  },
};