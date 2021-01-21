// 接口

import Axios from '@/config/axios'

/**
 * [服务器地址]
 */
// const host = '/api_d/'
// const host = '/api_83/'
const host = window.location.origin + '/nova/'

/**
 * [接口地址]
 */
const url = {
  '工作台任务列表': 'taskBusinessDetailAction.ndo?action=detailList',
  '修改状态': 'taskBusinessDetailAction.ndo?action=updateLevel',
  '权限': 'unitConsumptionAccountShowAction.ndo?action=getWorkbenchResources',
  '待办已办业务列表': 'itemInfoAction.ndo?action=needToBeDealtWithNode',
  '消息中心': 'msgInfoShowAction.ndo?action=getMsgList',
  '技术单耗岗': 'unitConsumptionAccountShowAction.ndo?action=getUnitConsumPtion',
  '核算前验证': 'unitConsumptionAccountShowAction.ndo?action=materialIsAudit',
  '核算单耗': 'unitConsumptionAccountShowAction.ndo?action=showAdd',
  '技术工艺岗': 'styleCraftShowAction.ndo?action=getStyleCraftList',
  '查看工艺单': 'styleCraftShowAction.do?action=showAdd',
  '技术版型岗': 'sampleConfirmRecordShowAction.ndo?action=getSampleConfirmRecordList',
  '日程列表': 'SchedulerAction.ndo?action=querySchedule'
}

/**
 * [请求接口时，如果需要 loading 效果时，显示的文字]
 */
// const Loading = {
//   '下单接口': '下单中...'
// }

const request = function (param) {
  param.path = host + url[param.name]
  Axios(param)
}

export default request
