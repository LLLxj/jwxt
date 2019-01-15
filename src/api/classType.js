import request from '@/utils/httpRequest'

export function classTypeList( page, limit, classTypeName ) {
    return request({
      url: '/cou/classType/list',
      method: 'get',
      params: { page, limit, classTypeName }
    })
}

export function classTypeInfo(data) {
  return request({
    url: '/cou/classType/info/' + data,
    method: 'get',
    
  })
}

export function classTypeSave(data) {
  return request({
    url: '/cou/classType/save',
    method: 'post',
    data
  })
}

export function classTypeUpdate(data) {
  return request({
    url: '/cou/classType/update',
    method: 'post',
    data
  })
}

export function classTypeDelete(data) {
    return request({
      url: '/cou/classType/delete',
      method: 'post',
      data
    })
}