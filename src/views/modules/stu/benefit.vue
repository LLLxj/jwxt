<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <el-col :span="18">
            <el-button type="primary" :disabled="notBenefit" v-if="isAuth('stu:reg:off:save')" @click="benefitHandle()">申请优惠</el-button>
            <!-- <el-button type="primary" v-if="isAuth('stu:reg:list')" :disabled="dataListSelections.length <= 0">同意优惠</el-button>
            <el-button type="danger" :disabled="dataListSelections.length <= 0">拒绝优惠</el-button> -->
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top:15px">
          <el-col :span="18">
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
                <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible">
                  <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                  <el-option value="offNo" label="优惠单号">优惠单号</el-option>
                  <el-option value="stuPhone" label="手机号">手机号</el-option>  
                </el-select>
            </el-input>
          </el-col>
          <el-col :span="6">
              <el-button @click="getDataList()">查询</el-button>
              <el-button @click="resetSearch()">重置</el-button>
              <el-button v-if="normalSearchVisible == false" type="primary" icon="el-icon-arrow-down" @click="changeSearchStyle"></el-button>
              <el-button v-else type="primary" icon="el-icon-arrow-up" @click="hideSearch"></el-button>
          </el-col>
        </el-row>

        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-row :gutter="24" style="margin-top:15px;" v-if="normalSearchVisible">
              <el-col :span="24">
                <el-form-item label="优惠单号" prop="offNo">
                  <el-input v-model="dataForm.offNo" placeholder="请输入优惠单号" clearable></el-input>
                </el-form-item>
                  <el-form-item label="姓名" prop="stuName">
                      <el-input v-model="dataForm.stuName" placeholder="请输入学员名字" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="stuPhone">
                      <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="校区" prop="schoolId">
                    <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true" />

                    <!-- <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true">
                    </schoolSelect> -->
                  </el-form-item>
                   <el-form-item label="报读班型" prop="classTypeId">
                    <classTypeSelect v-model="dataForm.classTypeId" :clearable="noSelectClassType"></classTypeSelect>
                  </el-form-item>
                  
                  <el-form-item label="申请状态" prop="status">
                      <el-select v-model="dataForm.status" placeholder="全部" :clearable="noSelect">
                          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="钉钉单号" prop="ddingCode">
                      <el-input v-model="dataForm.ddingCode" placeholder="请输入钉钉单号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="审核人" prop="statusUserName">
                      <el-input v-model="dataForm.statusUserName" placeholder="审核人" readonly @click.native="searchCheckPeoHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item>
                  <el-form-item label="创建人" prop="creatorName">
                      <el-input v-model="dataForm.creatorName" placeholder="创建人" clearable @click.native="searchCreatorPeoHandle()" prefix-icon="el-icon-search"></el-input>
                  </el-form-item>
                 
                  <!-- <el-form-item label="渠道" prop="channeId">
                    <resourceSelect v-model="dataForm.channeId" :clearable="noSelectChannel"></resourceSelect>
                  </el-form-item> -->
                  

                  <el-form-item label="申请日期" prop="dateTime">
                    <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                      value-format="yyyy-MM-dd 00:00:00" :clearable="true" :picker-options="datePickerOptions">
                    </el-date-picker>
                  </el-form-item>
                  
              </el-col>
            </el-row> 
        </el-form>
        
        <!-- <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top:15px;" @selection-change="selectionChangeHandle" 
        highlight-current-row @row-click="handleRowlclick"> -->
            
        <el-table :data="dataList" border v-loading="dataListLoading"  highlight-current-row @row-click="handleRowlclick" style="width: 100%;margin-top:15px;">
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50" fixed/> -->
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column align="center" prop="offNo" header-align="center" width="180" label="优惠单号"/>
          <el-table-column align="center" prop="stuName" header-align="center" width="100" label="学员"/> 
          <el-table-column align="center" prop="stuPhone" header-align="center" width="120" label="手机号码"/>
          <el-table-column align="center" prop="schoolName" header-align="center" width="100" label="校区"/>
          <el-table-column align="center" prop="classTypeName" header-align="center" width="120" label="购买课程"/>
          <el-table-column align="center" prop="offPrice" header-align="center" width="100" label="优惠金额"/>
          <el-table-column align="center" prop="status" header-align="center" width="100" label="申请状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">财务审核中</span>
              <span v-if="scope.row.status === 2">已优惠</span>
              <span v-if="scope.row.status === 3">优惠失败</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ddingCode" header-align="center" width="150" label="钉钉号"/>
          <el-table-column prop="statusUserCallVo" align="center" header-align="center" width="120" label="审核人">
            <template slot-scope="scope">
              <span v-if="scope.row.statusUserCallVo == null">--</span>
              <span v-else>{{scope.row.statusUserCallVo.statusUserName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="creatorName" header-align="center" label="创建人"/>
          <el-table-column align="center" prop="createTime" header-align="center" :formatter="dateFormatter" label="创建时间"/>
          <el-table-column fixed="right" header-align="center" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="isAuth('stu:reg:off:update') && scope.row.status == 1" @click="accept(scope.row.offId)">同意</el-button>
              <el-button type="text" size="small" v-if="isAuth('stu:reg:off:update') && scope.row.status == 1" @click="refuse(scope.row.offId)">拒绝</el-button>
              <el-button type="text" size="small" v-if="isAuth('stu:reg:off:update') && scope.row.status == 2" @click="uncheck(scope.row.offId)">反审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-main>
    </el-container>
    <!-- 申请优惠 -->
    <benefitAdd ref="benefitAdd" v-if="benefitVisible" @refreshDataList="getDataList"></benefitAdd>
    <!-- 审核人弹窗 -->
    <checkPeo ref="checkPeo" v-if="checkPeoVisible" @all-check-pop-event="callBackcheckPeo"></checkPeo>
    <!-- 创建人弹窗 -->
    <creatorPeo ref="creatorPeo" v-if="creatorPeoVisible" @all-creator-pop-event="callBackCreatorPeo"></creatorPeo>
  </div>

</template>

<script>
  import { getBenefitList, benefitList, acceptBenefit, refuseBenefit, uncheckBenefit } from '@/api/benefit'
  import resourceSelect from '@/views/common-select/recource-select'
  import schoolSelect from '@/views/common-select/school-select'
  import classTypeSelect from '@/views/common-select/classtype-select'
  import checkPeo from '@/views/common-pop/all-check-pop'
  import creatorPeo from '@/views/common-pop/creator-pop'
  import benefitAdd from './benefit-add'
  import { dateSubstring } from '@/utils/index'
  import { parseTime } from '@/utils'

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
        visible: false,
        roleList: [],
        dataListSelections: [],
        value: '',
        dataForm: {
          stuPhone: undefined,
          stuName: undefined,
          offNo: undefined,
          schoolId: undefined,
          schoolName: undefined,
          status: undefined,
          dateTime: undefined,
          classTypeId: undefined,
          ddingCode: undefined,
          statusUserId: undefined,
          statusUserName: undefined,
          creatorId: undefined,
          creatorName: undefined
        },
        adVancedDataForm: {
          offNo: undefined,
          stuPhone: undefined,
          stuName: undefined
        },
        pageQuery: {
          queryKey: '',
          queryValue: null
        },
        status: [
          { value: '', label: '全部' },
          { value: 1, label: '财务审核中' },
          { value: 2, label: '已优惠' },
          { value: 3, label: '优惠失败' }
        ],
        params: {},
        dataList: [],
        dataSelections: [],
        dataSelect: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        downloadLoading: false,
        dataListLoading: false,
        dialogFormVisible: false,
        noSelect: true,
        normalSearchVisible: false,
        noSelectSchool: true,
        noSelectClassType: true,
        benefitVisible: false,
        notBenefit: true,
        checkPeoVisible: false,
        creatorPeoVisible: false
      }
    },
    components: {
    //   schoolAllSidebar, stopAdd, resumeClasses
      resourceSelect, schoolSelect, classTypeSelect, benefitAdd, checkPeo, creatorPeo
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let startDateTime = null
        let endDateTime = null
        if (this.dataForm.dateTime) {
          startDateTime = parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00')
          endDateTime = parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59')
        }
        if(this.normalSearchVisible == false){
          // console.log('折叠状态')
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if(this.pageQuery.queryKey !== '' ){
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          benefitList(this.params).then(res => {
            if (res.data && res.data.code === 0) {
              var tempData = res.data.data.list
              for(var i in tempData){
                tempData[i].createTime = tempData[i].createTime.substring(0,10)
              }
              this.dataList = tempData
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          }).catch(err => {
            console.log(err)
          })
        }else{
          // console.log('展开状态')
          getBenefitList(
            this.pageIndex, this.pageSize, this.dataForm.offNo, this.dataForm.stuName, this.dataForm.stuPhone, this.dataForm.schoolId, this.dataForm.classTypeId,
            this.dataForm.status, this.dataForm.ddingCode, this.dataForm.statusUserId, this.dataForm.creatorId, startDateTime, endDateTime)
          .then(res => {
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
        }
        
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.offNo = undefined
        this.dataForm.stuName = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.classTypeId = undefined
        this.dataForm.status = undefined
        this.dataForm.ddingCode = undefined
        this.dataForm.statusUserId = undefined
        this.dataForm.statusUserName = undefined
        this.dataForm.creatorId = undefined
        this.dataForm.creatorName = undefined
        this.dataForm.dateTime = undefined
        this.noSelect = false
        this.normalSearchVisible = false
        this.params = {}
        this.pageQuery.queryKey = ''
        this.pageQuery.queryValue = ''
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
      changeSearchStyle () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      hideSearch () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
       // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 选中某行
      handleRowlclick (row) {
        this.noBenefit = false
        this.dataSelections = row
      },
      // 更改时间显示格式
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      // 申请优惠操作
      benefitHandle () {
        this.benefitVisible = true
        this.$nextTick(() => {
          this.$refs.benefitAdd.init(this.dataSelect)
        })
      },
      // 选中某行事件
      handleRowlclick (row) {
        this.notBenefit = false
        this.dataSelect = row
      },
      // 同意优惠
      accept (id) {
        this.$confirm(`确定同意优惠?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          acceptBenefit(id).then(res => {
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
        })
      },
      // 拒绝优惠
      refuse (id) {
        this.$confirm(`确定拒绝优惠?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refuseBenefit(id).then(res => {
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
        })
      },
      // 反审核
      uncheck (id) {
        this.$confirm(`确定拒绝优惠?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uncheckBenefit(id).then(res => {
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
        })
      },
      // 审核人弹窗
      searchCheckPeoHandle () {
        this.checkPeoVisible = true
        this.$nextTick(() => {
          this.$refs.checkPeo.init()
        })
      },
      // 审核人弹窗回调
      callBackcheckPeo (userId,userName) {
        this.dataForm.statusUserId = userId
        this.dataForm.statusUserName = userName
      },
      
        // 创建人弹窗
      searchCreatorPeoHandle () {
        this.creatorPeoVisible = true
        this.$nextTick(() => {
          this.$refs.creatorPeo.init()
        })
      },
      // 审核人弹窗回调
      callBackCreatorPeo (userId,userName) {
        this.dataForm.creatorId = userId
        this.dataForm.creatorName = userName
      },
    }
  }
</script>
