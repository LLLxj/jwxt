<template>
  <div class="mod-user">
    <!-- 布局容器 -->
    <el-container>
      <!--<el-header>
        校区成交统计信息
      </el-header>-->
      <el-main>
        <!--按钮组-->
        <el-card>
          <el-row :gutter="24">
            <el-col :span="3">
              <el-radio-group v-model="val" size="mini">
                <el-radio-button label="1">日</el-radio-button>
                <el-radio-button label="2">周</el-radio-button>
                <el-radio-button label="3">月</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="chooseTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
              </el-date-picker> 
            </el-col>
          </el-row> 
    
        </el-card>

        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top:15px;">
          <el-table-column type="index" label="NO" align="center" header-align="center" width="80">
          </el-table-column>
          <el-table-column prop="userName" header-align="center" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="schoolName" header-align="center" align="center" label="校区">
          </el-table-column>
          <el-table-column prop="regCount" header-align="center" align="center" label="报名数量">
          </el-table-column>
          <el-table-column prop="payPriceTotal" header-align="center" align="center" label="实缴金额">
          </el-table-column>
          <el-table-column prop="earnestCount" header-align="center" align="center" label="定金数量">
          </el-table-column>
          <el-table-column prop="earnestTotal" header-align="center" align="center" label="累计定金金额">
          </el-table-column>
          <el-table-column prop="paymentPriceCount" header-align="center" align="center" label="回款数量">
          </el-table-column>
          <el-table-column prop="paymentPriceTotal" header-align="center" align="center" label="累计回款金额">
          </el-table-column>
          <el-table-column prop="offCount" header-align="center" align="center" label="退费数量">
          </el-table-column>
          <el-table-column prop="offPriceTotal" header-align="center" align="center" label="累计退费金额">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>

</template>

<script>

  import { zsTeacherDayInfo, zsTeacherWeekInfo, zsTeacherMonthInfo } from '@/api/regSchoolLog'
  import { parseTime } from '@/utils'
  
  export default {
    data () {
      return {
        val: 1,
        chooseTime: '',
        dataList: [],
        dataListLoading: false,
        noChangeDate: false
      }
    },
    watch: {
      val (newV, oldV) {
        if (newV !== oldV) {
          if(newV == 1 && oldV == 2 || newV == 1 && oldV == 3) {
            this.noChangeDate = true
          }
          this.initData()
        }
      },
      chooseTime (newV , oldV) {
        if (newV !== oldV) {
          this.noChangeDate = true
          this.chooseTime = newV 
          this.initData() 
        }
      }
    },
    activated () {
      this.initData()
    },
    methods: {
       init () {
        this.initData()
      },
      initData () {
        this.val = parseInt(this.val)
        switch (this.val) {
          case 1:
            this.loadInfoDay()
            break
          case 2:
            this.loadInfoWeek()
            break
          case 3:
            this.loadInfoMonth()
            break
          default:
            this.loadInfoDay()
            break
        }
      },
      // 加载数据 日
      loadInfoDay () {
        if(this.noChangeDate == false){
          this.chooseTime = new Date()
          this.chooseTime = parseTime(this.chooseTime).substring(0,10)
        }
        this.dataListLoading = true
        zsTeacherDayInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
        }).catch(err => {
          console.log(err)
        })
        this.dataListLoading = false
      },
       // 加载数据 周
      loadInfoWeek () {
        this.dataListLoading = true
        zsTeacherWeekInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
        }).catch(err => {
          console.log(err)
        })
        this.dataListLoading = false
      },
      loadInfoMonth () {
        this.dataListLoading = true
        zsTeacherMonthInfo(this.chooseTime).then(res => {
          if(res.data && res.data.code === 0){
            this.dataList = res.data.data
          }
        }).catch(err => {
          console.log(err)
        })
        this.dataListLoading = false
      }
     
    }
  }
</script>

<style lang="scss">
  .box-card {
    width: 100%;
  }
  .mod-demo-echarts {
    width: 100%;
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
