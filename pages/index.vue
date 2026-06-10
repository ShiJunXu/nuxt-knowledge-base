<script setup lang="ts">
import type { ArticlePayload, KnowledgeArticle, KnowledgeCategory } from '~/types/knowledge'

definePageMeta({
  middleware: 'auth-client'
})

const { currentUser, logout } = useAuth()

const emptyForm = (): ArticlePayload => ({
  category: 'english',
  title: '',
  summary: '',
  content: '',
  tags: [],
  readingMinutes: 5
})

const editingId = ref<number | null>(null)
const tagInput = ref('')
const form = reactive<ArticlePayload>(emptyForm())
const error = ref('')

const { data: categoriesData } = await useFetch<{ categories: KnowledgeCategory[] }>(
  '/api/categories'
)
const { data: articlesData, refresh: refreshArticles } = await useFetch<{
  articles: KnowledgeArticle[]
}>('/api/articles')

const categories = computed(() => categoriesData.value?.categories || [])
const articles = computed(() => articlesData.value?.articles || [])
const latestArticles = computed(() =>
  [...articles.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
)
const totalMinutes = computed(() =>
  articles.value.reduce((sum, article) => sum + article.readingMinutes, 0)
)

watch(
  categories,
  (items) => {
    if (items.length && !items.some((item) => item.slug === form.category)) {
      form.category = items[0].slug
    }
  },
  { immediate: true }
)

const resetForm = () => {
  Object.assign(form, emptyForm())
  form.category = categories.value[0]?.slug || 'english'
  tagInput.value = ''
  editingId.value = null
  error.value = ''
}

const editArticle = (article: KnowledgeArticle) => {
  editingId.value = article.id
  form.category = article.category
  form.title = article.title
  form.summary = article.summary
  form.content = article.content
  form.tags = [...article.tags]
  form.readingMinutes = article.readingMinutes
  tagInput.value = article.tags.join(', ')
  error.value = ''
}

const submitArticle = async () => {
  error.value = ''
  const payload = {
    ...form,
    tags: tagInput.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  try {
    if (editingId.value) {
      await $fetch(`/api/articles/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/articles', {
        method: 'POST',
        body: payload
      })
    }

    await refreshArticles()
    resetForm()
  } catch (err: any) {
    error.value = err?.statusMessage || err?.data?.statusMessage || '保存失败，请稍后再试'
  }
}

const deleteArticle = async (article: KnowledgeArticle) => {
  const confirmed = window.confirm(`确定删除「${article.title}」吗？`)
  if (!confirmed) return

  await $fetch(`/api/articles/${article.id}`, {
    method: 'DELETE'
  })
  await refreshArticles()
  if (editingId.value === article.id) resetForm()
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-top">
        <NuxtLink class="brand-lockup" to="/">
          <span class="brand-mark">K</span>
          <span>Knowledge Hub</span>
        </NuxtLink>
      </div>

      <nav aria-label="Knowledge categories">
        <div class="menu-label">菜单</div>
        <div class="menu">
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            class="menu-link"
            :to="`/category/${category.slug}`"
          >
            <span class="menu-icon">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-chip">
          <strong>{{ currentUser?.name }}</strong>
          <span>{{ currentUser?.email }}</span>
        </div>
        <button class="button secondary" type="button" @click="logout">退出登录</button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <h1>知识库工作台</h1>
          <p>新增、整理和复盘你的知识条目。</p>
        </div>
      </header>

      <section class="stats-grid" aria-label="Knowledge base stats">
        <div class="stat">
          <span>分类</span>
          <strong>{{ categories.length }}</strong>
        </div>
        <div class="stat">
          <span>笔记</span>
          <strong>{{ articles.length }}</strong>
        </div>
        <div class="stat">
          <span>预计阅读</span>
          <strong>{{ totalMinutes }}m</strong>
        </div>
        <div class="stat">
          <span>当前账号</span>
          <strong>{{ currentUser?.name || '-' }}</strong>
        </div>
      </section>

      <div class="content-grid">
        <section class="section">
          <div class="section-header">
            <h2>近期更新</h2>
            <span>{{ latestArticles.length }} 篇内容</span>
          </div>

          <div v-if="!latestArticles.length" class="empty-state">
            还没有笔记，先从右侧新增一条。
          </div>

          <div class="article-list">
            <article v-for="article in latestArticles" :key="article.id" class="article-card">
              <div class="article-meta">
                <span>{{ article.categoryName }}</span>
                <span>{{ article.updatedAt }}</span>
                <span>{{ article.readingMinutes }} 分钟</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="article-content" v-html="sanitizeHtml(article.content)" />
              <div class="tag-row">
                <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="action-row">
                <button class="button secondary compact" type="button" @click="editArticle(article)">
                  编辑
                </button>
                <button class="button danger compact" type="button" @click="deleteArticle(article)">
                  删除
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="panel">
          <h2>{{ editingId ? '编辑笔记' : '新增笔记' }}</h2>
          <form class="editor-form" @submit.prevent="submitArticle">
            <div v-if="error" class="alert">{{ error }}</div>

            <div class="field">
              <label for="category">分类</label>
              <select id="category" v-model="form.category" class="input">
                <option v-for="category in categories" :key="category.slug" :value="category.slug">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="title">标题</label>
              <input id="title" v-model="form.title" class="input" required />
            </div>

            <div class="field">
              <label for="summary">摘要</label>
              <textarea id="summary" v-model="form.summary" class="input textarea" required />
            </div>

            <div class="field">
              <label for="content">正文</label>
              <textarea
                id="content"
                v-model="form.content"
                class="input textarea large"
                placeholder="<p>可以粘贴 HTML 正文，例如列表、链接、代码块。</p>"
                required
              />
            </div>

            <div class="field">
              <label for="tags">标签</label>
              <input id="tags" v-model="tagInput" class="input" placeholder="用英文逗号分隔" />
            </div>

            <div class="field">
              <label for="minutes">阅读分钟</label>
              <input
                id="minutes"
                v-model.number="form.readingMinutes"
                class="input"
                type="number"
                min="1"
                max="120"
              />
            </div>

            <div class="action-row">
              <button class="button" type="submit">{{ editingId ? '保存修改' : '新增笔记' }}</button>
              <button class="button secondary" type="button" @click="resetForm">清空</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  </div>
</template>
