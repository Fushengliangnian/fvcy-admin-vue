import request from '@/utils/request'

export function getSpiderProjects() {
  return request({
    url: '/spider/manager/project',
    method: 'get'
  })
}

const baseUri = '/spider'

const stepManagerUri = baseUri + '/manager/step'
const executorUri = baseUri + '/executor'

export function getSpiderProjectStepDetail(project_id) {
  return request({
    url: stepManagerUri,
    method: 'get',
    params: { project_id }
  })
}

export function postCreateSpiderProjectStep(form) {
  return request({
    url: stepManagerUri,
    method: 'post',
    data: {
      id: form.id,
      step_id: form.step_id,
      parent_id: form.parent_id,
      is_root: form.is_root,
      project_id: form.project_id,
      name: form.name,
      executor_id: form.executor_id,
      executor_params: form.executor_params,
      result_cache: form.result_cache,
      description: form.description,
      columns: form.columns
    }
  })
}

export function deleteSpiderProjectStep(data) {
  return request({
    url: stepManagerUri,
    method: 'delete',
    data
  })
}

export function getStepResultDetail(step_id) {
  return request({
    url: baseUri + '/step/result',
    method: 'post',
    data: { step_id: step_id }
  })
}

export function getExecutors() {
  return request({
    url: executorUri,
    method: 'get'
  })
}

export function getExecutorDetail(data) {
  return request({
    url: executorUri,
    method: 'post',
    data: {
      executor_id: data.executor_id
    }
  })
}

export function putUploadFile(data) {
  console.log('putUploadFile data.file')
  const formData = new FormData()
  formData.set('file', data.file)
  return request({
    url: baseUri + '/upload',
    method: 'put',
    data: formData,
    // headers: { 'Content-Type': 'multipart/form-data' }
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function postRunStep(stepId) {
  return request({
    url: baseUri + '/run/step',
    method: 'post',
    data: {
      step_id: stepId
    }
  })
}

export function postRunProject(projectId) {
  return request({
    url: baseUri + '/run/project',
    method: 'post',
    data: {
      project_id: projectId
    }
  })
}

