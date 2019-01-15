import request from '@/utils/httpRequest'

export function courseList( page, limit, courseName ) {
    return request({
      url: '/cou/course/list',
      method: 'get',
      params: { page, limit, courseName }
    })
}

export function courseInfo( data ) {
  return request({
    url: '/cou/course/info/' + data,
    method: 'get',
  })
}

export function courseSave(data) {
  return request({
    url: '/cou/course/save',
    method: 'post',
    data
  })
}

export function courseUpdate(data) {
  return request({
    url: '/cou/course/update',
    method: 'post',
    data
  })
}

export function courseDelete(data) {
    return request({
      url: '/cou/course/delete',
      method: 'post',
      data
    })
}