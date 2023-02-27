<template>
  <div class="tab-container">
    <el-button
      type="primary"
      size="medium"
      style="margin-top:15px;"
      @click="addTab(activeName)"
    >
      <span>新建步骤</span>
    </el-button>
    <el-button
      type="warning"
      size="medium"
      style="margin-top:15px;"
      @click="runStep(activeName)"
    >
      <span>运行当前步骤</span>
    </el-button>
    <el-button
      type="danger"
      size="medium"
      style="margin-top:15px;"
      @click="runProject"
    >
      <span>运行当前项目</span>
    </el-button>
    <span class="el-radio__label">当前状态: </span> <i class="el-icon-loading" style="color:green" />

    <span class="el-radio__label">上次运行时间:</span>
    <span class="el-radio__label">上次运行结果:</span> <i class="el-icon-success" style="color:green" />
    <el-empty v-if="steps.length === 0" description="暂无数据" style="margin-top: 80px;" />
    <el-tabs v-else v-model="activeName" style="margin-top:15px;" type="border-card" closable @tab-remove="removeTabConfirmBox">
      <el-tab-pane v-for="item in steps" :key="item.step_id" :label="item.name" :name="item.step_id" style="height: 50%" lazy>
        <el-radio-group v-model="defaultRadio" style="margin-top:0; padding-top: 0" size="small">
          <el-radio-button label="config"> <span>配置</span> </el-radio-button>
          <el-radio-button label="result"> <span>结果</span> </el-radio-button>
        </el-radio-group>
        <el-button
          v-if="defaultRadio==='result'"
          size="small"
          type="info"
          icon="el-icon-refresh"
          plain
          style="margin-left: 10px"
          @click="brushResult(activeName)"
        >
          刷新结果
        </el-button>

        <!--    配置页签    -->
        <create-step-form
          v-if="defaultRadio==='config'"
          :project-id="projectId"
          :rule-form="item"
          :status="item.status"
          :run-step="runStep"
          style="margin-top:15px;"
        />

        <!--    结果页签    -->
        <tab-pane
          v-if="defaultRadio==='result'"
          :ref="'resultTab'+item.step_id"
          :type="item.step_id"
          style="margin-top:15px;"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import CreateStepForm from './components/CreateStepForm'
import { getSpiderProjectStepDetail } from '@/api/spider'
import { deleteSpiderProjectStep } from '@/api/spider'
import { postRunStep } from '@/api/spider'
import { postRunProject } from '@/api/spider'
import { v4 as uuid } from 'uuid'

export default {
  name: 'BtxtBrush',
  components: { TabPane, CreateStepForm },
  data() {
    return {
      projectId: null,
      steps: [],
      activeName: null,
      result: {
        columns: [
          { key: 'username', name: '登录账号' },
          { key: 'password', name: '登录密码' }
        ],
        rows: [
          { username: 'lidong1', password: 'lidong2' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' },
          { username: 'lidong2', password: 'lidong1' }
        ]
      },
      defaultRadio: 'config',
      createStepName: '新建步骤',
      createStepIndex: 0
    }
  },
  watch: {
    activeName(val) {
      console.log('watch activeName val')
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    console.log('BtxtBrush created')
    const { dynamicId } = this.$route.params
    this.getSpiderStepList(dynamicId)
    this.getExecutors()
    console.log('end BtxtBrush created')
  },
  methods: {
    getSpiderStepList(dynamicId) {
      getSpiderProjectStepDetail(dynamicId).then(response => {
        this.steps = response.data.steps
        this.projectId = response.data.id

        if (this.steps.length === 0) {
          return
        }
        const stepMap = {}
        this.steps.forEach(step => {
          step.status = 'read'
          stepMap[step.step_id] = step
        })
        this.$store.dispatch('spider/setStepMap', stepMap)
        console.log('getSpiderProjectStepDetail this.steps')
        const tab = this.$route.query.tab
        if (tab && tab !== '0') {
          this.activeName = tab
        } else {
          console.log('this.activeName = this.steps[0].step_id')
          this.activeName = this.steps[0].step_id
        }
        console.log('this.activeName')
      })
    },

    getExecutors() {
      if (this.$store.state.spider.executors.length === 0) {
        this.$store.dispatch('spider/getExecutors')
      }
    },
    addTab(targetName) {
      console.log('addTab targetName')
      const newTabName = this.createStepName + ++this.createStepIndex
      const stepId = uuid()
      const parentId = this.steps.length === 0 ? null : this.steps[this.steps.length - 1].step_id
      this.steps.push({
        step_id: stepId,
        title: newTabName,
        name: newTabName,
        parent_id: parentId,
        status: 'edit'
      })
      this.activeName = stepId
    },
    removeTab(targetName) {
      const tabs = this.steps
      let activeName = this.activeName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.step_id
            }
          }
        })
      }
      deleteSpiderProjectStep({ project_id: this.projectId, step_id: activeName }).then(response => {
        this.activeName = activeName
        this.steps = tabs.filter(tab => tab.step_id !== targetName)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    removeTabConfirmBox(targetName) {
      this.$confirm('此操作将永久删除该步骤, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeTab(targetName)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    runStep(stepId) {
      postRunStep(stepId).then(response => {
        this.defaultRadio = 'result'
      })
    },
    runProject() {
      postRunProject(this.projectId).then(response => {

      })
    },
    brushResult(activeName) {
      console.log('brushResult')
      const tabKey = 'resultTab' + activeName
      this.$refs[tabKey][0].getList()
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
