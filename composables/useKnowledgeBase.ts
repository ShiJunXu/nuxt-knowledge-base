import type { KnowledgeArticle, KnowledgeCategory } from '~/types/knowledge'

const categories: KnowledgeCategory[] = [
  {
    slug: 'english',
    name: '英语',
    icon: 'EN',
    summary: '沉淀词汇、口语表达、阅读精讲和写作模板。',
    goal: '建立可复习、可输出、可迁移的英语学习体系。'
  },
  {
    slug: 'frontend',
    name: '前端',
    icon: 'FE',
    summary: '整理 Nuxt、Vue、工程化、性能优化和组件设计资料。',
    goal: '把项目经验沉淀成可复用的技术资产。'
  },
  {
    slug: 'wechat',
    name: '公众号',
    icon: 'WX',
    summary: '管理选题、标题、文章结构、金句素材和发布复盘。',
    goal: '形成稳定的内容生产流水线。'
  },
  {
    slug: 'redbook',
    name: '小红书',
    icon: 'XR',
    summary: '收集爆款笔记结构、封面文案、评论洞察和账号定位。',
    goal: '用数据和模板提高内容命中率。'
  },
  {
    slug: 'certificates',
    name: '证书',
    icon: 'CE',
    summary: '跟踪考试计划、知识点清单、真题错题和证书材料。',
    goal: '让备考进度、资料和复盘一处可见。'
  }
]

const articles: KnowledgeArticle[] = [
  {
    id: 1,
    category: 'english',
    title: '高频表达：工作沟通中的 30 个自然说法',
    summary: '按会议、邮件、反馈、推进四类整理常用表达，并给出可直接替换的中文场景。',
    tags: ['口语', '商务英语', '表达库'],
    updatedAt: '2026-06-08',
    readingMinutes: 8
  },
  {
    id: 2,
    category: 'frontend',
    title: 'Nuxt 项目结构与页面路由速查',
    summary: '梳理页面、组件、组合式函数、路由中间件和服务端接口的常用放置方式。',
    tags: ['Nuxt', 'Vue', '工程化'],
    updatedAt: '2026-06-09',
    readingMinutes: 10
  },
  {
    id: 3,
    category: 'wechat',
    title: '公众号长文结构模板',
    summary: '从开场钩子、观点展开、案例证明到结尾行动，拆出一套可复用的大纲。',
    tags: ['选题', '写作', '发布'],
    updatedAt: '2026-06-05',
    readingMinutes: 6
  },
  {
    id: 4,
    category: 'redbook',
    title: '小红书封面文案检查表',
    summary: '围绕人群、收益、反差、场景和视觉层级，快速判断一张封面是否值得发布。',
    tags: ['封面', '爆款', '运营'],
    updatedAt: '2026-06-07',
    readingMinutes: 5
  },
  {
    id: 5,
    category: 'certificates',
    title: '证书备考资料归档法',
    summary: '把考试大纲、知识点、错题、模考和报名材料拆成五个固定资料夹。',
    tags: ['备考', '复盘', '资料管理'],
    updatedAt: '2026-06-06',
    readingMinutes: 7
  }
]

export const useKnowledgeBase = () => {
  const getCategory = (slug: string) => categories.find((category) => category.slug === slug)
  const getArticlesByCategory = (slug: string) =>
    articles.filter((article) => article.category === slug)

  return {
    articles,
    categories,
    getArticlesByCategory,
    getCategory
  }
}
