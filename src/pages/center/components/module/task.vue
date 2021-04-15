
<!-- 任务中心 -->
<template>
  <com-white-box :title="'任务中心'" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <template slot="title">
      <span style="cursor: pointer; font-size: 12px;" @click="A_showAdd_0">
        点击查看更多
        <i class="el-icon-right"></i>
      </span>
    </template>

    <!-- 顶部 tab -->
    <com-top-tab :active="active" :list="tabs" @changeTab="changeTab">
      <template slot="otherBtn">
        <el-dropdown size="mini" split-button type="primary" @command="setColor" trigger="click">
          标签设置为
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="5" :disabled="!ids.length" :style="{ background: backgroundColor[5] }">
              暂缓
            </el-dropdown-item>
            <el-dropdown-item command="1" :disabled="!ids.length" :style="{ background: backgroundColor[1] }">
              不紧急不重要
            </el-dropdown-item>
            <el-dropdown-item command="2" :disabled="!ids.length" :style="{ background: backgroundColor[2] }">
              重要不紧急
            </el-dropdown-item>
            <el-dropdown-item command="4" :disabled="!ids.length" :style="{ background: backgroundColor[4] }">
              紧急不重要
            </el-dropdown-item>
            <el-dropdown-item command="3" :disabled="!ids.length" :style="{ background: backgroundColor[3] }">
              重要紧急
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </com-top-tab>
    <!-- /顶部 tab -->

    <el-table class="newsTable" :data="listObj[active]" border :cell-style="cellStyle" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="25"></el-table-column>
      <!-- 一 -->
      <!-- <el-table-column label="任务类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.task_type}}</span>
        </template>
      </el-table-column> -->
      <!-- 二 -->
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_2" v-model="search[active].task_content" clearable placeholder="多个查询空格分隔" @clear="clear('task_content')" @change="select"></el-input>
            <div class="thText" :class="search[active].task_content ? 'thActive' : ''" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_2')">
              任务内容<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <span class="hover" @click="goComplete(scope.row)">{{scope.row.task_content}}</span>
        </template>
      </el-table-column>
      <!-- 三 -->
      <el-table-column label="要求完成日期" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.expect_finish_date}}</span>
        </template>
      </el-table-column>
      <!-- 四 -->
      <el-table-column label="预计完成日期" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.plan_finish_date}}</span>
        </template>
      </el-table-column>
      <!-- 五 -->
      <el-table-column label="发送人" width="60" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.task_initiator_name}}</p>
        </template>
      </el-table-column>
      <!-- 六 -->
      <el-table-column label="状态" width="70" align="center">
        <template slot-scope="scope">
          <span :style="{ color: curr_status_obj[scope.row.curr_status].color }">
            {{curr_status_obj[scope.row.curr_status].name}}
          </span>
        </template>
      </el-table-column>
      <!-- 七 -->
      <el-table-column label="操作" width="50" align="center">
        <template slot-scope="scope">
          <el-popconfirm v-if="active === '公共任务' && String(scope.row.flag) === '0'" title="确定要参与吗？" @confirm="join(scope.row)">
            <span slot="reference" class="hover click">参与</span>
          </el-popconfirm>
          <span v-else-if="String(scope.row.curr_status) === '3' || String(scope.row.curr_status) === '4'" class="hover click"></span>
          <span v-else-if="String(scope.row.curr_status) === '1' || String(scope.row.curr_status) === '2'" class="hover click" @click="goTo(scope.row)">跟进</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationBox">
      <el-pagination class="comPagination" :page-size="pageObj[active].size" :page-sizes="[5, 10, 20, 30]" :total="pageObj[active].count" :current-page="pageObj[active].page"
        layout="prev, pager, next, total, jumper, sizes" prev-text="上一页" next-text="下一页" :pager-count="5"
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- /分页 -->

  </com-white-box>
</template>

