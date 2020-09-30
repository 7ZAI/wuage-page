const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  menu:state => state.user.menu,
  user: state => state.user.user,
  name: state => state.user.name
}
export default getters
