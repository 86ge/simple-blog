<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import NavBar from "@/components/navbar/index.vue"
import { useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
const { initTheme } = useTheme()

const router = useRouter()

const r = ref()
router.beforeEach((to: any, from: any, next: () => void) => {
  r.value =to
  next()
})
onBeforeMount(() => {
  const userStore = useUserStore()
  userStore.checkLogin().then((res) => {
    console.log("是否登录" + res)
    console.log("hello world")
  });
})

/** 初始化主题 */
initTheme()
/** 将 Element-Plus 的语言设置为中文 */
const locale = zhCn
</script>

<template>
  <ElConfigProvider :locale="locale">
    <nav-bar :route="r" />
    <router-view />
  </ElConfigProvider>
</template>