<script>
import Api from '@/config/api'
import ComWhiteBox from '../whiteBox' //       白色容器
import ComTopTab from '../topTab' //           顶部 tab
// import LocalData from '@/localData/data.js' // 本地数据
export default {
  components: { ComWhiteBox, ComTopTab },
  data() {
    return {
      loading: false,
      ids: '', //                                           选中的任务ID
      ids_index: [], //                                     选中的任务索引
      tabs: { '预警': 0, '今日待办': 0, '公共任务': 0, '全部': 0 },
      pageObj: { //                                         三个页签：对应的分页数据
        /* 总条数 每页数量 当前页数 */
        '预警': { count: 0, size: 5, page: 1 },
        '今日待办': { count: 0, size: 5, page: 1 },
        '公共任务': { count: 0, size: 5, page: 1 },
        '全部': { count: 0, size: 5, page: 1 }
      },
      curr_status_obj: { // 当前状态对应值
        '0': { name: '未发布', color: '#F56C6C' },
        '1': { name: '正常进行', color: '#67C23A' },
        '2': { name: '延期进行', color: '#67C23A' },
        '3': { name: '按期完成', color: '#909399' },
        '4': { name: '延期完成', color: '#909399' },
        '5': { name: '已取消', color: '#909399' }
      },
      backgroundColor: { '1': '#409EFF', '2': '#67C23A', '3': '#F56C6C', '4': '#E6A23C', '5': '#909399' },
      listObj: { '预警': [], '今日待办': [], '公共任务': [], '全部': [] }, //    三个页签：对应的数据列表
      search: { //                                           三个页签：对应的搜索对象
        '预警': { task_content: '' },
        '今日待办': { task_content: '' },
        '公共任务': { task_content: '' },
        '全部': { task_content: '' }
      },
      active: '预警', //                                                     当前激活的页签
      tabType: { '预警': '1', '今日待办': '2', '公共任务': '4', '全部': '' } // 请求时，页签对应的值
    }
  },
  created() {
    const { tabs } = this
    /* 循环请求：所有页签内容 */
    for (const x in tabs) {
      this.A_detailList(x)
    }
  },
  methods: {
    /**
     * [请求：查看更多]
     */
    A_showAdd_0() {
      const host = window.location.origin + '/nova/'
      // eslint-disable-next-line
      ui("open", {
        title: '查看更多',
        url: host + 'pages/taskbusinesssummary/taskBusinessDetaillist_todo.jsp',
        onClose: function () {}
      })
    },
    /**
     * [业务完成]
     */
    goComplete(row) {
      const { curr_status } = row
      if (Number(curr_status) < 3 || Number(curr_status) > 4) {
        const that = this
        const { url, task_detail_id } = row
        const host = window.location.origin + '/nova'
        const params = url.indexOf('?') !== -1 ? `&task_detail_id=${task_detail_id}` : `?task_detail_id=${task_detail_id}`
        /* 发起请求 */
        // eslint-disable-next-line
        updateWin({
          url: host + url + params,
          param: {},
          width: 1600,
          height: 7000,
          title: '业务完成',
          fn: function () {
            that.f5(false)
          },
          onClose: function () {
            that.f5(false)
          }
        })
      }
    },
    /**
     * [点击参与]
     */
    join(row) {
      const that = this
      const { task_detail_id } = row
      /* 发起请求 */
      const name = '参与'
      const obj = { task_detail_id }
      const suc = function (res) {
        that.f5(false)
      }
      Api({ name, obj, suc })
    },
    /**
     * [点击跟进]
     */
    goTo(row) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { task_detail_id, task_summary_id } = row
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        url: host + 'taskBusinessProgressShowAction.ndo?action=showAdd',
        param: { taskid: task_detail_id, empid: '', task_summary_id }, // empid: '965BAD8F4EF5C14CE4F607E77D30B9B5'
        width: 1600,
        height: 7000,
        title: '录入任务进展',
        fn: function () {
          that.f5(false)
        },
        onClose: function () {}
      })
    },
    /**
     * [请求：工作台任务列表]
     */
    A_detailList(tab, show = false) {
      // const that = this
      // const { pageObj } = this
      // const page = parseInt(pageObj[tab].page) - 1
      // const num = pageObj[tab].size
      // const res = LocalData['任务中心']
      // console.log('res ----- ', res)
      // if (res.data.length) {
      //   /* ----- 有数据 ----- */
      //   /* tab 数字标记 */
      //   // const { tabs } = that
      //   // tabs[tab] = parseInt(res.nums)
      //   // that.tabs = Object.assign({}, tabs)
      //   if (show) {
      //     that.tabs[tab] = 999
      //   } else {
      //     that.tabs[tab] = parseInt(res.nums)
      //   }
      //   /* 分页数据 */
      //   const pageObj = {
      //     count: parseInt(res.nums),
      //     size: parseInt(num),
      //     page: page + 1
      //   }
      //   that.pageObj[tab] = pageObj
      //   /* 表格数据 */
      //   for (let i = 0; i < res.data.length; i++) {
      //     res.data[i].index = i
      //   }
      //   that.listObj[tab] = res.data || []
      // } else {
      //   /* ----- 没数据 ----- */
      //   const num = parseInt(pageObj[tab].page)
      //   if (num > 1) {
      //     that.pageObj[tab].page = num - 1
      //     /** 请求：消息中心 **/
      //     that.A_detailList(tab, true)
      //   }
      // }

      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const { tabType, search = {}, pageObj } = this
      /* 整理搜索对象 */
      const { task_content = '' } = search[tab]
      /* 整理分页对象 */
      const page = parseInt(pageObj[tab].page) - 1
      const num = pageObj[tab].size
      /* 发起请求 */
      const name = '工作台任务列表'
      const obj = { type: tabType[tab], task_content, emp_id: '', page, num } // { 页签, 当前登录用户的ID, 页码, 每页条数 }
      // const obj = { type: tabType[tab], task_content, emp_id: '965BAD8F4EF5C14CE4F607E77D30B9B5', page, num } // { 页签, 当前登录用户的ID, 页码, 每页条数 }
      const suc = function (res) {
        // localStorage.setItem('任务中心', JSON.stringify(res))
        // console.log('res ----- ', res)
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        /* tab 数字标记 */
        that.tabs[tab] = parseInt(res.nums)
        if (res.data.length) {
          /* ----- 有数据 ----- */
          /* 分页数据 */
          const pageObj = {
            count: parseInt(res.nums),
            size: parseInt(num),
            page: page + 1
          }
          that.pageObj[tab] = pageObj
          /* 表格数据 */
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].index = i
          }
          that.listObj[tab] = res.data || []
        } else {
          /* ----- 没数据 ----- */
          that.listObj[tab] = []
          const num = parseInt(pageObj[tab].page)
          if (num > 1) {
            that.pageObj[tab].page = num - 1
            /** 请求：工作台任务列表 **/
            that.A_detailList(tab, true)
          }
        }
      }
      Api({ name, obj, suc, method: 'post' })
    },
    /**
     * [切换页签]
     */
    changeTab(e) {
      this.active = e
    },
    /**
     * [表格多选]
     */
    handleSelectionChange(val = []) {
      const arr = []
      const ids_index = []
      val.forEach(function (item) {
        if (item.task_detail_id) {
          arr.push(item.task_detail_id)
          ids_index.push(item.index)
        }
      })
      this.ids = arr.join(',')
      this.ids_index = ids_index
    },
    /**
     * [请求：修改状态]
     */
    setColor(val) {
      const that = this
      const { ids } = this
      /* 发起请求 */
      const name = '修改状态'
      const obj = { type: val, ids }
      const suc = function (res) {
        that.f5(false)
      }
      Api({ name, obj, suc })
    },
    /**
     * [切换每页展示条数]
     */
    handleSizeChange(val) {
      const { pageObj, active } = this
      pageObj[active].size = val
      pageObj[active].page = 1
      this.A_detailList(active, true)
    },
    /**
     * [点击表头，input自动聚焦]
     * @param {[Int]} index 索引
     */
    tableHeaderClick(index) {
      const that = this
      setTimeout(function () {
        that.$refs[index].focus()
      }, 100)
    },
    /**
     * [切换分页]
     */
    handleCurrentChange(val) {
      const { pageObj, active } = this
      pageObj[active].page = val
      this.A_detailList(active, true)
    },
    /**
     * [清空输入框]
     * @param {[String]} name 字段名
     */
    clear(name) {
      const { active } = this
      this.search[active][name] = ''
    },
    /**
     * [搜索]
     */
    select() {
      const { pageObj, active } = this
      pageObj[active].page = 1
      this.A_detailList(active, true)
    },
    /**
     * [单元格样式]
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return {
          background: this.backgroundColor[row.emergency_level],
          color: row.emergency_level ? '#ffffff' : '',
          fontWeight: row.emergency_level ? 'bold' : ''
        }
      }
    },
    /**
     * [刷新]
     */
    f5(status = true) {
      const { pageObj, listObj, tabs } = this
      if (status) {
        /* 重置 */
        for (const x in pageObj) {
          pageObj[x] = { count: 0, size: 5, page: 1 }
        }
        for (const x in listObj) {
          listObj[x] = []
        }
        this.pageObj = pageObj
        this.listObj = listObj
        this.active = '预警'
      }
      /* 循环请求：所有页签内容 */
      for (const x in tabs) {
        this.A_detailList(x, true)
      }
    }
  }
}
</script>

<style scoped>
/*** 分页 ***/
.paginationBox {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.hover {
  cursor: pointer;
}
.click {
  color: #409EFF;
  text-decoration: underline;
}
</style>

<style>
.el-table-column--selection > .cell {
  padding: 0 !important;
}
.el-dropdown-menu__item, .el-dropdown-menu__item.is-disabled {
  color: #ffffff !important;
}

.el-popover > .el-popconfirm > .el-popconfirm__action > .el-button { /* 删除悬浮框：取消、确定按钮 */
  margin-left: 6px !important;
  padding: 2px 5px !important;
}
</style>
