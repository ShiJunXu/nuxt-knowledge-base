<script setup lang="ts">
definePageMeta({
  middleware: 'auth-client'
})

const { articles, categories } = useKnowledgeBase()
const { currentUser, logout } = useAuth()

const latestArticles = [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
const totalMinutes = articles.reduce((sum, article) => sum + article.readingMinutes, 0)
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
          <p>按主题收纳资料、复盘经验和下一步行动。</p>
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
          <span>本周更新</span>
          <strong>5</strong>
        </div>
      </section>

      <div class="content-grid">
        <section class="section">
          <div class="section-header">
            <h2>近期更新</h2>
            <span>{{ latestArticles.length }} 篇内容</span>
          </div>

          <div class="article-list">
            <article v-for="article in latestArticles" :key="article.id" class="article-card">
              <div class="article-meta">
                <span>{{ article.updatedAt }}</span>
                <span>{{ article.readingMinutes }} 分钟</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="tag-row">
                <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </article>
          </div>
        </section>

        <aside class="panel">
          <h2>快捷入口</h2>
          <ul class="quick-list">
            <li v-for="category in categories" :key="category.slug">
              <NuxtLink :to="`/category/${category.slug}`">
                <strong>{{ category.name }}</strong>
                <span>：{{ category.goal }}</span>
              </NuxtLink>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>
