<script setup lang="ts">
definePageMeta({
  middleware: 'auth-client'
})

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''

  try {
    login(email.value, password.value)
    await navigateTo('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败，请稍后再试'
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-visual">
      <NuxtLink class="brand-lockup" to="/login">
        <span class="brand-mark">K</span>
        <span>Knowledge Hub</span>
      </NuxtLink>
      <div class="auth-copy">
        <h1>把学习、创作和证书资料放进一个清晰系统。</h1>
        <p>登录后进入你的知识库工作台，按英语、前端、公众号、小红书、证书五个方向管理内容。</p>
      </div>
    </section>

    <section class="auth-card">
      <form class="auth-form" @submit.prevent="submit">
        <h2>登录</h2>
        <p>继续整理你的学习笔记和内容资产。</p>

        <div v-if="error" class="alert">{{ error }}</div>

        <div class="field">
          <label for="email">邮箱</label>
          <input id="email" v-model="email" class="input" type="email" required autocomplete="email" />
        </div>

        <div class="field">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            class="input"
            type="password"
            required
            autocomplete="current-password"
          />
        </div>

        <button class="button full" type="submit">进入知识库</button>

        <p class="form-footer">
          还没有账号？
          <NuxtLink to="/register">立即注册</NuxtLink>
        </p>
      </form>
    </section>
  </main>
</template>
