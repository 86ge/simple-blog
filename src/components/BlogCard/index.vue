<template>
  <el-card @click="gotoBlog" class="box-card">
    <el-row>
      <el-col :span="16">
        <div style="text-align: center; margin-bottom: 5px; font-size: 18px; font-weight: bolder" class="card-header">
          <span>{{ title }}</span>
        </div>
        <div style="min-height: 60px" class="auto-line-feed blog-per">{{ text }}</div>
      </el-col>
      <el-col :span="8">
        <el-image style="margin-left: 16px" :src="imgUrl" fit="cover" />
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: flex-start">
      <div>
        <template v-if="tags">
          <template v-for="item of tags.split(',')" :key="item">
            <el-tag style="margin-right: 15px" size="small">{{ tagsMap.get(parseInt(item)) }}</el-tag>
          </template>
        </template>
      </div>
      <el-tag type="info" size="small">{{ updateTime }}</el-tag>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const props = defineProps({
  blogId: String,
  title: String,
  text: String,
  tags: String,
  updateTime: String,
  imgUrl: String,
  tagsMap: Map<number, string>
})
const router = useRouter()
const gotoBlog = () => {
  router.push({ path: "/blog/" + props.blogId })
}
</script>

<style scoped lang="scss">
.box-card {
  width: 100%;
  overflow: hidden;
  margin: 0.7rem auto;
}
.auto-line-feed {
  word-wrap: break-word;
  word-break: break-all;
  max-height: 100px;
  overflow: hidden;
  display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素
  -webkit-line-clamp: 4;
}
.blog-per {
  margin-bottom: 12px;
}
</style>
