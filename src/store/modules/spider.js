import { getSpiderProjects } from '@/api/spider'
import { getExecutors } from '@/api/spider'
import spiderRouter from '@/router/modules/spider'

const state = {
  projects: [],
  executors: [],
  stepMap: {}
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  SET_EXECUTORS(state, executors) {
    state.executors = executors
  },
  SET_STEP_MAP(state, stepMap) {
    state.stepMap = stepMap
  },
  ADD_STEP_MAP(state, step) {
    state.stepMap[step.step_id] = step
  },
  CLEAR_STEP_MAP(state) {
    state.stepMap = {}
  }
}

const actions = {
  getSpiderProjects({ commit, dispatch }, children) {
    return new Promise((resolve, reject) => {
      getSpiderProjects().then(response => {
        const { data } = response
        console.log('actions...getSpiderProjects')
        console.log(data)
        commit('SET_PROJECTS', data)
        const children = []
        data.forEach(item => {
          const view = {
            dynamicId: item.project_id,
            path: item.project_id,
            name: item.project_id,
            meta: { title: item.name }
          }
          children.push(view)
        })
        console.log('commit(\'permission/addModuleChildRoutes\', { moduleName: spiderRouter.name, routes: children }, { root: true })')
        dispatch('permission/addModuleChildRoutes', { moduleName: spiderRouter.name, routes: children }, { root: true })
        // dispatch('permission/addModuleChildRoutes', spiderRouter.name, children, { root: true })
        resolve(children)
      }).catch(error => {
        commit('SET_PROJECTS', children)
        reject(error)
      })
    })
  },

  getExecutors({ commit }) {
    new Promise((resolve, reject) => {
      getExecutors().then(response => {
        const { data } = response
        console.log('actions...getExecutors')
        commit('SET_EXECUTORS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setStepMap({ commit }, stepMap) {
    commit('CLEAR_STEP_MAP')
    commit('SET_STEP_MAP', stepMap)
  },
  addStep({ commit }, step) {
    commit('ADD_STEP_MAP', step)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
