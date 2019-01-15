<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.schoolName" placeholder="请输入校区名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('cos:school:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button  type="danger" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" align="center" header-align="center" width="80" label="序号">
      </el-table-column>
      <el-table-column prop="schoolCode" header-align="center" align="center" label="校区编号">
      </el-table-column>
      <el-table-column prop="schoolName" header-align="center" align="center" label="校区名称">
      </el-table-column>
      <el-table-column prop="schoolPhone" header-align="center" align="center" label="办公电话">
      </el-table-column>
      <el-table-column prop="schoolAddr" header-align="center" align="center" label="详细地址">
      </el-table-column>
      <el-table-column prop="schoolHeader" header-align="center" align="center" label="校长姓名">
      </el-table-column>
      <el-table-column prop="schoolHeaderPhone" header-align="center" align="center" label="联系方式">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cos:school:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.schoolId)">编辑</el-button>
          <el-button v-if="isAuth('cos:school:delete')" type="text" size="small" @click="deleteHandle(scope.row.schoolId)">删除</el-button>
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
  import AddOrUpdate from './school-file-add-or-update'
  import {schoolList, schoolListDelete} from '@/api/schoolFiles'

  export default {
    data () {
      return {
        dataForm: {
          schoolName: undefined
        },
        dataList: [],
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
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        schoolList(this.pageIndex, this.pageSize, this.dataForm.schoolName).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 重置
      resetSearch () {
        this.dataForm.schoolName = ''
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

          const tHeader = ['校区编号', '校区名称', '办公电话', '详细地址', '校长姓名', '联系方式']
          const filterVal = ['schoolCode', 'schoolName', 'schoolPhone', 'schoolAddr', 'schoolHeader', 'schoolHeaderPhone']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '校区表'
          })
          this.downloadLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
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
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          schoolListDelete(id).then(res => {
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
