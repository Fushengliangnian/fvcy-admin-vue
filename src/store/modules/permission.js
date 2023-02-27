import { constantRoutes } from '@/router'
import path from 'path'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  pathRouteMap: {}
}

function generateRouteMap(parentPath, routes) {
  const pathRouteMap = {}
  routes.forEach(route => {
    const fullPath = path.resolve(parentPath, route.path)
    route.path = fullPath
    pathRouteMap[fullPath] = route
    if (route.children) {
      const childrenMap = generateRouteMap(fullPath, route.children)
      Object.assign(pathRouteMap, childrenMap)
    }
  })
  return pathRouteMap
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.pathRouteMap = generateRouteMap('/', state.routes)
  },
  ADD_MODULE_CHILD_ROUTES: (state, { moduleName, routes }) => {
    state.addRoutes.forEach(router => {
      if (router.name === moduleName) {
        router.children = router.children.concat(routes)
      }
    })
    console.log('state.addRoutes')
    state.routes.forEach(router => {
      if (router.name === moduleName) {
        router.children = router.children.concat(routes)
      }
    })
    console.log('state.routes')
    state.pathRouteMap = generateRouteMap('/', state.routes)
    console.log('state.pathRouteMap')
  }
}

// const actions = {
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (roles.includes('admin')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }

const actions = {
  generateRoutes({ commit }, roles) {
    commit('SET_ROUTES', [])
  },
  addModuleChildRoutes({ commit }, payload) {
    commit('ADD_MODULE_CHILD_ROUTES', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
