<template>
  <div class="mod-home">
    <h3>报名表统计</h3>
    <el-table
      :data="stuRegData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="schoolName"
        label="校区名称"/>
      <el-table-column
        prop="createDate"
        label="日期"
        :formatter="formateCreateDate"/>
      <el-table-column
        prop="allCount"
        label="总数"/>
      <el-table-column
        prop="count1"
        label="作废数"/>
      <el-table-column
        prop="count2"
        label="待审数"/>
      <el-table-column
        prop="count3"
        label="通过数"/>
    </el-table>

    <h3>课次统计</h3>
    <el-table
      :data="cplanContData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="schoolName"
        label="校区名称"/>
      <el-table-column
        prop="cplanOpenDate"
        label="日期"
        :formatter="formateCplanOpenDate"/>
      <el-table-column
        prop="allCount"
        label="总数"/>
    </el-table>
  </div>
</template>
<!--
<template>
  <div class="mod-home">
    <h3>项目介绍</h3>
    <ul>
      <li>renren-fast-vue基于vue、element-ui构建开发，实现<a href="https://gitee.com/renrenio/renren-fast" target="_blank">renren-fast</a>后台管理前端功能，提供一套更优的前端解决方案</li>
      <li>前后端分离，通过token进行数据交互，可独立部署</li>
      <li>主题定制，通过scss变量统一一站式定制</li>
      <li>动态菜单，通过菜单管理统一管理访问路由</li>
      <li>数据切换，通过mock配置对接口数据／mock模拟数据进行切换</li>
      <li>发布时，可动态配置CDN静态资源／切换新旧版本</li>
      <li>演示地址：<a href="http://fast.demo.renren.io" target="_blank">fast.demo.renren.io</a> (账号密码：admin/admin)</li>
    </ul>
    <h3>获取帮助</h3>
    <ul>
      <li>官方社区：<a href="//renren.io" target="_blank">renren.io</a></li>
      <li>前端Git地址：<a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">github.com/daxiongYang/renren-fast-vue</a></li>
      <li>后台Git地址：<a href="//git.oschina.net/renrenio/renren-fast" target="_blank">git.oschina.net/renrenio/renren-fast</a></li>
      <li>代码生成器：<a href="//git.oschina.net/renrenio/renren-generator" target="_blank">git.oschina.net/renrenio/renren-generator</a></li>
      <li>如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持</li>
    </ul>
    <h3>官方QQ群</h3>
    <ul>
      <li>高级群：324780204(大牛云集，跟大牛学习新技能)</li>
      <li>普通群：145799952(学习交流，互相解答各种疑问)</li>
    </ul>
  </div>
</template>
-->

<script>
  import { cplanContCount, stuRegCount } from '@/api/homeApi'
  export default {
    data () {
      return {
        cplanContData: [],
        cplanContDataListLoading: false,
        stuRegData: [],
        cplanStuRegListLoading: false
      }
    },
    activated () {
      // 加载课次统计
      this.getCplanContCountList()
      // 加载报名表统计
      this.getStuRegCountList()
    },
    methods: {
      getCplanContCountList: function () {
        this.cplanContDataListLoading = true
        cplanContCount().then(res => {
          if (res.data && res.data.code === 0) {
            this.cplanContData = res.data.data
          } else {
            this.cplanContData = []
          }
          this.cplanContDataListLoading = false
        })
      },
      getStuRegCountList: function () {
        this.cplanStuRegListLoading = true
        stuRegCount().then(res => {
          if (res.data && res.data.code === 0) {
            this.stuRegData = res.data.data
          } else {
            this.stuRegData = []
          }
          this.cplanStuRegListLoading = false
        })
      },
      formateCreateDate: function (row, column) {
        return row.createDate != null ? row.createDate.substring(0, 10) : ''
      },
      formateCplanOpenDate: function (row, column) {
        return row.cplanOpenDate != null ? row.cplanOpenDate.substring(0, 10) : ''
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

