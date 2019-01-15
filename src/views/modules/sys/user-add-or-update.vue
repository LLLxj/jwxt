<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="jobList">
        <el-tag
          v-for="job in dataForm.jobList"
          :key="job.jobId"
          @close="handleJobClose(job)"
          closable>
          {{job.jobName}}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="selectJobHandle">+ 职位</el-button>
      </el-form-item>
      <!-- <el-form-item label="校区" prop="schoolName">
        <el-input v-model="dataForm.schoolName" placeholder="点击选择校区" readonly @click.native="selectSchoolHandle()" prefix-icon="el-icon-search"></el-input>
      </el-form-item> -->
      <el-form-item label="校区" prop="schoolId">
        <school-select v-model="dataForm.schoolId"/>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 修改密码 -->
    <school-pop v-if="schoolPopVisible" ref="schoolPop" @school-pop-event="callBackSchoolPop"></school-pop>
    <job-pop v-if="jobPopVisible" ref="jobPop" @job-pop-event="callBackJobPop"></job-pop>
  </el-dialog>
</template>

<script>
  import jobPop from '../../common-pop/job-pop'
  // import schoolPop from '../../common-pop/school-pop'
  import { isEmail, isMobile } from '@/utils/validate'
  import schoolSelect from '@/views/common-select/school-select'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }

      return {
        visible: false,
        roleList: [],
        schoolPopVisible: false,
        jobPopVisible: false,
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          schoolName: '',
          schoolId: '',
          jobList: [],
          roleIdList: [],
          status: 1
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          jobList: [
            { required: true, message: '职位不能为空', trigger: 'blur' }
          ],
          schoolName: [
            { required: true, message: '校区不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      // schoolPop,
      jobPop,
      schoolSelect
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.mobile = data.user.mobile
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.schoolName = data.user.schoolName
                this.dataForm.schoolId = data.user.schoolId
                this.dataForm.jobList = data.user.jobList
                this.dataForm.status = data.user.status
              }
            })
          }
        })
      },
      // 校区弹窗
      // selectSchoolHandle () {
      //   this.schoolPopVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.schoolPop.init()
      //   })
      // },
      // // 校区弹窗回调事件
      // callBackSchoolPop (schoolId, schoolName, schoolCode) {
      //   this.dataForm.schoolName = schoolName
      //   this.dataForm.schoolId = schoolId
      // },
      // 职位弹窗
      selectJobHandle () {
        this.jobPopVisible = true
        this.$nextTick(() => {
          this.$refs.jobPop.init()
        })
      },
      // 职位弹窗回调事件
      callBackJobPop (jobId, jobName) {
        if (this.dataForm.jobList === null) {
          this.dataForm.jobList = []
        }
        // 处理重复选择角色问题
        let i = 0
        for (; i < this.dataForm.jobList.length; i++) {
          if (this.dataForm.jobList[i].jobId === jobId) {
            return
          }
        }
        this.dataForm.jobList.push({'jobName': jobName, 'jobId': jobId})
      },
      handleJobClose (job) {
        if (job !== null && this.dataForm.jobList !== null && this.dataForm.jobList.length > 0) {
          let i = 0
          for (; i < this.dataForm.jobList.length; i++) {
            if (this.dataForm.jobList[i].jobId === job.jobId) {
              this.dataForm.jobList.splice(i, 1)
              break
            }
          }
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'schoolId': this.dataForm.schoolId,
                'jobList': this.dataForm.jobList,
                'roleIdList': this.dataForm.roleIdList
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
