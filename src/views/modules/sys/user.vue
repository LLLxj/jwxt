<template>
  <div class="mod-user">
    <!--布局容器-->
    <el-container>
      <!--左侧-->
      <el-aside width="160px">
        <school-all-sidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent" />
      </el-aside>
      <!--右侧-->
      <el-main>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            <el-button type="danger" :disabled="isShow" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50">
          </el-table-column>
          <!-- <el-table-column prop="userId" header-align="center" align="center" width="80" label="ID">
          </el-table-column> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO">
          </el-table-column>
          <el-table-column prop="username" header-align="center" align="center" label="用户名">
          </el-table-column>
          <el-table-column prop="email" header-align="center" align="center" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" header-align="center" align="center" label="手机号">
          </el-table-column>
          <el-table-column prop="schoolName" header-align="center" align="center" label="校区">
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" size="small" type="danger">禁用</span>
              <span v-else size="small">正常</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" header-align="center" align="center" width="180" label="创建时间">
          </el-table-column>
          <el-table-column fixed="right" header-align="center"  align="center"  width="150"  label="操作">
            <template slot-scope="scope">
              <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
              <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      </el-main>
    </el-container>
  </div>
</template>
<script>

  import { userList } from '@/api/sys'
  import schoolAllSidebar from '../../common-sidebar/school-all-sidebar'
  import AddOrUpdate from './user-add-or-update'
  import ElContainer from 'element-ui/packages/container/index'
  import ElAside from 'element-ui/packages/aside/index'
  import ElMain from 'element-ui/packages/main/index'
  export default {
    data () {
      return {
        dataForm: {
          userName: undefined,
          schoolId: undefined
        },
        dataList: [],
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      ElContainer,
      ElAside,
      ElMain,
      schoolAllSidebar,
    },
    // activated () {
    //   this.getDataList()
    // },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        userList(this.pageIndex,this.pageSize,this.dataForm.userName,this.dataForm.schoolId).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
            if(this.dataList !== null){
              this.isShow = false
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      schoolTreeChangeEvent (schoolId, schoolName, schoolCode) {
        this.dataForm.schoolId = schoolId
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 导出操作
      exportHandle () {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {

          const tHeader = ['用户名', '邮箱', '手机号', '校区', '状态', '创建时间']
          const filterVal = ['username', 'email', 'mobile', 'schoolName', 'status', 'createTime']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '管理员列表'
          })
          this.downloadLoading = false
        })
       
      },
      formatJson(filterVal, jsonData) {
　　　　　return jsonData.map(v => filterVal.map(j => v[j]))
　　　 },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
    }
  }
</script>
