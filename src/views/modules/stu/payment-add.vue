<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3%">
        <el-form :model="dataForm" :inline="true" :rules="dataRule" ref="dataForm">
          <!-- 学员个人信息 -->
          <div class="reg-detail-row">
              <h1>学员个人信息</h1>
              <el-row :gutter="24">
                <el-col :span="4">
                  <div class="span-content">
                    学员姓名:{{stuInfo.stuName}}
                  </div>
                </el-col>

                  <el-col :span="4"> 
                    <div class="span-content">
                      报读课程:{{stuInfo.classTypeName}}
                    </div>
                  </el-col>

                  <el-col :span="4">
                    <div class="span-content">
                      课程价格:{{stuInfo.classTypePrice}}
                    </div>  
                  </el-col>

                    <el-col :span="4">
                      <div class="span-content">
                        <div>
                          招生老师:
                          <span v-for="teacher in stuInfo.recruitStuRegSaleEntities" :key="teacher.userName">
                          {{ teacher.userName }}
                          </span>
                        </div>    
                      </div>  
                  </el-col>

                  <el-col :span="4">
                      <div class="span-content">
                        <div>
                          电邀老师:
                          <!-- <span>{{stuInfo.spreadStuRegSaleEntity.userName}}</span> -->
                          <span>{{dyTeacher}}</span>
                        </div>
                      </div>
                  </el-col>

                  <el-col :span="4">
                      <div class="span-content">
                          订单金额:{{stuInfo.payPrice || 0}}
                      </div>
                  </el-col>
                  <el-col :span="4">
                      <div class="span-content">
                          优惠金额:{{stuInfo.discPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="4">
                      <div class="span-content">
                        已缴金额:{{stuInfo.confPayPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="4">
                      <div class="span-content">
                        需缴金额:{{stuInfo.stayPayPrice || 0}}
                      </div>
                  </el-col>
                </el-row>

          </div>
          <!-- 缴费记录 -->
          <div class="reg-detail-row">
              <h1>缴费记录</h1>
              <el-row :gutter="24" v-for="item in dataList" :key="item.paymentId" :value="item.paymentId">
                <el-col :span="4" >
                  <div class="span-content">
                    缴费单号:{{item.paymentNo}}
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="span-content">
                  缴费金额：{{item.payPrice}}
                  </div> 
                </el-col>
                <el-col :span="4"> 
                  <div class="span-content">
                  缴费时间: {{item.payTime}}
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="span-content">
                  缴费类型：
                    <span v-if="item.paymentType === 1">定金</span>
                    <span v-if="item.paymentType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="4">
                  <div class="span-content">
                  缴费方式：{{item.payTypeName}}
                  </div>  
                </el-col>
                <el-col :span="3">
                  <div class="span-content">
                  备注：{{item.remark}}
                  </div>  
                </el-col>
              </el-row>
          </div>
          <!-- 本次缴费 -->
          <div class="reg-detail-row">
              <h1>本次缴费</h1>
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
                    <el-form-item prop="thisPayPrice" class="tabel-input">
                      <el-input-number v-model="dataForm.thisPayPrice" :min="0" class="box-input" :max="10000" controls-position="right"></el-input-number>
                    </el-form-item> 
                  </el-col>

                  <el-col :span="4">
                      <el-form-item prop="payType" class="tabel-input">
                          <!-- <el-select v-model="dataForm.payType" placeholder="缴费类型">
                              <el-option v-for="item in payType" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                          </el-select> -->
                          <payType v-model="dataForm.payType" :clearable="noSelectType"></payType>
                      </el-form-item> 
                  </el-col>

                  <el-col :span="4">
                    <el-form-item prop="payStyle" class="tabel-input">
                      <payStyle v-model="dataForm.payStyle" :clearable="noSelectPayStyle"></payStyle>
                    </el-form-item>
                  </el-col>

                  <el-col :span="4">
                      <el-form-item prop="payTime" class="tabel-input">
                          <el-date-picker style="width:85%" v-model="dataForm.payTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期时间"> </el-date-picker>
                      </el-form-item> 
                  </el-col>

                  <el-col :span="4">
                      <el-form-item prop="remark" class="tabel-input">
                          <el-input type="textarea" v-model="dataForm.remark" class="box-remark" ></el-input>
                      </el-form-item> 
                  </el-col>
              </el-row>
              
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="isAuth('stu:reg:payment:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- 弹窗部分 -->
  <regPop ref="regPop" v-if="regPopVisible" @regPop-pop-event="callBackRegPop"></regPop>
  
</div>
</template>
<style>
  /* .box-remark {
    width:250%;s
  } */
</style>
<script>

  import regPop from '@/views/common-pop/reg-pop'
  import payStyle from '@/views/common-select/payStyle-select'
  import payType from '@/views/common-select/payType-select'
  import { getPaymentNo, paymentInfo, addPayment } from '@/api/payment'

  export default {
    data () {
      return {
        visible: false,
        regPopVisible: false,
        dataForm: {
          thisPayPrice: '',
          remark: '',
          payStyle: '',
          payType: '',
          payTime: '',
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectPayStyle: true,
        noSelectType: true,
        // 缴费单id
        selectPaymentId: '',
        // 报名表id
        selectRegId: '',
        // 新缴费的paymentId
        paymentNo: '',
        //电邀老师
        dyTeacher: '',
        dataRule: {
          thisPayPrice: [
            { required: true, message: '本次缴费不能为空', trigger: 'blur' }
          ]  
        }
      }
    },
    components:{
      regPop, payStyle, payType
    },
    methods: {
      init (data) {
        // 获取regId
        this.selectRegId = data.regId
        // 获取paymentId
        this.selectPaymentId = data.paymentId
        this.visible = true
        this.selectRowData = []
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        // })
        this.putPaymentNo()
        this.getPaymentData()
      },
      putPaymentNo () {
        getPaymentNo().then(res => {
          if(res.data && res.data.code === 0){
            this.paymentNo = res.data.data
          }else{
            this.$message.error(res.data.msg) 
          }
        }).catch(err => {
            console.log(err)
        })
      },
      // 获取缴费单信息
      getPaymentData () {
        paymentInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            var tempDate = res.data.data.stuRegPaymentEntities
            for(var i in tempDate){
              tempDate[i].payTime = tempDate[i].payTime.substring(0,10)
            }
            this.dataList = tempDate
            this.stuInfo = res.data.data.stuRegCallVo
            this.dyTeacher = res.data.data.stuRegCallVo.spreadStuRegSaleEntity.userName
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 新增交费
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addPayment({
              'regId': this.selectRegId,
              'paymentNo': this.paymentNo,
              'paymentId': this.selectPaymentId,
              'payPrice': this.dataForm.thisPayPrice,
              'paymentType': this.dataForm.payType,
              'payTypeId': this.dataForm.payStyle,
              'payTime': this.dataForm.payTime,
              'remark': this.dataForm.remark
            }).then(res => {
              if (res.data && res.data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
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

