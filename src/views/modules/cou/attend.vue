<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 右侧 -->
      <el-main>

        <!-- 按手机查询 -->
        <el-form :inline="true" :model="dataForm1" @keyup.enter.native="getDataList()">
          <el-form-item label="手机" prop="stuMobile">
            <el-input v-model="dataForm1.stuMobile" placeholder="请输入手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 按班级查询 -->
        <el-form :inline="true" :model="dataForm4" @keyup.enter.native="getDataListByCplan()">
          <el-form-item label="班级" prop="cplanName">
            <el-input v-model="dataForm4.cplanName" placeholder="点击选择班级" readonly @click.native="searchCplanHandle()" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataListByCplan()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="dataForm3">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="dataForm3.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="datePickerOptions"
            >
            </el-date-picker>
            <el-button @click="resetSearch()">重置</el-button>
            <el-button  type="danger" :loading="downloadLoading" @click="downloadHandle()">下载模板</el-button>
            <el-button type="primary" @click="uploadHandle()">上传文件</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
          </el-table-column>
          <el-table-column prop="stuName" header-align="center" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="cplanOpenDate" header-align="center" align="center" label="上课日期" :formatter="dateFormatter">
          </el-table-column>
          <el-table-column prop="cplanContName" header-align="center" align="center" label="课次">
          </el-table-column>
          <el-table-column prop="attendType" header-align="center" align="center" label="考勤状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.attendType  === 0" type="" size="medium">未考勤</el-tag>
              <el-tag v-if="scope.row.attendType  === 1" type="danger" size="medium">缺勤</el-tag>
              <el-tag v-if="scope.row.attendType  === 2" type="warning" size="medium">请假</el-tag>
              <el-tag v-if="scope.row.attendType  === 3" type="info" size="medium">休学</el-tag>
              <el-tag v-if="scope.row.attendType  === 20" type="success" size="medium">出勤</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lectuerName" header-align="center" align="center" label="讲师">
          </el-table-column>
          <el-table-column prop="stuMobile" header-align="center" align="center" label="手机">
          </el-table-column>
          <el-table-column prop="cplanName" header-align="center" align="center" label="班级">
          </el-table-column>
          <el-table-column prop="jaowuName" header-align="center" align="center" label="教务老师">
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>

    <!-- 课次弹窗 -->
    <cplanPop v-if="cplanPopVisible" ref="cplanPop" @cplan-pop-event="callBackCplanPop"></cplanPop>
    <!-- 弹窗, 上传文件 -->
    <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop>
  </div>
</template>

<script>
  import Vue from 'vue'
  import cplanPop from '@/views/common-pop/cplan-pop'
  import uploadPop from '@/views/common-pop/upload-pop'
  import { parseTime } from '@/utils'
  import { attendByMobile, attendByCplanId } from '@/api/attend'

  export default {
    data () {
      return {
        datePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dataForm1: {
          stuMobile: ''
        },
        dataForm3: {
          date: [
            new Date(),
            new Date()
          ]
        },
        dataForm4: {
          cplanId: '',
          cplanName: ''
        },
        queryType: 0,  // 1.手机号码查询 2.班级查询
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        uploadPopVisible: false,
        downloadLoading: false,
        cplanPopVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        dialogFormVisible: false
      }
    },
    components: {
      cplanPop, uploadPop
    },
    methods: {
      // 获取数据列表
      getDataList () {
        if (!this.dataForm1.stuMobile) {
          this.$message.error('请输入手机号码')
          return
        }
        this.dataListLoading = true
        attendByMobile(this.pageIndex, this.pageSize, this.dataForm1.stuMobile, parseTime(this.dataForm3.date[0]), parseTime(this.dataForm3.date[1])).then(res => {
          this.queryType = 1
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          this.dataListLoading = false
          console.log(err)
        })
      },
      getDataListByCplan () {
        if (!this.dataForm4.cplanId) {
          this.$message.error('请选择班级')
          return
        }
        this.dataListLoading = true
        attendByCplanId(this.pageIndex, this.pageSize, this.dataForm4.cplanId, parseTime(this.dataForm3.date[0]), parseTime(this.dataForm3.date[1])).then(res => {
          this.queryType = 2
          if (res.data && res.data.code === 0) {
            this.dataList = res.data.data.list
            this.totalPage = res.data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(err => {
          this.dataListLoading = false
          console.log(err)
        })
      },
      switchGetDataList () {
        switch (this.queryType) {
          case 1:// 手机号码查询
            this.getDataList()
            break
          case 2:// 班级查询
            this.getDataListByCplan()
            break
          default:
            alert('请按照手机号码或者班级或者班级进行查询！')
        }
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm1.stuMobile = ''
        this.dataForm4.cplanName = ''
        this.dataForm4.cplanId = ''
        this.dataForm3.date = [new Date(), new Date()]
        this.queryType = 0
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.switchGetDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.switchGetDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 下载模板操作
      downloadHandle () {
        window.open(this.$http.adornUrl('/cou/attend/down?token=' + Vue.cookie.get('token')), '_blank')
      },
      // 上传操作
      uploadHandle () {
        this.uploadPopVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPop.init()
        })
      },
      // 选择课次弹窗
      searchCplanHandle () {
        this.cplanPopVisible = true
        this.$nextTick(() => {
          this.$refs.cplanPop.init()
        })
      },
      callBackCplanPop (cplanId, cplanName) {
        this.dataForm4.cplanId = cplanId
        this.dataForm4.cplanName = cplanName
      },
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.AddOrUpdate.init(id)
        })
      },
      //   课程列表
      courseList (id) {
        this.$nextTick(() => {
          this.$refs.courseList.init(id)
        })
      },
      dateFormatter (row, column, cellValue) {
        return cellValue ? cellValue.substring(0, 10) : '-'
      }
    }
  }
</script>
