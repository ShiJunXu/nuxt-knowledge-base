<script setup lang="ts">
definePageMeta({
  middleware: 'auth-client'
})

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''

  if (password.value.length < 6) {
    error.value = '密码至少需要 6 位'
    return
  }

  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    await navigateTo('/')
  } catch (err: any) {
    error.value = err?.statusMessage || err?.data?.statusMessage || '注册失败，请稍后再试'
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="auth-visual">
      <NuxtLink class="brand-lockup" to="/register">
        <span class="brand-mark">K</span>
        <span>Knowledge Hub</span>
      </NuxtLink>
      <div class="auth-copy">
        <h1>从今天开始建立自己的知识资产库。</h1>
        <p>创建账号后，你可以进入完整工作台，按分类浏览笔记、工具模板和近期更新。</p>
      </div>
    </section>

    <section class="auth-card">
      <form class="auth-form" @submit.prevent="submit">
        <h2>注册</h2>
        <p>账号会保存到 Cloudflare D1 数据库。</p>

        <div v-if="error" class="alert">{{ error }}</div>

        <div class="field">
          <label for="name">昵称</label>
          <input id="name" v-model="name" class="input" type="text" required autocomplete="name" />
        </div>

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
            autocomplete="new-password"
          />
        </div>

        <button class="button full" type="submit">创建账号</button>

        <p class="form-footer">
          已经有账号？
          <NuxtLink to="/login">去登录</NuxtLink>
        </p>
      </form>
    </section>
  </main>
</template>
