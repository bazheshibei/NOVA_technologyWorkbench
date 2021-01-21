
// 发送请求
import Axios from 'axios'
import Qs from 'qs'
import { Loading } from 'element-ui'
// import { MessageBox, Loading } from 'element-ui'

/**
 * [全局配置]
 * @cate {[headers]}      HTTP自定义请求头
 * @cate {[interceptors]} 请求拦截器
 */
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.interceptors.request.use(function (config) {
  return config
})

/**
 * [发起请求]
 */
const HTTP = function (param) {
  let loadingInstance
  /* 接收参数 */
  const {
    path = '', //               接口地址
    path2 = '', //              可变参数
    obj = {}, //                参数
    suc = function (res) {}, // 成功后，回调函数
    err = function (res) {}, // 失败后，回调函数
    method = 'get', //         请求方式
    loading = '' //             loading 效果时，显示的文字
  } = param
  /* 参数 */
  const data = obj
  /* 接口地址 */
  let url = path + path2
  /* GET 方式拼接参数 */
  if (method === 'get') {
    const text = []
    for (const x in data) {
      text.push(`${x}=${data[x]}`)
    }
    url += text.length ? (url.indexOf('?') > -1 ? '&' + text.join('&') : '?' + text.join('&')) : ''
  }
  /* loading 效果 */
  if (loading) {
    loadingInstance = Loading.service({ text: loading })
  }
  /* 发起请求 */
  Axios({ method, url, data: Qs.stringify(data) })
    .then(function (res) {
      suc(res.data.data)
      // if (res.data.code === '200') {
      //   suc(res.data.data)
      // } else {
      //   /* 弹出：错误信息 */
      //   if (res.data.message) {
      //     MessageBox.confirm(res.data.message, '', {
      //       confirmButtonText: '确定',
      //       showCancelButton: false,
      //       type: 'warning'
      //     }).then(() => {}).catch(() => {})
      //     console.log('请求成功，但code不是200：', res)
      //   }
      // }
      // /* 以服务的方式调用的 Loading 需要异步关闭 */
      // if (loading) {
      //   loadingInstance.close()
      // }
    })
    .catch(function (res) {
      /* 弹出：请求失败提示 */
      // MessageBox.confirm('系统升级中...', '请求失败', {
      // MessageBox.confirm(res, '请求失败', {
      //   confirmButtonText: '确定',
      //   showCancelButton: false,
      //   type: 'error'
      // }).then(() => {}).catch(() => {})
      // console.log('请求失败：', res)
      err(res)
      /* 以服务的方式调用的 Loading 需要异步关闭 */
      if (loading) {
        loadingInstance.close()
      }
    })
}

export default HTTP
