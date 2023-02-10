<template>
  <el-affix>
    <div style="background-color: #fff; padding: 12px; width: 100%">
      <template v-if="windowWidth">
        <el-row>
          <el-col :span="6" />
          <el-col :span="12" justify="center">
            <el-tabs stretch v-model="activeName" class="demo-tabs hidden-xs-only tabhead" @tab-click="handleClick">
              <el-tab-pane label="文章" name="index" />
              <el-tab-pane v-if="isLogin" label="我的" name="mine" />
              <el-tab-pane label="归档" name="archive" />
              <el-tab-pane label="关于" name="about" />
            </el-tabs>
          </el-col>
          <el-col :span="6" justify="space-evenly" :class="windowWidth ? 'box' : ''">
            <Login-reg />
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row>
          <el-col :span="6">
            <p style="margin: 0; text-align: center; font-size: 6vw" class="hidden-sm-and-up">{{ $route.name }}</p>
          </el-col>
          <el-col :span="12" justify="center" >
              <AsyncComp />
          </el-col>
          <el-col :span="6" justify="space-evenly" :class="windowWidth ? 'box' : ''">
            <div style="display: flex; justify-content: space-evenly">
              <div style="display: inline-block"><Login-reg /></div>
              <el-icon @click="showMask" class="hidden-sm-and-up" :color="'#409EFF'" style="float: right" :size="'8vw'">
                <Grid />
              </el-icon>
            </div>
          </el-col>
        </el-row>
      </template>
    </div>
  </el-affix>

  <el-drawer v-model="handleMask" direction="ttb" :with-header="false" size="auto">
    <template v-for="item of menuMsg" :key="item.name">
      <div @click="$router.push(item.path), (handleMask = false)" class="markItem">
        <p style="font-size: 3vh">{{ item.name }}</p>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue"
import { RouteLocationNormalizedLoaded } from "vue-router"
import "element-plus/theme-chalk/display.css"
import LoginReg from "@/components/LoginComponent/index.vue"
import router from "@/router"
import { useUserStore } from "@/store/modules/user"

const activeName = ref("index")
const windowWidth = ref(document.body.clientWidth > 650)
const handleMask = ref(false)

const props = defineProps<{
  route: RouteLocationNormalizedLoaded
}>()
import { defineAsyncComponent } from 'vue'
let AsyncComp

watch(()=>useUserStore().test,(val:string)=>{
  AsyncComp = defineAsyncComponent(() => import(val))
  console.log(AsyncComp);
})

watch(
  () => props.route,
  (val) => {
    if (val.path === "/mine") {
      activeName.value = "mine"
    } else if (val.path === "/archive") {
      activeName.value = "archive"
    } else if (val.path === "/about") {
      activeName.value = "about"
    }
  }
)

const handleClick = (any: any) => {
  nextTick(() => {
    if (activeName.value == "mine") {
      router.push("/mine")
    } else if (activeName.value == "index") {
      router.push("/")
    } else if (activeName.value == "about") {
      router.push("/about")
    } else if (activeName.value == "archive") {
      router.push("/archive")
    }
  })
}
const showMask = () => {
  handleMask.value = true
}
const menuMsg = reactive([
  {
    name: "首页",
    path: "/index"
  },
  {
    name: "归档",
    path: "/archive"
  },
  {
    name: "关于",
    path: "/about"
  }
])
const isLogin = ref<boolean | undefined>()
watch(
  () => useUserStore().isLogin,
  (val) => {
    isLogin.value = val
    console.log(isLogin.value)
  }
)
</script>

<style scoped lang="scss">
.markItem {
  justify-content: center;
  display: flex;
  z-index: 150;
  width: 100%;
  text-align: center;
  height: 7vh;
  background-color: #fff;
  color: #409eff;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
