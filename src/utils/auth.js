import Cookies from 'js-cookie'

const key = 'wuage_token'

export function getToken() {
  return Cookies.get(key)
}

export function setToken(data) {
  return Cookies.set(key, data)
}

export function removeToken() {
  return Cookies.remove(key)
}
