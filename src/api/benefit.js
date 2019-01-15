import request from '@/utils/httpRequest'

// 展开查询
export function getBenefitList(page, limit, offNo, stuName, stuPhone, schoolId, classTypeId, status, ddingCode, statusUserId, creatorId, startDateTime, endDateTime) {
  return request({
    url: '/stu/reg/off/list',
    method: 'get',
    params: { page, limit, offNo, stuName, stuPhone, schoolId, classTypeId, status, ddingCode, statusUserId, creatorId, startDateTime, endDateTime }
  })
}

// 生成优惠单
export function putBenefitNo() {
  return request({
    url: '/stu/reg/off/getOffNo',
    method: 'get',
  })
}

// 折叠查询
export function benefitList(data) {
  return request({
    url: '/stu/reg/off/getOff',
    method: 'post',
    data
  })
}

// 获取缴费单信息
export function getBenefitInfo(data) {
  return request({
    url: '/stu/reg/off/info/' + data,
    method: 'get',
  })
}

// 新增优惠单
export function benefitSave(data) {
  return request({
    url: '/stu/reg/off/save',
    method: 'post',
    data
  })
}

// 同意优惠
export function acceptBenefit(data) {
  return request({
    url: '/stu/reg/off/adopt/' + data,
    method: 'get'
  })
}

// 拒绝优惠
export function refuseBenefit(data) {
  return request({
    url: '/stu/reg/off/notPass/' + data,
    method: 'get'
  })
}

// 修改为待审核
export function uncheckBenefit(data) {
  return request({
    url: '/stu/reg/off/checkPending/' + data,
    method: 'get'
  })
}

