<template>
  <el-dialog
    :title="!this.selectClassTypeId ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="班型名称" prop="classTypeName">
        <el-input v-model="dataForm.classTypeName" maxlength="20"  placeholder="请输入班型名称"></el-input>
      </el-form-item>
      <el-form-item label="班型价格" prop="classTypePrice">
        <el-input v-model="dataForm.classTypePrice"  placeholder="请输入班型价格"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { classTypeInfo, classTypeSave, classTypeUpdate } from '@/api/classType'
  import { parseTime } from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataForm: {
          classTypeName: '',
          classTypeId: '',
          classTypePrice: ''
        },
        selectClassTypeId: '',
        dataRule: {
          classTypeName: [
            {required: true, message: '科目名称不能为空', trigger: 'blur'}
          ],
          classTypePrice: [
            {required: true, message: '价格不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.selectClassTypeId = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.selectClassTypeId) {
          classTypeInfo(this.selectClassTypeId).then(res => {
            if (res.data && res.data.code === 0) {
              this.dataForm = res.data.data
            } else {
              this.$message.error(this.data.msg)
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.selectClassTypeId) {
              classTypeUpdate(this.dataForm).then(res => {
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
              classTypeSave(this.dataForm).then(res => {
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
