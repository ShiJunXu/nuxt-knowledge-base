<script setup lang="ts">
import type { KnowledgeArticle, KnowledgeCategory } from '~/types/knowledge'

definePageMeta({
  middleware: 'auth-client'
})

const route = useRoute()
const { currentUser, logout } = useAuth()
const slug = computed(() => String(route.params.slug))

const { data: categoriesData } = await useFetch<{ categories: KnowledgeCategory[] }>(
  '/api/categories'
)
const { data: articlesData } = await useFetch<{ articles: KnowledgeArticle[] }>('/api/articles', {
  query: { category: slug },
  watch: [slug]
})

const categories = computed(() => categoriesData.value?.categories || [])
const category = computed(() => categories.value.find((item) => item.slug === slug.value))
const articles = computed(() => articlesData.value?.articles || [])

const tools = computed(() => [
  {
    title: '资料收集',
    text: category.value ? `把${category.value.name}相关链接、文件和灵感统一归档。` : ''
  },
  {
    title: '结构整理',
    text: category.value ? `按${category.value.name}主题拆分知识点、模板和行动清单。` : ''
  },
  {
    title: '复盘更新',
    text: category.value ? `定期回看${category.value.name}内容，标注下一步优化。` : ''
  }
])
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
            v-for="item in categories"
            :key="item.slug"
            class="menu-link"
            :to="`/category/${item.slug}`"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
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

    <main v-if="category" class="main">
      <section class="category-hero">
        <h1>{{ category.name }}</h1>
        <p>{{ category.summary }}{{ category.goal }}</p>
      </section>

      <section class="section">
        <div class="section-header">
          <h2>知识笔记</h2>
          <span>{{ articles.length }} 篇</span>
        </div>

        <div v-if="!articles.length" class="empty-state">
          当前分类还没有笔记，可以回到工作台新增。
        </div>

        <div class="article-list">
          <article v-for="article in articles" :key="article.id" class="article-card">
            <div class="article-meta">
              <span>{{ article.updatedAt }}</span>
              <span>{{ article.readingMinutes }} 分钟</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-content">{{ article.content }}</div>
            <div class="tag-row">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2>工作流</h2>
          <span>围绕这个分类持续沉淀</span>
        </div>
        <div class="tool-grid">
          <article v-for="tool in tools" :key="tool.title" class="tool">
            <strong>{{ tool.title }}</strong>
            <span>{{ tool.text }}</span>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
