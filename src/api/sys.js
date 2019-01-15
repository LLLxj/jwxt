import request from '@/utils/httpRequest'

export function jxTeacherList(page, limit, username) {
    return request({
      url: '/sys/user/queryJiaoXuePage',
      method: 'get',
      params: { page, limit, username }
    })
}

export function xsTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/queryXiaoShouPage',
    method: 'get',
    params: { page, limit, username }
  })
}

export function jwTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/queryJiaoWuPage',
    method: 'get',
    params: { page, limit, username }
  })
}

export function tgTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/getSpreadTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

export function zsTeacherList( page, limit, username ) {
  return request({
    url: '/sys/user/getRecruitTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

export function userList( page, limit, username, schoolId) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: { page, limit, username, schoolId }
  })
}

export function login ( data ) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function resourceList() {
  return request({
    url: '/cust/channe/selectList',
    method: 'get',
  })
}

// 获得所有职位列表
export function getAllTeacherList(page, limit, username) {
  return request({
    url: '/sys/user/getUpdateClassRecruitTeacher',
    method: 'get',
    params: { page, limit, username }
  })
}

// 获取审核人
export function getAllCheckList(page, limit, username) {
  return request({
    url: '/sys/user/getStautsUser',
    method: 'get',
    params: { page, limit, username }
  })
}

