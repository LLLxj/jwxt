<template>
  <el-row :gutter="24" class="panel-group">
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col"> -->
    <el-col :span="4" class="card-panel-col"> 
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">报名数量</div>
          <count-to :start-val="0" :end-val="regCount" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">定金数量</div>
          <count-to :start-val="0" :end-val="earnestCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">回款数量</div>
          <count-to :start-val="0" :end-val="paymentPriceCount " :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">定金额</div>
          <count-to :start-val="0" :end-val="payPrice" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">退费额</div>
          <count-to :start-val="0" :end-val="offPrice" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <icon-svg name="zhedie" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未缴完报名表</div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script>
  import { infoDay, infoWeek, infoMonth } from '@/api/teacherLog'
  import CountTo from 'vue-count-to'

  export default {
    components: {
      CountTo
    },
    props: {
      value: {   // 1.日报 2.周报 3.月报 // 接受外部v-model传入的值
        type: [Number, String],
        default: 1
      }
    },
    data () {
      return {
        loading: false,
        // 报名数量
        regCount: 0,
        // 定金数量
        earnestCount: 0,
        // 回款数量
        paymentPriceCount: 0,
        // 成交
        payTotalNum: 0,
        payTotal: 0.00,
        // 回款
        payment: 0,
        // 退费
        offPrice: 0,
        // 定金
        payPrice: 0,
        // 未缴完报名表 笔
        unFinRegNum: 0
      }
    },
    watch: {
      value (newV, oldV) {
        if (newV !== oldV) {
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
        this.loading = true
        switch (this.value) {
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
        infoDay().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 加载数据 周
      loadInfoWeek () {
        infoWeek().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 加载数据 月
      loadInfoMonth () {
        infoMonth().then(res => {
          this.successFun(res)
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },
      // 成功回调事件
      successFun (res) {
        if (res.data && res.data.code === 0) {
          this.regCount = res.data.data.regCount || 0
          this.earnestCount = res.data.data.earnestCount || 0
          this.paymentPriceCount = res.data.data.paymentPriceCount || 0
          this.payTotalNum = res.data.data.payTotalNum || 0
          this.payTotal = res.data.data.payTotal || 0.00
          this.payment = res.data.data.payment || 0
          this.offPrice = res.data.data.offPrice || 0
          this.unFinRegNum = res.data.data.unFinRegNum || 0
          this.payPrice = res.data.data.payPrice || 0
        } else {
          console.log(res)
          alert(res.data.msg)
        }
        this.loading = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel{
        box-shadow:2px 2px 9px #333333
      }
      
      // .card-panel-icon-wrapper {
      //   color: #fff;
      // }
      // .icon-people {
      //    background: #40c9c6;
      // }
      // .icon-message {
      //   background: #36a3f7;
      // }
      // .icon-money {
      //   background: #f4516c;
      // }
      // .icon-shoppingCard {
      //   background: #34bfa3
      // }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>