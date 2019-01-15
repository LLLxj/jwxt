<template>
  <el-dialog
    :title="!this.selectId ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="400px"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="科目名称" prop="courseName">
        <el-input v-model="dataForm.courseName" maxlength="20"  placeholder="请输入科目名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { courseList, courseInfo, courseSave, courseUpdate } from '@/api/course'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          courseName: '',
          courseId: ''
        },
        selectId: '',
        dataRule: {
          courseName: [
            {required: true, message: '科目名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.selectId) {
          courseInfo(this.selectId).then(res => {
            this.dataForm.courseName = res.data.data.courseName
            this.dataForm.courseId = res.data.data.courseId
          }).catch(err => {
            console.log(err)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectId) {
              courseUpdate(this.dataForm).then(res => {
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
              })
            } else {
              courseSave(this.dataForm).then(res => {
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
              })
            }
          }
        })
      }
    }
  }
</script>
