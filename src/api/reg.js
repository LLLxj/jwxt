import request from '@/utils/httpRequest'

export function regList (page, limit, regNo, stuPhone, cardId, regStatus, educType, startDateTime, endDateTime, schoolId,
   readStatus, channeId, recruitUserId, spreadUserId, payStatus ) {
  return request({
    url: '/stu/reg/list',
    method: 'get',
    params: {page, limit, regNo, stuPhone, cardId, regStatus, educType, startDateTime,
       endDateTime, schoolId, readStatus, channeId, recruitUserId, spreadUserId, payStatus }
  })
}

// 报名表查询 --post
export function getRegList (data) {
  return request({
    url: '/stu/reg/getStuReg',
    method: 'post',
    data
  })
}

export function handleRecordList (page, limit, regId) {
  return request({
    url: '/stu/reg/read/list',
    method: 'get',
    params: {page, limit, regId}
  })
}

export function regCheckCardId (cardId) {
  return request({
    url: '/stu/user/checkCardId',
    method: 'get',
    params: { cardId }
  })
}

export function regCheckPhone (stuPhone) {
  return request({
    url: '/stu/user/checkStuPhone',
    method: 'get',
    params: { stuPhone }
  })
}

export function regChangeClassInfo (data) {
  return request({
    url: '/stu/reg/class/info/' + data,
    method: 'get'
  })
}

export function regChangeClass (data) {
  return request({
    url: '/stu/reg/class/changeClass',
    method: 'post',
    data
  })
}

export function regInfo (data) {
  return request({
    url: '/stu/reg/info/' + data,
    method: 'get'
  })
}

export function regSave (data) {
  return request({
    url: '/stu/reg/save',
    method: 'post',
    data
  })
}

export function regUpdate (data) {
  return request({
    url: '/stu/reg/update',
    method: 'post',
    data
  })
}

export function regAdopt (data) {
  return request({
    url: '/stu/reg/adopt/' + data,
    method: 'post'
  })
}

export function regForbidden (data) {
  return request({
    url: '/stu/reg/forbidden/' + data,
    method: 'post'
  })
}

export function regCheckPending (data) {
  return request({
    url: '/stu/reg/checkPending/' + data,
    method: 'post'
  })
}

export function regCourseList (data) {
  return request({
    url: '/stu/reg/course/list/' + data,
    method: 'get'
  })
}

export function regCourseSave (data) {
  return request({
    url: '/stu/reg/course/save',
    method: 'post',
    data
  })
}

export function regCourseDelete (data) {
  return request({
    url: '/stu/reg/course/delete',
    method: 'post',
    data
  })
}

export function regDown () {
  window.open('/stu/reg/downTemplet', '_blank')
}


export function regHandleFinish (data) {
  return request({
    url: '/stu/reg/finish',
    method: 'post',
    data
  })
}

export function regSingleFinish (data) {
  return request({
    url: '/stu/reg/updateFinish/' + data,
    method: 'get',
  })
}

export function regSingleInClass (data) {
  return request({
    url: '/stu/reg/updateStuding/' + data,
    method: 'get',
  })
}

export function regAssignClassRecord (data) {
  return request({
    url: '/stu/reg/updateStuding/' + data,
    method: 'get',
  })
}


export function regGetCourseList (page, limit, regId) {
  return request({
    url: '/stu/reg/course/getStuRegCourse',
    method: 'get',
    params: { page, limit, regId }
  })
}

export function regGetInClass (page, limit, stuRegCourseId, cplanName) {
  return request({
    url: '/cou/cplan/selectPageByStuRegCourseId',
    method: 'get',
    params: { page, limit, stuRegCourseId, cplanName }
  })
}

export function regAssignClass(data) {
  return request({
    url: '/stu/reg/course/assignment',
    method: 'post',
    data
  })
}

export function regGetAssignClassRecord(page, limit, regId) {
  return request({
    url: '/stu/reg/history/list',
    method: 'get',
    params: { page, limit, regId }
  })
}

export function regQuitClass(data) {
  return request({
    url: '/stu/reg/course/retreat',
    method: 'post',
    data
  })
}

// 升班获得学员信息
export function regGetUserInfo(data) {
  return request({
    url: '/stu/reg/getStuUser/' + data,
    method: 'get'
  })
}

// 升班保存
export function updateClassTypeSave(data) {
  return request({
    url: '/stu/reg/updateClassType/save',
    method: 'post',
    data
  })
}



