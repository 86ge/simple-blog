<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import zhCn from "element-plus/lib/locale/lang/zh-cn"

const { initTheme } = useTheme()

let router = useRouter();

let r = ref()
router.beforeEach((to, from, next) => {
  r.value =to
  next()
})
onBeforeMount(() => {
  let userStore = useUserStore();
  userStore.checkLogin().then((res) => {
    console.log('是否登录'+res);
    console.log('hello world');
  });
})

/** 初始化主题 */
initTheme()
/** 将 Element-Plus 的语言设置为中文 */
const locale = zhCn
import NavBar from "@/components/navbar/index.vue"
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/store/modules/user";
</script>

<template>
  <ElConfigProvider :locale="locale">
    <nav-bar :route="r" />
    <router-view />
  </ElConfigProvider>
</template>
