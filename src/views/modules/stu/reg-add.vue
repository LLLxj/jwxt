<template>
<div style="padding:0 1%">
  <div>
    <div>
        <el-form :model="dataForm" :inline="true" :rules="dataRule" ref="dataForm">
          <div>
          <!-- 学员信息 -->
          <h2 style="color:#333333">学员个人信息</h2>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="身份证号" prop="cardId" clearable>
                <el-input v-model="dataForm.cardId" class="box-input" :disabled="noDesign"  placeholder="身份证号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学员" prop="stuName" >
                <el-input v-model="dataForm.stuName" class="box-input" :disabled="edit" placeholder="学员姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" size="mini" prop="stuSex">
                <el-radio-group v-model="dataForm.stuSex" :disabled="edit">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
             <el-col :span="6">
                <el-form-item label="联系方式" prop="stuPhone">
                    <el-input v-model="dataForm.stuPhone" class="box-input" :disabled="edit" placeholder="联系方式" maxlength="20"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="年龄" prop="stuUserAge" >
                <el-input-number v-model="dataForm.stuUserAge" :min="1" class="box-input" :max="100" :disabled="edit" controls-position="right"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="学历" prop="educType">
                  <el-select v-model="dataForm.educType" class="box-input" :disabled="edit" placeholder="请选择学历">
                      <el-option v-for="item in educTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="户籍" prop="regAddr">
                <el-input v-model="dataForm.regAddr" placeholder="户籍" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="现住地" prop="addr">
                  <el-input v-model="dataForm.addr" placeholder="现所住地区" class="box-addr" :disabled="edit" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            
            
            <el-col :span="6">
              <el-form-item label="联系人" prop="contUserName">
                  <el-input v-model="dataForm.contUserName" placeholder="紧急联系人" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="联系人电话" prop="contUserPhone">
                <el-input v-model="dataForm.contUserPhone" placeholder="紧急联系人电话" class="box-input" :disabled="edit" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道" prop="channeId">
                <!-- <resourceSelect v-model="dataForm.channeId" :clearable="noSelect" :disabled="edit" @changeResource="getChannelVal"></resourceSelect> -->
                <resourceSelect v-model="dataForm.channeId" :clearable="noSelect" @changeResource="getChannelVal"></resourceSelect>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 学员信息结束 -->
        </div>

        <div>
          <!-- 报读课程信息 -->
          <h2 style="color:#333333">报读课程</h2>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="校区" prop="schoolId">
                <school-select v-model="dataForm.schoolId" :disabled="noDesign" :clearable="noSelectSchool"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报读班型" prop="classTypeName">
                <el-input v-model="dataForm.classTypeName" placeholder="点击选择班型" class="box-input" readonly @click.native="selectClassTypeHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="课程价格:" prop="classTypePrice">
                <!-- <template slot-scope="scope">
                  <span v-model="dataForm.classTypePrice"></span>
                </template> -->
                <el-button type="text" style="color:black" v-model="dataForm.classTypePrice">{{ this.dataForm.classTypePrice }}</el-button>
                <!-- <el-input-number v-model="dataForm.classTypePrice" :min="0" class="box-input" :max="100000" controls-position="right"></el-input-number> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单价格:" prop="payPrice">
                <el-button type="text" style="color:black" v-model="dataForm.payPrice">{{ this.dataForm.payPrice }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="已缴金额:" prop="confPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.confPayPrice">{{ this.dataForm.confPayPrice }}</el-button>
              </el-form-item>
            </el-col> 
            <el-col :span="6">
              <el-form-item label="需缴金额:" prop="stayPayPrice">
                <el-button type="text" style="color:black" v-model="dataForm.stayPayPrice">{{ this.dataForm.stayPayPrice }}</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="outerSubVisible">
              <el-form-item label="电邀老师" prop="spreadStuRegSaleEntity">
                <el-input v-model="dataForm.spreadStuRegSaleEntity.userName" placeholder="点击选择电邀老师" class="box-input" readonly @click.native="selectTgTeacherHandle()" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"> 
              <el-form-item label="招生老师" prop="recruitStuRegSaleEntities">
                <el-tag v-for="teacher in dataForm.recruitStuRegSaleEntities" :key="teacher.userId" @close="handleJobClose(teacher)" closable>
                  {{teacher.userName}}
                </el-tag>
                <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 老师</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="!outerSubVisible">
              <el-form-item label="介绍人" prop="nickName">
                <el-input v-model="dataForm.nickName" placeholder="输入介绍人姓名" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 报读课程信息结束 -->

        
        <div>
          <!-- 优惠信息 -->
          <h2 style="color:#333333">优惠信息</h2>
          <el-row :gutter="24" style="margin-top:15px;">
                <el-col :span="6">
                <div class="span-content">
                    优惠单号: {{benefitNo}}
                </div>
                </el-col>

                <el-col :span="6">
                <el-form-item label="优惠金额" prop="offPrice">
                    <el-input-number v-model="dataForm.offPrice" class="box-input" v-on:blur="getBenefitValue" controls-position="right"></el-input-number>
                </el-form-item> 
                </el-col>
                <el-col :span="6"> 
                <el-form-item label="钉钉单号" prop="ddingCode">  
                    <el-input v-model="dataForm.ddingCode" placeholder="请输入钉钉单号" prefix-icon="el-icon-search"></el-input>
                </el-form-item> 
                </el-col>

                <el-col :span="6">
                <el-form-item label="备注">
                    <el-input type="textarea" class="box-remark" v-model="dataForm.benefitRemark"></el-input>
                </el-form-item> 
                </el-col>
            </el-row>
        </div>

        <div>
          <!-- 本次缴费 -->
          <h2 style="color:#333333">本次缴费</h2>
          
          <el-row :gutter="24" style="background:#FAFBFD;height:50px;line-height:50px;">
            <el-col :span="4">
                <span>缴费单号:</span>
            </el-col>
            <el-col :span="4">
                <span>本次缴费金额</span>
            </el-col>
            <el-col :span="4">
                <span>缴费类型</span>
            </el-col>
            <el-col :span="4">
                <span>支付方式</span>
            </el-col>
            <el-col :span="4">
                <span>学员缴费时间</span>
            </el-col>
            <el-col :span="4">
                <span>备注</span>
            </el-col>
            <el-col :span="4">
                <span>{{paymentNo}}</span>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="payPriceNow" class="tabel-input">
                <el-input-number v-model="dataForm.payPriceNow" class="box-input" controls-position="right"></el-input-number>
              </el-form-item> 
            </el-col>

            <el-col :span="4">
                <el-form-item prop="paymentType" class="tabel-input">
                    <!-- <el-select v-model="dataForm.payType" placeholder="缴费类型">
                        <el-option v-for="item in payType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select> -->
                    <payType v-model="dataForm.paymentType" :clearable="noSelectType"></payType>
                </el-form-item> 
            </el-col>

            <el-col :span="4">
                <el-form-item prop="payTypeId" class="tabel-input">
                  <payStyle v-model="dataForm.payTypeId" :clearable="noSelectPayStyle"></payStyle>
                </el-form-item>
            </el-col>

            <el-col :span="4">
                <el-form-item prop="payTime" class="tabel-input">
                  <el-date-picker v-model="dataForm.payTime" style="width:80%"  type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期时间"></el-date-picker>
                </el-form-item> 
            </el-col>

            <el-col :span="4">
              <el-form-item prop="payRemark" class="tabel-input">
                  <el-input type="textarea" v-model="dataForm.PayRemark" class="box-remark" ></el-input>
              </el-form-item> 
            </el-col>

            
          </el-row>
        </div>
          <!-- 本次缴费结束 -->
         
      </el-form>

    </div>
  
    <div style="float:right;margin-right:50px;margin-top:15px;">
      <el-button size="medium" @click="cancle()">取消</el-button>
      <el-button size="medium" type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <div style="clear"></div>
  </div>

  <!-- 弹窗部分 -->
  <div>
      <classType ref="classType" v-if="classTypePopVisible" @classType-pop-event="callBackClassType"></classType>
      <schoolPop ref="schoolPop" v-if="schoolPopVisible"  @school-pop-event="callBackSchoolPop"></schoolPop>
      <teacherPop ref="teacherPop" v-if="teacherPopVisible" @tg-pop-event="callBackTgPop"></teacherPop>
      <zsTeacherPop ref="zsTeacherPop" v-if="zsTeacherPopVisible" @zs-pop-event="callBackZsPop"></zsTeacherPop>
  </div>
</div>
</template>
<style>
  /* .box-remark {
    width:250%;
  } */
</style>
<script>
  import classType from '@/views/common-pop/class-type-pop'
  import teacherPop from '@/views/common-pop/tg-teacher-pop'
  import zsTeacherPop from '@/views/common-pop/zs-teacher-pop'
  import { isMobile } from '@/utils/validate'
  import { regInfo, regSave, regUpdate, regCheckCardId, regCheckPhone } from '@/api/reg'
  import { parseTime } from '@/utils/index'
  import { getEduTypeList } from '@/utils/educTypeUtil'
  import schoolSelect from '@/views/common-select/school-select'
  import resourceSelect from '@/views/common-select/recource-select'
  import payStyle from '@/views/common-select/payStyle-select'
  import payType from '@/views/common-select/payType-select'
  import { getPaymentNo } from '@/api/payment'
  import { putBenefitNo } from '@/api/benefit'

  export default {
    data () {
      var validateStuPhone = (rule, value, callback) => {
        if (isMobile(value)) {
          regCheckPhone(value).then(res => {
            if(res.data && res.data.code == 0){
              callback()
            } else {
              callback(new Error('手机号已存在'))
            }
          }).catch(err => {

          })
        } else {
          callback(new Error('手机号格式错误'))
        }
      }
      var validateDispricePrice = (rule, value, callback) => {
        if (value && this.dataForm.payPrice !== '--') {
          this.dataForm.payPrice = this.dataForm.classTypePrice - value
          this.dataForm.stayPayPrice = this.dataForm.payPrice
        }
      }
      var validateCardId = (rule, value, callback) => {
        if (value) {
          regCheckCardId(value).then(res => {
            if (res.data && res.data.code === 0 && res.data.stuUserEntity !== null) {
              this.edit = true
              this.dataForm.stuUserId = res.data.stuUserEntity.stuUserId
              this.dataForm.stuName = res.data.stuUserEntity.stuName
              this.dataForm.stuSex = res.data.stuUserEntity.stuSex
              this.dataForm.stuPhone = res.data.stuUserEntity.stuPhone
              this.dataForm.stuUserAge = res.data.stuUserEntity.stuUserAge
              this.dataForm.educType = res.data.stuUserEntity.educType
              this.dataForm.addr = res.data.stuUserEntity.addr
              this.dataForm.regAddr = res.data.stuUserEntity.regAddr
              this.dataForm.contUserName = res.data.stuUserEntity.contUserName
              this.dataForm.contUserPhone = res.data.stuUserEntity.contUserPhone
              callback()
            }
            if (res.data && res.data.code === 500) {
              this.edit = true
              callback(new Error('请输入正确格式的身份证号码'))
            } 
            if(res.data && res.data.code == 0 && res.data.stuUserEntity == null){
              this.edit = false 
              // this.dataForm.stuName = ''
              // this.dataForm.stuSex = 0
              // this.dataForm.stuPhone = ''
              // this.dataForm.stuUserAge = ''
              // this.dataForm.educType = 1
              // this.dataForm.addr = ''
              // this.dataForm.regAddr = ''
              // this.dataForm.contUserName = ''
              // this.dataForm.contUserPhone = ''
              callback()
            }
          }).catch(err => {

          })
        } 
      }
      
      return {
        visible: false,
        roleList: [],
        value: '',
        classTypePopVisible: false,
        schoolPopVisible: false,
        teacherPopVisible: false,
        zsTeacherPopVisible: false,
        edit: true,
        noDesign: false,
        educTypeOptions: getEduTypeList(false),
        noSelect: true,
        noSelectSchool: true,
        outerSubVisible: true,
        noSelectType: true,
        noSelectPayStyle: true,
        dataForm: {
          // 个人信息
          stuName: '',
          cardId: '',
          stuSex: 0,
          stuUserAge: '',
          educType: 1,
          addr: '',
          regAddr: '',
          stuPhone: '',
          contUserName: '',
          contUserPhone: '',
          // 报读信息
          classTypeId: '',
          schoolId: '',
          classTypePrice: '' || '--',
          payPrice: '' || '--',
          confPayPrice: '' || '--',
          stayPayPrice: '' || '--',
          readStatus: '',
          discPrice: '',
          recruitStuRegSaleEntities: [],
          spreadStuRegSaleEntity: {},
          remark: '',
          // 缴费信息
          payPriceNow: '',
          paymentType: '',
          payTypeId: '',
          payTime: '',
          payRemark: '',
          // 优惠信息
          offPrice: '',
          ddingCode: '',
          benefitRemark: '',
        },
        // 优惠单号
        benefitNo: '',
        // 课程信息
        stuRegEntity: {},
        // 个人信息
        stuUserEntity: {},
        // 缴费信息
        stuRegPaymentEntity: {},
        // 优惠信息
        stuRegPaymentOffEntity: {},
        paymentNo: '',
        index: '',
        dataRule: {
          stuName: [
            { required: true, message: '学员姓名不能为空', trigger: 'blur' }
          ],
          stuPhone: [
            { required: true, message: '联系方式不能为空', trigger: 'blur' },
            { validator: validateStuPhone, trigger: 'blur' }
          ],
          stuUserAge: [
            { required: true, message: '年龄不能为空', trigger: 'blur' }
          ],
          educType: [
            { required: true, message: '学历不能为空', trigger: 'blur' }
          ],
          addr: [
            { required: true, message: '现住地不能为空', trigger: 'blur' }
          ],
          regAddr: [
            { required: true, message: '户籍不能为空', trigger: 'blur' }
          ],
          schoolId: [
            { required: true, message: '校区不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '销售老师不能为空', trigger: 'change' }
          ],
          classTypeId: [
            { required: true, message: '报读班型不能为空', trigger: 'blur' }
          ],
          channeId: [
            { required: true, message: '来源渠道不能为空', trigger: 'blur' }
          ],
          cardId: [
            { required: true, message: '身份证号不能为空', trigger: 'blur' },
            { validator: validateCardId, trigger: 'blur' }
          ],
          recruitStuRegSaleEntities: [
            { required: true, message: '招生老师不能为空', trigger: 'blur' }
          ],
          paymentType: [
            { required: true, message: '缴费类型不能为空', trigger: 'blur' }
          ],
          payTypeId: [
            { required: true, message: '缴费方式不能为空', trigger: 'blur' }
          ],
          payPriceNow: [
            { required: true, message: '本次缴费不能为空', trigger: 'blur' }
          ],
          payTime: [
            { required: true, message: '请选择缴费时间', trigger: 'blur' }
          ]
          
          // discPrice: [
          //   { validator: validateDispricePrice, trigger: 'change' }
          // ]
        }
      }
    },
    components: {
      teacherPop, 
      classType, 
      schoolSelect,
      zsTeacherPop,
      resourceSelect,
      payStyle,
      payType
    },
    computed: {
     menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      },
    },
    created () {
      this.getPaymentData()
      this.getBenefitData()
    },
    methods: {
      init () {
        this.edit = true
        this.noDesign = false
        this.outerSubVisible = true
        this.dataForm.recruitStuRegSaleEntities = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      getBenefitData () {
        putBenefitNo().then(res => {
          if(res.data && res.data.code === 0){
            this.benefitNo = res.data.data
          }else{
            this.$message.error(res.data.msg)   
          }
        }).catch(err => {
            console.log(err)
        })
      },
      getPaymentData () {
        getPaymentNo().then(res => {
        if(res.data && res.data.code === 0){
          this.paymentNo = res.data.data
          this.stuRegPaymentEntity.paymentNo = res.data.data
        }else{
          this.$message.error(res.data.msg) 
        }
        }).catch(err => {
          console.log(err)
        })
      },
      // 推广老师弹窗
      selectTgTeacherHandle () {
        this.teacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.teacherPop.init()
        })
      },
      callBackTgPop (userId, userName) {
        this.dataForm.spreadStuRegSaleEntity = {
          'userName': userName,
          'userId': userId
        }
      },
      // 选择班型弹窗
      selectClassTypeHandle () {
        this.classTypePopVisible = true
        this.$nextTick(() => {
          this.$refs.classType.init()
        })
      },
      callBackClassType (classTypeId, classTypeName, classTypePrice) {
        this.dataForm.classTypeId = classTypeId
        this.dataForm.classTypeName = classTypeName
         this.dataForm.classTypePrice = classTypePrice
        this.dataForm.payPrice = classTypePrice
        this.dataForm.stayPayPrice = this.dataForm.payPrice
        this.dataForm.confPayPrice = 0
      },
      // 表单提交
      dataFormSubmit () {
        // 个人信息部分
        this.stuUserEntity.cardId = this.dataForm.cardId
        this.stuUserEntity.stuName = this.dataForm.stuName
        this.stuUserEntity.stuPhone = this.dataForm.stuPhone
        this.stuUserEntity.stuSex = this.dataForm.stuSex
        this.stuUserEntity.stuUserAge = this.dataForm.stuUserAge
        this.stuUserEntity.educType = this.dataForm.educType
        this.stuUserEntity.addr = this.dataForm.addr
        this.stuUserEntity.regAddr = this.dataForm.regAddr
        this.stuUserEntity.contUserName = this.dataForm.contUserName
        this.stuUserEntity.contUserPhone = this.dataForm.contUserPhone
        // 报读班型部分
        this.stuRegEntity.classTypeId = this.dataForm.classTypeId
        this.stuRegEntity.schoolId = this.dataForm.schoolId
        this.stuRegEntity.classTypePrice = this.dataForm.classTypePrice
        this.stuRegEntity.payPrice = this.dataForm.payPrice
        this.stuRegEntity.confPayPrice = this.dataForm.confPayPrice
        this.stuRegEntity.discPrice = this.dataForm.discPrice
        this.stuRegEntity.stayPayPrice = this.dataForm.stayPayPrice
        this.stuRegEntity.readStatus = this.dataForm.readStatus
        // this.stuRegEntity.payStatus = this.dataForm.payStatus
        this.stuRegEntity.nickName = this.dataForm.nickName
        this.stuRegEntity.recruitStuRegSaleEntities = this.dataForm.recruitStuRegSaleEntities
        this.stuRegEntity.spreadStuRegSaleEntity = this.dataForm.spreadStuRegSaleEntity
        this.stuRegEntity.channeId = this.dataForm.channeId
        this.stuRegEntity.remark = this.dataForm.remark
        // this.stuRegEntity.updateClassTypeStatus = this.dataForm.updateClassTypeStatus
        // 缴费信息
        this.stuRegPaymentEntity.paymentNo =this.paymentNo
        this.stuRegPaymentEntity.payPrice =this.dataForm.payPriceNow
        this.stuRegPaymentEntity.paymentType =this.dataForm.paymentType
        this.stuRegPaymentEntity.payTypeId =this.dataForm.payTypeId
        this.stuRegPaymentEntity.payTime =this.dataForm.payTime
        this.stuRegPaymentEntity.remark = this.dataForm.payRemark
        // 优惠信息
        this.stuRegPaymentOffEntity.benefitNo = this.benefitNo
        this.stuRegPaymentOffEntity.offPrice = this.dataForm.offPrice
        this.stuRegPaymentOffEntity.ddingCode = this.dataForm.ddingCode
        this.stuRegPaymentOffEntity.remark = this.dataForm.benefitRemark
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            regSave({
              'stuRegEntity': this.stuRegEntity,
              'stuUserEntity': this.stuUserEntity,
              'stuRegPaymentEntity': this.stuRegPaymentEntity,
              'stuRegPaymentOffEntity': this.stuRegPaymentOffEntity,
            }).then(res => {
               if (res.data && res.data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.tabsCloseCurrentHandle()
                      this.$router.push({
                        name: 'stu-reg',
                      })
                    }
                  })
                } else {
                  this.$message.error(res.data.msg)
                }
            })
          }
        })
      },
      // 招生老师弹窗
      selectJobHandle () {
        this.zsTeacherPopVisible = true
        this.$nextTick(() => {
          this.$refs.zsTeacherPop.init()
        })
      },
      // 招生老师回调事件
      callBackZsPop (userId, userName) {
        if (this.dataForm.recruitStuRegSaleEntities === null) {
          this.dataForm.recruitStuRegSaleEntities = []
        }
        // 处理重复选择角色问题
        let i = 0
        for (; i < this.dataForm.recruitStuRegSaleEntities.length; i++) {
          if (this.dataForm.recruitStuRegSaleEntities[i].userId === userId) {
            return
          }
        }
        this.dataForm.recruitStuRegSaleEntities.push({'userName': userName, 'userId': userId})
      },
      handleJobClose (teacher) {
        if (teacher !== null && this.dataForm.recruitStuRegSaleEntities !== null && this.dataForm.recruitStuRegSaleEntities.length > 0) {
          let i = 0
          for (; i < this.dataForm.recruitStuRegSaleEntities.length; i++) {
            if (this.dataForm.recruitStuRegSaleEntities[i].userId === teacher.userId) {
              this.dataForm.recruitStuRegSaleEntities.splice(i, 1)
              break
            }
          }
        }
      },
      // 监听渠道ID
      getChannelVal (val) {
        if(val == 42 || val == 43){
          this.outerSubVisible = false
        }else{
          this.outerSubVisible = true
        }
      },
      removeTabHandle (tabName) {
        this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
        // console.log(this.mainTabs)
        if (this.mainTabs.length >= 1) {
          // 当前选中tab被删除
          if (tabName === this.mainTabsActiveName) {
            this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
              this.mainTabsActiveName = this.$route.name
            })
          }
        } else {
          this.menuActiveName = ''
          this.$router.push({ name: 'stu-reg' })
        }
      },
      tabsCloseCurrentHandle () {
        this.removeTabHandle(this.mainTabsActiveName)
      },
      // 取消操作
      cancle () {
        this.tabsCloseCurrentHandle()
        this.$router.push({
          name: 'stu-reg',
        })
      },
      // 操作优惠信息
      getBenefitValue () {
        if(this.dataForm.offPrice !== undefined){
          this.dataForm.payPrice = this.dataForm.classTypePrice - this.dataForm.offPrice
          this.dataForm.stayPayPrice = this.dataForm.payPrice
        }
      }
    }
  }
</script>
<style scoped>
  .reg-detail-row{
    padding:0 0 15px 0;
  }
 .span-content{
   padding:10px 0;
  }
  .table-head{
    text-align:center;
  }
  .tabel-input{
    margin-top:10px;
  }
</style>
