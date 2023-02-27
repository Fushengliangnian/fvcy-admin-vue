import Layout from '@/layout'

const spiderRouter = {
  path: '/spider',
  component: Layout,
  redirect: '/spider/btxt-brush',
  name: 'Spider',
  meta: { title: '爬虫项目管理', icon: 'spider' },
  pullChildren: true,
  pullChildrenFunction: 'spider/getSpiderProjects',
  children: [
    {
      path: ':dynamicId',
      name: 'BtxtBrush',
      component: () => import('@/views/spider/btxt-brush/index'),
      meta: {}
    }
  ]
}

export default spiderRouter
