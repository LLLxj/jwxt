<template>
<div>
  <div>
    <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="80%" top="15vh">
      <div style="padding:0 3%">
        
          <!-- 学员个人信息 -->
          <div class="reg-detail-row">
              <h1>学员个人信息</h1>
              <el-row :gutter="24">
                <el-col :span="5">
                  <div class="span-content">
                    学员姓名:{{stuInfo.stuName}}
                  </div>
                </el-col>

                  <el-col :span="5"> 
                    <div class="span-content">
                      报读课程:{{stuInfo.classTypeName}}
                    </div>
                  </el-col>

                  <el-col :span="5">
                    <div class="span-content">
                      课程价格:{{stuInfo.classTypePrice}}
                    </div>  
                  </el-col>

                    <el-col :span="5">
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

                  <el-col :span="5">
                      <div class="span-content">
                          订单金额:{{stuInfo.payPrice || 0}}
                      </div>
                  </el-col>
                  <el-col :span="5">
                      <div class="span-content">
                          优惠金额:{{stuInfo.discPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="5">
                      <div class="span-content">
                        已缴金额:{{stuInfo.confPayPrice || 0}}
                      </div>
                  </el-col>

                  <el-col :span="5">
                      <div class="span-content">
                        需缴金额:{{stuInfo.stayPayPrice || 0}}
                      </div>
                  </el-col>
                </el-row>

          </div>
          <!-- 优惠记录 -->
          <div class="reg-detail-row">
              <h1>优惠记录</h1>
              <el-row :gutter="24" v-for="item in dataList" :key="item.paymentId" :value="item.paymentId">
                <el-col :span="5" >
                  <div class="span-content">
                    优惠单号:{{item.offNo}}
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  优惠金额：{{item.offPrice}}
                  </div> 
                </el-col>
                <el-col :span="5"> 
                  <div class="span-content">
                  钉钉单号: {{item.ddingCode}}
                  </div>
                </el-col>
                <!-- <el-col :span="5">
                  <div class="span-content">
                  缴费类型：
                    <span v-if="item.paymentType === 1">定金</span>
                    <span v-if="item.paymentType === 2">学费</span>
                  </div>  
                </el-col>
                <el-col :span="5">
                  <div class="span-content">
                  缴费方式：{{item.payTypeName}}
                  </div>  
                </el-col>-->
                <el-col :span="5">
                  <div class="span-content">
                  备注：{{item.remark}}
                  </div>  
                </el-col> 
              </el-row>
          </div>
          <!-- 本次缴费 -->
          <div class="reg-detail-row">
              <h1>申请优惠</h1>
              <el-row :gutter="24" style="background:#FAFBFD;height:50px;line-height:50px;">
                  <el-col :span="5">
                    <span>优惠单号:</span>
                  </el-col>
                  <el-col :span="5">
                      <span>本次优惠金额</span>
                  </el-col>
                  <el-col :span="5">
                      <span>钉钉单号</span>
                  </el-col>
                  <el-col :span="5">
                      <span>备注</span>
                  </el-col>

                  <el-col :span="5">
                      <span>{{offNo}}</span>
                  </el-col>
                <el-form :model="dataForm" :inline="true" ref="dataForm" :rules="dataRule">
                  <el-col :span="5">
                    <el-form-item prop="offPrice" class="tabel-input">
                      <el-input-number v-model="dataForm.offPrice" :min="0" class="box-input" :max="10000" controls-position="right"></el-input-number>
                    </el-form-item> 
                  </el-col>

                  <el-col :span="5">
                      <el-form-item prop="ddingCode" class="tabel-input">
                        <el-input v-model="dataForm.ddingCode" class="box-input"  placeholder="钉钉单号"></el-input>
                      </el-form-item> 
                  </el-col>

                  <el-col :span="5">
                      <el-form-item prop="remark" class="tabel-input">
                          <el-input type="textarea" v-model="dataForm.remark" class="box-remark" ></el-input>
                      </el-form-item> 
                  </el-col>
                </el-form>
              </el-row>
              
          </div>
        
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="isAuth('stu:reg:off:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
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
  import { getBenefitInfo, benefitSave, putBenefitNo } from '@/api/benefit'

  export default {
    data () {
      return {
        visible: false,
        regPopVisible: false,
        dataForm: {
          offPrice: '',
          ddingCode: '',
          remark: '',
        },
        dataList: [],
        // 个人信息
        stuInfo: [],
        firstPayOrNot: false,
        selectRowData:[],
        noSelectPayStyle: true,
        noSelectType: true,
        // 报名表id
        selectRegId: '',
        // offNo
        offNo: '',
        //电邀老师
        dyTeacher: '',
        dataRule: {
          offPrice: [
            { required: true, message: '优惠金额不能为空', trigger: 'change' }
          ],
          ddingCode: [
            { required: true, message: '钉钉单号不能为空', trigger: 'change' }
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
        this.visible = true
        this.selectRowData = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.putOffNo()
        this.getBenefitData()
      },
      putOffNo () {
        putBenefitNo().then(res => {
          if(res.data && res.data.code === 0){
            this.offNo = res.data.data
          }else{
            this.$message.error(res.data.msg)   
          }
        }).catch(err => {
            console.log(err)
        })
      },
      // 获取缴费单信息
      getBenefitData () {
        getBenefitInfo(this.selectRegId).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data.stuRegPaymentOffEntities
            this.stuInfo = res.data.data.stuRegCallVo
            this.dyTeacher = res.data.data.stuRegCallVo.spreadStuRegSaleEntity.userName
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 新增优惠
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            benefitSave({
             stuRegPaymentOffEntity: {
                'regId': this.selectRegId,
                'offNo': this.offNo,
                'offPrice': this.dataForm.offPrice,
                'ddingCode': this.dataForm.ddingCode,
                'remark': this.dataForm.remark
             }
              
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

