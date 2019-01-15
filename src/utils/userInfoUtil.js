import Cookies from 'js-cookie'
const SchoolIdKey = 'user-school-id'
const TokenKey = 'token'
/**
 * 获取用户校区ID
 */
export function getUserSchoolId () {
  return Number(Cookies.get(SchoolIdKey))
}
/**
 * 保存用户校区ID
 */
export function saveUserSchoolId (schoolId) {
  Cookies.set(SchoolIdKey, schoolId)
}
/**
 * 获取token
 */
export function getToken () {
  return Number(Cookies.get(TokenKey))
}
/**
 * 保存token
 */
export function setToken (token) {
  Cookies.set(TokenKey, token)
}
