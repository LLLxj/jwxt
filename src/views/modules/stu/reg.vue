<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>

      <!-- 左侧 -->
      <!-- <el-aside width="160px">
        <schoolAllSidebar ref="schoolAllSidebar" @school-sidebar-node-change-event="schoolTreeChangeEvent" />
      </el-aside> -->

      <!-- 右侧 -->
      <el-main>

        <el-row :gutter="24">
          <el-col :span="18">
            <!-- <el-button v-if="isAuth('stu:reg:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
            <el-button v-if="isAuth('stu:reg:save')" type="primary" @click="addReg()">新增</el-button>
            <!-- <el-button type="danger" @click="handleGrua()" :disabled="dataListSelections.length <= 0">批量毕业</el-button> -->
            <el-button type="info" :loading="downloadLoading" @click="exportHandle()">导出</el-button>
            <!-- <el-button type="info" :loading="download" @click="downloadHandle()">下载模板</el-button> -->
            <!-- <el-button type="primary" @click="uploadHandle()">上传文件</el-button> -->
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :span="18">
            <el-input placeholder="请输入内容" v-model="pageQuery.queryValue" class="input-with-select" :disabled="normalSearchVisible">
                <el-select v-model="pageQuery.queryKey" slot="prepend" placeholder="请选择" style="width:100px" :disabled="normalSearchVisible">
                  <el-option value="stuName" label="学员姓名">学员姓名</el-option>
                  <el-option value="regId" label="缴费单号">报名表号</el-option>
                  <el-option value="stuPhone" label="手机号">手机号</el-option>  
                </el-select>
            </el-input>
          </el-col>
          <el-col :span="6">
              <el-button v-if="isAuth('stu:reg:list')" type="primary" @click="getDataList()">查询</el-button>
              <el-button @click="resetSearch()">重置</el-button>
              <el-button v-if="normalSearchVisible == false" type="primary" icon="el-icon-arrow-down" @click="changeSearchStyle"></el-button>
              <el-button v-else type="primary" icon="el-icon-arrow-up" @click="hideSearch"></el-button>
          </el-col>
        </el-row>
      
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

          <el-row :gutter="24" style="margin-top:15px;" v-if="normalSearchVisible">
            <el-col :span="24">
              <el-form-item label="报名表号" prop="regNo">
                <el-input v-model="dataForm.regNo" placeholder="请输入报名表号" clearable></el-input>
              </el-form-item>
              <el-form-item label="身份证" prop="cardId">
                <el-input v-model="dataForm.cardId" placeholder="请输入身份证号" clearable></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="stuPhone">
                <el-input v-model="dataForm.stuPhone" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
              <el-form-item label="校区" prop="schoolId">
                <schoolSelect v-model="dataForm.schoolId" :clearable="noSelectSchool" :showAll="true" />
              </el-form-item>
              <el-form-item label="上课状态" prop="readStatus">
                <el-select v-model="dataForm.readStatus" placeholder="选择上课状态">
                  <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="日期" prop="dateTime">
                <el-date-picker v-model="dataForm.dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  value-format="yyyy-MM-dd 00:00:00"
                  :clearable="true"
                  :picker-options="datePickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="渠道" prop="channeId">
                <!-- <resourceSelect v-model="dataForm.channeName" @changeResource="getResourceVal"></resourceSelect> -->
                <resourceSelect v-model="dataForm.channeId" :clearable="noSelect"></resourceSelect>
              </el-form-item>

              <!-- 推广老师 -->
              <el-form-item label="电邀老师" prop="spreadUserName">
                <el-input v-model="dataForm.spreadUserName" placeholder="电邀老师" readonly @click.native="searchTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>

              <!-- 招生老师 -->
              <el-form-item label="招生老师" prop="recruitUserName">
                <el-input v-model="dataForm.recruitUserName" placeholder="招生老师" readonly @click.native="searchZsTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>

              
            </el-col>
          </el-row>          
        </el-form>

        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width:100%;margin-top:15px"
         :row-class-name="tableRowClassName" @row-click="classTableClickHandle">
          <!--隐藏列-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="报名表ID"><span>{{ props.row.regId }}</span></el-form-item>
                <el-form-item label="学员ID"><span>{{ props.row.stuUserId }}</span></el-form-item>
                <el-form-item label="班级ID"><span>{{ props.row.classId }}</span></el-form-item>
                <el-form-item label="招生老师ID"><span>{{ props.row.sellUserId }}</span></el-form-item>
                <el-form-item label="备注"><span>{{ props.row.remark }}</span></el-form-item>
                <el-form-item label="上课状态修改时间"><span>{{ props.row.readStatusUpdateTime }}</span></el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--展示列-->
          <el-table-column type="selection" header-align="center" align="center" width="50" fixed/>
          <el-table-column type="index" align="center" header-align="center" width="80" label="NO" fixed/>
          <el-table-column prop="regNo" header-align="center" align="center" width="140" label="报名表号" fixed/>
          <el-table-column prop="stuName" header-align="center" align="center" width="120" label="姓名"/>
          <el-table-column prop="stuPhone" header-align="center" align="center" label="手机" width="150"/>
          <el-table-column prop="schoolName" header-align="center" align="center" label="校区" width="180"/>
          <el-table-column prop="stuSex" header-align="center" align="center" label="性别" width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.stuSex  === 0" type="text" size="small">女</span>
              <span v-else size="small" type="text">男</span>
            </template>
          </el-table-column>
          <el-table-column prop="channeName" header-align="center" align="center" label="渠道" width="150"/>
          <el-table-column prop="classTypeName" header-align="center" align="center" label="报读班型" width="100"/>
          <el-table-column prop="classTypePrice" header-align="center" align="center" label="订单金额" width="100"/>
          <el-table-column prop="discPrice" header-align="center" align="center" label="优惠金额" width="100"/>
          <el-table-column prop="confPayPrice" header-align="center" align="center" label="已缴金额" width="100"/>
          <el-table-column prop="stayPayPrice" header-align="center" align="center" label="未缴金额" width="100"/>
          <el-table-column prop="refundPrice" header-align="center" align="center" label="已退金额" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.refundPrice !== null">{{scope.row.refundPrice}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" prop="stuUserAge" header-align="center" align="center"/>
          <el-table-column label="学历" prop="educType" header-align="center" align="center" :formatter="educTypeFormatter"/>
          <el-table-column label="身份证" prop="cardId" header-align="center" align="center" width="180"/>
          <el-table-column label="电邀老师" prop="spreadStuRegSaleEntity.userName" header-align="center" align="center" width="120"/>
          <el-table-column label="招生老师" prop="recruitStuRegSaleEntities" header-align="center" align="center" width="180">
            <template slot-scope="scope">
              <el-tag v-for="site in scope.row.recruitStuRegSaleEntities" :key="site.userId" :label="site.userName" :value="site.userId">
                {{site.userName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="户籍" prop="regAddr" header-align="center" align="center" width="120"/>
          <el-table-column label="原价" prop="classTypePrice" header-align="center" align="center"/>
          <el-table-column label="付款" prop="payPrice" header-align="center" align="center"  width="80"/>
          <!-- <el-table-column label="报名日期" prop="payDate" header-align="center" align="center" width="100" :formatter="dateFormatter"/>
          <el-table-column label="入学日期" prop="openSchoolDate" header-align="center" align="center" width="100" :formatter="dateFormatter"/> -->
          <el-table-column label="联系人" prop="contUserName" header-align="center" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.contUserName">{{scope.row.contUserName}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="联系人电话" prop="contUserPhone" header-align="center" align="center"  width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.contUserPhone">{{scope.row.contUserPhone}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态" prop="regStatus" header-align="center" align="center"  width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.regStatus === 1" size="small" type="danger">待审核</el-tag>
              <el-tag v-if="scope.row.regStatus === 2" size="small" type="success">通过</el-tag>
              <el-tag v-if="scope.row.regStatus === 0" size="small" type="info">作废</el-tag>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="上课状态" prop="readStatus" header-align="center" align="center"  width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.readStatus === 1" size="small" type="success">在读</el-tag>
              <el-tag v-if="scope.row.readStatus === 2" size="small" type="danger">休学</el-tag>
              <el-tag v-if="scope.row.readStatus === 3" size="small">毕业</el-tag>
              <el-tag v-if="scope.row.readStatus === 4" size="small"  type="info">作废</el-tag>
            </template>
          </el-table-column> -->

          <!-- <el-table-column header-align="center" align="center" width="190">
            <template slot="header" slot-scope="scope">
              <paySelect v-model="dataForm.payStatus" size="mini" @changePayment="getChangePaymentVal" :clearable="noSelectPayStatus"></paySelect>
            </template>
            <template slot-scope="scope" header-align="center" align="center">
              <el-tag v-if="scope.row.payStatus === 1" size="small" type="info">待缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 2" size="small" type="warning">已缴订金</el-tag>
              <el-tag v-if="scope.row.payStatus === 3" size="small" type="info">部分缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 4" size="small">已缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 5" size="small" type="danger">已退费</el-tag>
            </template>
          </el-table-column> -->

          <el-table-column header-align="center" align="center" width="150">
            <template slot="header" slot-scope="scope">
              <el-dropdown size="medium" @command="handleCommand">
                <span class="el-dropdown-link">
                  缴费状态<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="">全部</el-dropdown-item>
                  <el-dropdown-item command="1">待缴费</el-dropdown-item>
                  <el-dropdown-item command="2">已缴订金</el-dropdown-item>
                  <el-dropdown-item command="3">部分缴费</el-dropdown-item>
                  <el-dropdown-item command="4">已缴费</el-dropdown-item>
                  <el-dropdown-item command="5">已退费</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope" header-align="center" align="center">
              <el-tag v-if="scope.row.payStatus === 1" size="small" type="info">待缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 2" size="small" type="warning">已缴订金</el-tag>
              <el-tag v-if="scope.row.payStatus === 3" size="small" type="info">部分缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 4" size="small">已缴费</el-tag>
              <el-tag v-if="scope.row.payStatus === 5" size="small" type="danger">已退费</el-tag>
            </template>
          </el-table-column>

          <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="changeStatus(scope.row.regId)">通过</el-button> -->
              <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.regId)">编辑</el-button> -->
              <!-- <el-button type="text" size="small" @click="stopHandle(scope.row.regId)">作废</el-button> -->
              <!-- <el-button type="text" size="small" @click="changeUnstatus(scope.row.regId)">反审核</el-button> -->
              <!-- 课程科目为现在的分班 -->
              <el-button v-if="scope.row.readStatus == 1 || scope.row.readStatus == 2" type="text" size="small" @click="courseList(scope.row)">分班</el-button>
              <el-button v-if="scope.row.readStatus === 1 && scope.row.regStatus === 2" type="text" size="small" @click="handleFinish(scope.row.regId)">毕业</el-button>
              <el-button v-if="scope.row.readStatus === 3 && scope.row.regStatus === 2" type="text" size="small" @click="handleInClass(scope.row.regId)">在读</el-button>
              <el-button type="text" size="small" @click="regDetail(scope.row)">详情</el-button>
              <el-button type="text" size="small" v-if="isAuth('stu:reg:info')" @click="updateClassType(scope.row.regId)">升班</el-button>
              <el-button type="text" size="small" @click="handleRefund(scope.row.regId)">退费</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        <AddOrUpdate v-if="addOrUpdateVisible" ref="AddOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
        <courseList v-if="courseListVisible" ref="courseList" @refreshDataList="getDataList"></courseList>
      </el-main>
    </el-container>
    <!-- 弹窗, 上传文件 -->
    <uploadPop v-if="uploadPopVisible" ref="uploadPop" @refreshDataList="getDataList"></uploadPop>
    <!-- 操作记录右边展示 -->
    <regRecordRight v-show="selectRow.show" ref="regRecordRight"></regRecordRight>
    <!-- 报名表详情 -->
    <!-- <regDetail v-if="regDetailVisible" ref="regDetail"></regDetail> -->
    <!-- 招生老师弹窗 -->
    <zsTeacher ref="zsTeacher" v-if="zsTeacherVisible" @zs-pop-event="callBackZsTeacher"></zsTeacher>
    <!-- 推广老师弹窗 -->
    <tgTeacher ref="tgTeacher" v-if="tgTeacherVisible" @tg-pop-event="callBackTgTeacher"></tgTeacher>
    <!-- 升班操作 -->
    <updateClassType ref="updateClassType" v-if="updateClassTypeVisible"></updateClassType>
    <!-- 退费 -->
    <addRefund ref="addRefund" v-if="addRefundVisible" @refreshDataList="getDataList"></addRefund>
  </div>

</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }
</style>
<script>
  import Vue from 'vue'
  import uploadPop from '@/views/common-pop/upload-reg-pop'
  import AddOrUpdate from './reg-add-or-update'
  import courseList from './course-list'
  import { parseTime } from '@/utils'
  import schoolAllSidebar from '@/views/common-sidebar/school-all-sidebar'
  import { regList, regAdopt, regForbidden, regCheckPending, regChangeClass, regChangeClassInfo,
   handleRecordList, regHandleFinish, regSingleFinish, regSingleInClass, getRegList } from '@/api/reg'
  import { stuListDelete } from '@/api/student'
  import { dateSubstring } from '@/utils/index'
  import { getEduTypeList, getEduTypeLabelByVal } from '@/utils/educTypeUtil'
  import { getComStatusList } from '@/utils/comStatusUtil'
  import { getInClassStatusList } from '@/utils/inClassStatus'
  import regRecordRight from './reg-record'
  // import regDetail from './reg-detail'
  import schoolSelect from '@/views/common-select/school-select'
  import resourceSelect from '@/views/common-select/recource-select'
  import zsTeacher from '@/views/common-pop/zs-teacher-pop'
  import tgTeacher from '@/views/common-pop/tg-teacher-pop'
  import paySelect from '@/views/common-select/payment-select'
  import updateClassType from './reg-update-classType'
  import addRefund from './refund-add'

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
        dataForm: {
          regNo: undefined,
          educType: undefined,
          stuPhone: undefined,
          cardId: undefined,
          regStatus: undefined,
          dateTime: undefined,
          schoolId: undefined,
          schoolName: undefined,
          readStatus: undefined,
          channeId: undefined,
          // 招生老师
          recruitUserName: undefined,
          recruitUserId: undefined,
          // 推广老师
          spreadUserName: undefined,
          spreadUserId: undefined,
          // 付款状态
          payStatus: undefined
        },
        pageQuery: {
          queryKey: '',
          queryValue: null
        },
        selectRow: {
          show: false,
          regId: null
        },
        zsTeas: [],
        // 学历列表
        educTypeOptions: getEduTypeList(true),
        // 报名表状态
        statusList: getComStatusList(true),
        // 上课状态查询
        classList: getInClassStatusList(true),
        downloadLoading: false,

        download: false,
        // 保存回调的classId
        changeClassId: '',
        // 保存报名表和班级表信息的id
        regClassId: '',
        stuSearch: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        uploadPopVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogFormVisible: false,
        courseListVisible: false,
        regDetailVisible: false,
        zsTeacherVisible: false,
        tgTeacherVisible: false,
        noSelect: true,
        noSelectSchool: true,
        normalSearchVisible: false,
        updateClassTypeVisible: false,
        addRefundVisible: false,
        params: {}
      }
    },
    components: {
      AddOrUpdate, courseList, schoolAllSidebar,uploadPop, regRecordRight, resourceSelect, schoolSelect, zsTeacher, tgTeacher, paySelect, updateClassType, addRefund
    },
    activated () {
      this.getDataList()
    },
    computed: {
      dataFormchanneId () {
        return this.dataForm.channeId
      }
    },
    watch: {
      dataFormchanneId: function(val){
        // console.log(val)
        // this.dataForm.recource = val
      }
    },
    methods: {
      // 表格样式
      tableRowClassName ({row, rowIndex}) {
        if (row.regStatus === 2) {
          // 通过
          return 'success-row'
        } else if (row.regStatus === 0) {
          // 作废样式
          return 'warning-row'
        }
        return ''
      },
      // 获取数据列表
      getDataList () {
        // 处理日期
        let startDateTime = null
        let endDateTime = null
        if (this.dataForm.dateTime) {
          startDateTime = parseTime(this.dataForm.dateTime[0], '{y}-{m}-{d} 00:00:00')
          endDateTime = parseTime(this.dataForm.dateTime[1], '{y}-{m}-{d} 23:59:59')
        }
        this.dataListLoading = true
        // 查询
        if(this.normalSearchVisible == false){
          // 折叠状态
          // var params = {};
          this.params['page'] = this.pageIndex
          this.params['limit'] = this.pageSize
          if(this.pageQuery.queryKey !== '' ){
            this.params[this.pageQuery.queryKey] = this.pageQuery.queryValue
          }
          getRegList(this.params).then(res =>{
            if (res.data && res.data.code === 0) {
              // console.log(res)
              this.dataList = res.data.data.list
              this.zsTeas = res.data.data.list.recruitStuRegSaleEntities
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
          }).catch(err => {
            console.log(err)
          })
        }else{
          // 展开状态
          regList(this.pageIndex, this.pageSize, this.dataForm.regNo, this.dataForm.stuPhone, this.dataForm.cardId, this.dataForm.regStatus, 
          this.dataForm.educType, startDateTime, endDateTime, this.dataForm.schoolId,this.dataForm.readStatus, this.dataForm.channeId, this.dataForm.recruitUserId, 
          this.dataForm.spreadUserId, this.dataForm.payStatus)
          .then(res => {
            if (res.data && res.data.code === 0) {
              // console.log(res)
              this.dataList = res.data.data.list
              this.zsTeas = res.data.data.list.recruitStuRegSaleEntities
              this.totalPage = res.data.data.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
          }).catch(err => {
            console.log(err)
          })
        }
        
        
        this.dataListLoading = false
      },
      // 重置查询条件
      resetSearch () {
        this.dataForm.regNo = undefined
        this.dataForm.stuPhone = undefined
        this.dataForm.dateTime = undefined
        this.dataForm.regStatus = undefined
        this.dataForm.readStatus = undefined
        this.dataForm.cardId = undefined
        this.dataForm.dateTime = undefined
        this.dataForm.recruitUserName = undefined
        this.dataForm.recruitUserId = undefined
        this.dataForm.spreadUserName = undefined
        this.dataForm.spreadUserId = undefined
        this.dataForm.schoolId = undefined
        this.dataForm.channeId = undefined
        // this.noSelectSchool = false
        // this.noSelect = false
        // this.noSelectChannel = false
        this.normalSearchVisible = false
        this.params = {}
        this.pageQuery.queryKey = ''
        this.pageQuery.queryValue = ''
        
        this.getDataList()
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
      // 单独毕业
      handleFinish (id) {
        this.$confirm(`确定执行此操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regSingleFinish(id).then(res => {
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
      // 改为在读
      handleInClass (id) {
        this.$confirm(`确定执行此操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regSingleInClass(id).then(res => {
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
      // 批量毕业
      handleGrua (id) {
        var regId = id ? [id] : this.dataListSelections.map(item => {
          return item.regId
        })
        this.$confirm(`确定对[id=${regId.join(',')}]进行[${id ? '删除' : '批量毕业'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regHandleFinish(regId).then((res) => {
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
        }).catch(() => {})
      },
      // 导出操作
      exportHandle () {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['报名表号', '姓名', '手机', '性别', '报读班型', '校区', '年龄', '学历', '身份证', '招生老师', '户籍', '原价', '付款',
          '报名日期', '入学日期', '联系人', '联系人电话', '状态', '上课状态']
          const filterVal = ['regNo', 'stuName', 'stuPhone', 'stuSex', 'classTypeName', 'schoolName', 'stuUserAge', 'educType', 'cardId', 'userName',
          'regAddr', 'classTypePrice', 'payPrice', 'payDate', 'openSchoolDate', 'contUserName', 'contUserPhone', 'regStatus', 'regStatus']
          const data = this.formatJson(filterVal, this.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '报名表档案'
          })
          this.downloadLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 下载模板操作
      downloadHandle () {
        window.open(this.$http.adornUrl('/stu/reg/downTemplet?token='+Vue.cookie.get('token')), '_blank')
      },
      // 上传操作
      uploadHandle () {
        this.uploadPopVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPop.init()
        })
      },
      //  修改
      // addOrUpdateHandle (id) {
      //   this.addOrUpdateVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.AddOrUpdate.init(id)
      //   })
      // },
      //  分班
      courseList (id) {
        this.courseListVisible = true
        this.$nextTick(() => {
          this.$refs.courseList.init(id)
        })
      },
      // 通过操作
      changeStatus (id) {
        this.$confirm(`确定通过?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regAdopt(id).then(res => {
            if (res.data && res.data.code === 0){
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
          }).catch(err => {
            console.log(err)
          })
        })
      },
      // 反审核
      changeUnstatus (id) {
        this.$confirm(`确定反审核?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regCheckPending(id).then(res => {
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
      stopHandle (id) {
        this.$confirm(`确定作废?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          regForbidden(id).then(res => {
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
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stuListDelete(id).then(res => {
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
        }).catch(() => {})
      },
      educTypeFormatter (row, column, cellValue) {
        // 学历
        return getEduTypeLabelByVal(cellValue)
      },
      dateFormatter (row, column, cellValue) {
        return dateSubstring(cellValue)
      },
      // 报名表单选事件
      classTableClickHandle (currentRow) {
        // 展示右侧学员列表
        this.selectRow.show = true
        // 选中的报名表ID
        this.selectRow.regId = currentRow.regId
        // 左侧班级加载数据
        this.$refs.regRecordRight.init(this.selectRow.regId)
       
      },
      // 报名表详情
      regDetail (row) {
        this.$router.push({
          name: 'regDetail',
          query: {
            regId: row.regId
          }
        })
      },
      // 改变来源操作
      getResourceVal (val) {
        this.dataForm.chanelName = val
        this.getDataList()
      },
      // 招生老师弹窗
      searchZsTeacherHandle () {
        this.zsTeacherVisible = true
        this.$nextTick(() => {
          this.$refs.zsTeacher.init()
        })
      },
      // 招生老师弹窗回调
      callBackZsTeacher (userId,userName) {
        this.dataForm.recruitUserName = userName
        this.dataForm.recruitUserId = userId
        // console.log(userId,userName)
      },
      // 推广老师弹窗
      searchTgTeacherHandle () {
        this.tgTeacherVisible = true
        this.$nextTick(() => {
          this.$refs.tgTeacher.init()
        })
      },
      // 推广老师弹窗回调
      callBackTgTeacher (userId,userName) {
        this.dataForm.spreadUserName = userName
        this.dataForm.spreadUserId = userId
        // console.log(userId,userName)
      },
      // 改变付款状态回调
      // getChangePaymentVal (val) {
      //   // console.log(val)
      //   // 折叠状态
      //   if(this.normalSearchVisible == false){
      //     this.params['payStatus'] = val
      //   }else{
      //     this.dataForm.payStatus = val
      //   }
      //   this.getDataList()
      // },
      changeSearchStyle () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      hideSearch () {
        this.normalSearchVisible = !this.normalSearchVisible
        this.getDataList()
      },
      // 升班操作
      updateClassType (id) {
        this.updateClassTypeVisible = true
        this.$nextTick(() => {
          this.$refs.updateClassType.init(id)
        })
      },
      addReg () {
        this.$router.push({
          name: 'regAdd',
        })
      },
      // 退费操作
      handleRefund (id) {
        this.addRefundVisible = true
        this.$nextTick(() => {
          this.$refs.addRefund.init(id)
        })
      },
      // 监听付款状态
      handleCommand (command) {
        if(this.normalSearchVisible == false){
          this.params['payStatus'] = command
        }else{
          this.dataForm.payStatus = command
        }
        this.getDataList()
      }
    }
  }
</script>
