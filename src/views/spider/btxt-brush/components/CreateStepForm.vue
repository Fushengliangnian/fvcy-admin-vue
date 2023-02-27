<template>
  <div>
    <!--    配置页签的状态选择    -->
    <el-radio-group v-model="radioStatus" size="mini" style="margin-bottom: 15px;">
      <el-radio label="read"> <span>预览状态</span> </el-radio>
      <el-radio label="edit"> <span>编辑状态</span> </el-radio>
    </el-radio-group>
    <el-form ref="ruleForm" :model="customRuleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="步骤名称" prop="step_name">
        <el-input v-model="customRuleForm.name" :placeholder="rules.name[0].message" :disabled="!editStatus" />
      </el-form-item>

      <el-form-item label="步骤描述" prop="description">
        <el-input v-model="customRuleForm.description" type="textarea" :disabled="!editStatus" />
      </el-form-item>

      <el-form-item label="执行器" prop="executor_id">
        <el-select v-model="currExecutorId" placeholder="请选择步骤类型" :disabled="!editStatus">
          <el-option
            v-for="executor in executors"
            :key="executor.executor_id"
            :label="executor.name"
            :value="executor.executor_id"
            :disabled="customRuleForm.is_root && executor.executor_type === 'batch'"
          />
        </el-select>
      </el-form-item>

      <div v-if="currExecutor.need_params">
        <div class="divider">
          <el-divider content-position="left">
            <span v-if="currExecutor.executor_type !== 'batch'">执行器入参配置</span>
            <span v-else>执行器入参映射</span>
          </el-divider>
        </div>
        <div v-if="currExecutor.executor_type !== 'batch'">
          <el-form-item v-for="param in currExecutor.params" :key="param.key" :label="param.name" prop="paramValue">
            <el-upload
              v-if="param.type === 'file_upload'"
              class="upload-demo"
              drag
              action="#"
              multiple
              :disabled="!editStatus"
              :file-list="fileList"
              :http-request="fileUpload"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!--      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
            <el-select v-else-if="param.type === 'select'" v-model="param.value" placeholder="请选择" :disabled="!editStatus">
              <el-option v-for="option in param.options" :key="option.value" :label="option.label" :value="option.value" />
            </el-select>
            <el-input v-else v-model="param.value" placeholder="请输入" :disabled="!editStatus" />
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item v-for="param in currExecutor.params" :key="param.key" :label="param.name" prop="paramValue">
            <el-select v-model="param.value" placeholder="请选择" :disabled="!editStatus">
              <el-option v-for="option in parentStep.columns || []" :key="option.value" :label="option.key" :value="option.value">
                <span style="float: left">{{ option.key }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ option.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="divider">
          <el-divider />
        </div>
      </div>

      <el-form-item label="结果缓存" prop="resultCache">
        <el-switch v-model="customRuleForm.result_cache" :disabled="!editStatus" />
      </el-form-item>

      <div>
        <div class="divider">
          <el-divider content-position="left">
            <span>结果数据类型定义</span>
          </el-divider>
        </div>
        <el-form-item v-for="(columnSchema, index) in customRuleForm.columns" :key="index" label-width="0px" style="margin-bottom: 10px">
          <el-col :span="11">
            <el-form-item label="key" prop="schemaKey" label-width="70px">
              <el-input v-model="columnSchema.key" placeholder="key" :disabled="!editStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="value" prop="schemaValue" label-width="70px">
              <el-input v-model="columnSchema.value" placeholder="value" :disabled="!editStatus" />
            </el-form-item>
          </el-col>
          <el-col v-if="editStatus" :span="2">
            <el-button icon="el-icon-minus" type="danger" style="margin-left: 20px" plain circle @click="minusSchema(index)" />
          </el-col>
        </el-form-item>
        <el-button v-if="editStatus" icon="el-icon-plus" type="primary" style="margin-left: 30px; margin-bottom: 20px;" plain circle @click="plusSchema" />
      </div>

      <el-form-item v-if="editStatus" :label-width="'5px'">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="saveAndRun('ruleForm', stepId)">保存并运行当前步骤</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import NProgress from 'nprogress' // progress bar
import { postCreateSpiderProjectStep, putUploadFile } from '@/api/spider'

export default {
  name: 'CreateStepForm',
  props: {
    ruleForm: {
      type: Object,
      default() {
        return {
          name: '',
          step_id: '',
          executor_id: '',
          result_cache: true,
          description: '',
          columns: [
            { key: 'id', value: '序号' }
          ]
        }
      }
    },
    projectId: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'read'
    },
    runStep: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      defaultRuleForm: {
        name: '',
        executor_id: '',
        result_cache: true,
        description: '',
        columns: [
          {
            key: 'id',
            value: '序号'
          }
        ]
      },
      customRuleForm: null,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        step_type: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写具体描述', trigger: 'blur' }
        ]
      },
      stepId: null,
      radioStatus: this.status,
      currExecutorId: null,
      currExecutor: { params: [] },
      fileList: []
    }
  },
  computed: {
    editStatus() {
      return this.radioStatus === 'edit'
    },
    executors() {
      return this.$store.state.spider.executors
    },
    parentStep() {
      return this.$store.state.spider.stepMap[this.ruleForm.parent_id] || { columns: [] }
    }
  },
  watch: {
    currExecutorId(val) {
      console.log('----- watch currExecutor ---- ')
      this.currExecutor = this.getCurrExecutor(val)
      return this.currExecutor
    }
  },
  created() {
    this.customRuleForm = Object.assign({}, this.defaultRuleForm, this.ruleForm)
    this.currExecutorId = this.customRuleForm.executor_id
    this.currExecutor = this.getCurrExecutor(this.currExecutorId)
    console.log('this.currExecutor.need_params')
    if (this.currExecutor.need_params) {
      this.currExecutor.params.forEach(param => {
        const value = this.customRuleForm.executor_params[param.key]
        if (param.type === 'file_upload') {
          this.fileList.push({ name: value })
        }
        param.value = value
      })
    }
    if (this.customRuleForm.id) {
      this.stepId = this.customRuleForm.id
    }
  },
  methods: {
    submitForm(formName) {
      NProgress.start()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submitForm fileList')
          this.customRuleForm.project_id = this.projectId
          this.customRuleForm.id = this.stepId
          this.customRuleForm.step_type = this.stepId
          this.customRuleForm.executor_id = this.currExecutorId
          this.customRuleForm.is_root = !this.customRuleForm.parent_id
          if (this.currExecutor.need_params) {
            const executorParams = {}
            this.currExecutor.params.forEach(param => {
              executorParams[param.key] = param.type !== 'file_upload' ? param.value : this.fileList[0].name
            })
            this.customRuleForm.executor_params = executorParams
          }
          console.log('submitForm customRuleForm')
          console.log(this.customRuleForm)
          postCreateSpiderProjectStep(this.customRuleForm).then(response => {
            this.radioStatus = 'read'
            this.stepId = response.data.id
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })

          this.$store.dispatch('spider/addStep', this.customRuleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
      NProgress.done()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    minusSchema(columnSchemaIndex) {
      console.log('minusSchema columnSchemaIndex')
      this.customRuleForm.columns.splice(columnSchemaIndex, 1)
    },
    plusSchema() {
      this.customRuleForm.columns.push({ key: '', value: '' })
    },
    fileUpload(options) {
      console.log('fileUpload options')
      putUploadFile(options).then(response => {
        this.fileList.push({ name: options.file.name })
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      })
    },
    getCurrExecutor(executorId) {
      const executors = this.$store.state.spider.executors.filter(executor => executor.executor_id === executorId)
      console.log('----- getCurrExecutor currExecutor ---- ')
      return executors.length <= 0 ? this.currExecutor : executors[0]
    },
    saveAndRun(formName, stepId) {
      this.submitForm(formName)
      this.runStep(stepId)
    }
  }
}
</script>

<style scoped>
  .divider {
    padding-right: 20px;
    padding-left: 20px;
  }
  .divider span {
    font-size: 12px;
    color: #97a8be;
  }
</style>
