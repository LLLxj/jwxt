<template>
  <el-card style="height: 700px">
    <div slot="header" class="clearfix">
      <span>校区</span>
    </div>
    <el-tree :data="dataList" :props="defaultProps"
             v-loading="dataListLoading"
             @node-click="handleNodeClick" @current-change="currentChange"
             default-expand-all
    ></el-tree>
  </el-card>
</template>

<style>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>

<script>
  export default {
    data () {
      return {
        dataListLoading: false,
        dataList: null,
        defaultProps: {
          children: 'children',
          label: 'schoolName'
        }
      }
    },
    components: {
    },
    computed: {
    },
    watch: {
    },
    created () {
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        // 加载图标
        this.dataListLoading = true
        // 数据
        this.dataList = null
        this.$http({
          url: this.$http.adornUrl('/cos/school/treeList'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = []
            let topObj = this.getTopObj()
            this.dataList.push(topObj)
            topObj.children = data.data
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      getTopObj () {
        return {'schoolId': 0, 'schoolName': '全部', 'schoolCode': 'ALL', 'children': []}
      },
      handleNodeClick (data) {
        this.$emit('school-sidebar-node-click-event', data.schoolId, data.schoolName, data.schoolCode)
      },
      currentChange (nodeData, nodeObj) {
        this.$emit('school-sidebar-node-change-event', nodeData.schoolId, nodeData.schoolName, nodeData.schoolCode)
      }
    }
  }
</script>
