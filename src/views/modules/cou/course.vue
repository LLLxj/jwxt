<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.courseName" placeholder="请输入课程节目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAuth('cou:course:list')" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('cou:course:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="info" :loading="downloadLoading" @click="exportHandle()" plain>导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
      </el-table-column>
      <!-- <el-table-column prop="courseId" header-align="center" align="center" width="150" label="NO">
      </el-table-column> -->
      <el-table-column prop="courseName" header-align="center" align="center" label="课程科目">
      </el-table-column>
      <el-table-column prop="courseContCount" header-align="center" align="center" label="基础课次">
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('cou:course:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.courseId)">编辑</el-button>
          <el-button type="text" size="small" @click="basicCourse(scope.row.courseId)">基础课次</el-button>
          <el-button v-if="isAuth('cou:course:delete')" type="text" size="small" @click="deleteHandle(scope.row.courseId)">删除</el-button>
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
    <AddOrUpdateCourse v-if="addOrUpdateVisible" ref="AddOrUpdateCourse" @refreshDataList="getDataList"></AddOrUpdateCourse>

    <!-- 基础课次 -->
    <basicCoursePop v-if="basicCoursePopVisable" ref="basicCoursePop" @refreshDataList="getDataList"></basicCoursePop>

  </div>
</template>

<script>
  import AddOrUpdateCourse from './course-add-or-update'
  import { courseList, courseDelete } from '@/api/course'
  import basicCoursePop from './basic-info'

  export default {
    data () {
      return {
        dataForm: {
          courseName: '',
          courseId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        basicCoursePopVisable: false
      }
    },
    components: {
      AddOrUpdateCourse, basicCoursePop
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        courseList(this.pageIndex, this.pageSize, this.dataForm.courseName).then(res => {
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
      //   基础课次操作
      basicCourse (id) {
        this.basicCoursePopVisable = true
        this.$nextTick(() => {
          this.$refs.basicCoursePop.init(id)
        })
      },
      // 导出操作
      exportHandle () {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['课程科目', '基础课次']
          const filterVal = ['courseName', 'courseContCount']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '课程科目档案'
          })
          this.downloadLoading = false
        })
      },
      exportHandle1 () {

      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //  新增,修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdateCourse.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          courseDelete(id).then(res => {
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
