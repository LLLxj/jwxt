<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.classTypeName" placeholder="请输入班型名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAuth('cou:classType:list')" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('cou:classType:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button  type="danger" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
      </el-table-column>
      <!-- <el-table-column prop="classTypeId" header-align="center" align="center" width="150" label="NO">
      </el-table-column> -->
      <el-table-column prop="classTypeName" header-align="center" align="center" label="班型">
      </el-table-column>
      <el-table-column prop="classTypePrice" header-align="center" align="center" label="价格">
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cou:classType:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.classTypeId)">编辑</el-button>
          <el-button type="text" size="small" @click="classTypeCourse(scope.row.classTypeId)">课程科目</el-button>
          <el-button v-if="isAuth('cou:classType:delete')" type="text" size="small" @click="deleteHandle(scope.row.classTypeId)">删除</el-button>
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

    <!-- 新增班型弹窗 -->
    <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></addOrUpdate>


    <!-- 课程科目 -->
    <classTypeCoursePop v-if="classTypeCoursePopVisible" ref="classTypeCoursePop" @refreshDataList="getDataList"></classTypeCoursePop>

  </div>
</template>

<script>
  import addOrUpdate from './classType-add-or-update'
  import { classTypeList, classTypeSave, classTypeUpdate ,classTypeDelete } from '@/api/classType'
  import classTypeCoursePop from './classTypeCourse-info'

  export default {
    data () {
      return {
        dataForm: {
          classTypeName: undefined,
        },
        adddClassTypeDataForm: {
          classTypeName: '',
          classTypePrice: '',
          classTypeId: ''
        },
        updateClassTypeDataForm: {
          classTypeName: '',
          classTypePrice: '',
          classTypeId: ''
        },
        downloadLoading: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        classTypeCoursePopVisible: false,
        addOrUpdateVisible: false,
        dialogFormVisible: false,
      }
    },
    components: {
      classTypeCoursePop, addOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        classTypeList(this.pageIndex, this.pageSize, this.dataForm.classTypeName).then(res => {
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
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
      // 新增编辑操作
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 课程科目
      classTypeCourse (id) {
        this.classTypeCoursePopVisible = true
        this.$nextTick(() => {
          this.$refs.classTypeCoursePop.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['班型', '价格']
          const filterVal = ['classTypeName', 'classTypePrice']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '班型档案'
          })
          this.downloadLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          classTypeDelete(id).then(res => {
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
