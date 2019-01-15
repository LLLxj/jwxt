<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobName" placeholder="请输入职位名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('cos:job:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button  type="danger" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" label="排序" align="center" header-align="center" width="60">
      </el-table-column>
      <!-- <el-table-column prop="jobId" header-align="center" align="center" width="80" label="ID">
      </el-table-column> -->
      <el-table-column prop="jobName" header-align="center" align="center" label="职位名称">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cos:job:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">编辑</el-button>
          <el-button v-if="isAuth('cos:job:delete')" type="text" size="small" @click="deleteHandle(scope.row.jobId)">删除</el-button>
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

  </div>
</template>

<script>
  import AddOrUpdate from './job-file-add-or-update'
  import {jobListDelete, jobList} from '@/api/jobFiles'

  export default {
    data () {
      return {
        dataForm: {
          jobName: '',
          creatorId: ''
        },
        dataList: [],
        downloadLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        jobList(this.dataForm.jobName).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.page.list
            this.totalPage = res.data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          console.log(err)
        })
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
          const tHeader = ['职位名称']
          const filterVal = ['jobName']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '职位表'
          })
          this.downloadLoading = false
        })

      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          jobListDelete(id).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
