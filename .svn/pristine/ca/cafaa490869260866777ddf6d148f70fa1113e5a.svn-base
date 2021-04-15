
<!-- 信息中心页面 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page">

    <div class="pageLine">
      <!-- 任务中心 -->
      <com-task class="task"></com-task>
      <!-- 消息中心 -->
      <com-news class="news"></com-news>
    </div>

    <div class="pageLine" v-if="arrIncludes('GZTJSDH', powerArr)">
      <!-- 单耗岗 -->
      <com-danhao></com-danhao>
    </div>

    <div class="pageLine" v-if="arrIncludes('GZTJSGY', powerArr)">
      <!-- 工艺岗 -->
      <com-gongyi></com-gongyi>
    </div>

    <div class="pageLine" v-if="arrIncludes('GZTJSBX', powerArr)">
      <!-- 版型岗 -->
      <com-banxing></com-banxing>
    </div>

    <div class="pageLine">
      <!-- 日程记录 -->
      <com-day class="richeng"></com-day>
      <!-- 本周待办 -->
      <com-week class="benzhou"></com-week>
    </div>

  </div>
</template>

<script>
import Api from '@/config/api'
import ComTask from './components/module/task' //       任务中心
import ComNews from './components/module/news' //       消息中心
import ComDanhao from './components/module/danhao' //   单耗岗
import ComGongyi from './components/module/gongyi' //   工艺岗
import ComBanxing from './components/module/banxing' // 版型岗
import ComDay from './components/module/day' //         日程记录
import ComWeek from './components/module/week' //       日程记录
export default {
  components: { ComTask, ComNews, ComDanhao, ComGongyi, ComBanxing, ComDay, ComWeek },
  data() {
    return {
      scrollTop: 0,
      powerArr: [] // 权限数组
    }
  },
  created() {
    const that = this
    const name = '权限'
    const obj = {}
    const suc = function (res) {
      const { resourceCode: powerArr } = res
      that.powerArr = powerArr
    }
    Api({ name, obj, suc, method: 'post' })
  },
  methods: {
    /**
     * [页面滚动事件]
     */
    pageScroll(event) {
      const newNum = event.target.scrollTop
      const oldNum = this.scrollTop
      if (Math.abs(newNum - oldNum) < 300) {
        this.scrollTop = event.target.scrollTop
        this.$refs.page.scrollTop = newNum
      } else {
        this.$refs.page.scrollTop = oldNum
      }
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    arrIncludes(str, arr) {
      let status = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
          status = true
        }
      }
      return status
    }
  }
}
</script>

<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
  background: #ededf1;
  overflow-y: auto;
}
.pageLine {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  flex-wrap: nowrap;
}

/*** 任务中心 ***/
.task {
  margin-right: 13px;
  flex: 1;
}

/*** 消息中心 ***/
.news {
  max-width: 590px;
  flex: 1;
}

/*** 日程记录 ***/
.richeng {
  max-width: calc((100% - 13px) * 0.5);
  margin-right: 13px;
  flex: 1;
}

/*** 本周待办 ***/
.benzhou {
  max-width: calc((100% - 13px) * 0.5);
  flex: 1;
}
</style>

<style>
/*** 模块刷新 ***/
.f5 {
  color: #909399;
  cursor: pointer;
  padding: 0 6px;
}

/*** 表格字体 ***/
.el-table {
  font-size: 12px !important;
}
/*** 重置表头单元格 ***/
.el-table > div th, .el-table > div th > .cell {
  padding: 0 !important;
}
.el-table > div th > .cell .thText {
  padding: 5px 10px;
}
/*** 表头输入内容 ***/
.thActive {
  color: #ffffff;
  background: #409EFF;
}
/*** 单元格 ***/
td {
  padding: 0 !important;
}
.cell p {
  line-height: 16px !important;
  margin: 4px 0 !important;
}
th > .cell, th > .cell .thText {
  text-align: center;
}

/*** 搜索 ***/
.el-popover {
  padding: 6px;
}
.el-popover > div > input {
  height: 26px;
  font-size: 12px !important;
  display: flex;
  align-items: center;
}
.el-popover > div > .el-input__suffix { /* input 中删除按钮 */
  margin-top: -6px;
}

/*** 分页 ***/
.comPagination {
  padding: 0 !important;
}
.comPagination > .el-pagination__total {
  margin-right: 0 !important;
}
.comPagination > .btn-prev { /* 上一页 */
  padding-right: 0 !important;
}
.comPagination > .el-pager > li { /* 页数 */
  min-width: 30px !important;
  padding: 0 !important;
}
.comPagination > .btn-next { /* 下一页 */
  padding-left: 0 !important;
}
.comPagination > .el-pagination__sizes, .comPagination > .el-pagination__jump { /* 前往5页，5条/页 */
  margin: 0 0 0 10px !important;
}
.comPagination > .el-pagination__sizes > .el-select > .el-input--suffix { /* 总条数 */
  margin-right: 0 !important;
}
</style>
