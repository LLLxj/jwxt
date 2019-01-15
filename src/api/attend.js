import request from '@/utils/httpRequest'

export function attendByMobile (page, limit, stuMobile, startDateTime, endDateTime) {
  return request({
    url: '/cou/attend/queryByStuMobilePage',
    method: 'get',
    params: { page, limit, stuMobile, startDateTime, endDateTime }
  })
}

export function attendByClassId (page, limit, classId, startDateTime, endDateTime) {
  return request({
    url: '/cou/attend/queryByClassIdPage',
    method: 'get',
    params: { page, limit, classId, startDateTime, endDateTime }
  })
}

export function attendByCplanId (page, limit, cplanId, startDateTime, endDateTime) {
  return request({
    url: '/cou/attend/queryByCplanIdPage',
    method: 'get',
    params: { page, limit, cplanId, startDateTime, endDateTime }
  })
}

export function attendDown () {
  window.open('/cou/attend/down', '_blank')
}

export function attendclassList (page, limit, classId, classTeacherId, logType, paramStarDateTime, paramEndDateTime, order, orderColumns) {
  return request({
    url: '/cou/attend/class/list',
    method: 'get',
    params: { page, limit, classId, classTeacherId, logType, paramStarDateTime, paramEndDateTime, order, orderColumns }
  })
}

export function attendTeacherList (page, limit, teacherId, logType, paramStarDateTime, paramEndDateTime, order ,orderColumns) {
  return request({
    url: '/cou/attend/teacher/list',
    method: 'get',
    params: { page, limit, teacherId, logType, paramStarDateTime, paramEndDateTime, order, orderColumns }
  })
}

export function attendSchoolList (page, limit, schoolId, logType, paramStarDateTime, paramEndDateTime, order, orderColumns) {
  return request({
    url: '/cou/attend/school/list',
    method: 'get',
    params: { page, limit, schoolId, logType, paramStarDateTime, paramEndDateTime, order, orderColumns }
  })
}

export function attendCplanList (page, limit, cplanId, classTeacherId, paramStarDateTime, paramEndDateTime, order, orderColumns) {
  return request({
    url: '/cou/attend/cplan/list',
    method: 'get',
    params: { page, limit, cplanId, classTeacherId, paramStarDateTime, paramEndDateTime, order, orderColumns }
  })
}
