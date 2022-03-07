

type AppMenu =  {
  title: string,
  url: string,
  type: string
}


const navbarMenu: AppMenu[] = [
  {
      title: '首页',
      url: '/',
      type: 'base'
  },
  {
    title: '标签',
    url: '/tag',
    type: 'base'
}
,
{
    title: '归档',
    url: '/archive',
    type: 'base'
},{
    title: '文档',
    url: '/docs',
    type: 'base'
},{
    title: '友链',
    url: '/friends',
    type: 'base'
},{
    title: '关于',
    url: '/about',
    type: 'base'
},
{
    title: '简历',
    url: '/jianli',
    type: 'base'
}
]


export {navbarMenu}