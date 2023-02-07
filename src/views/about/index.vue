<template>
  <div class="columns about-view" :style="{width:  windowWidth > 800? '800px': '95%'}" >
    <md-editor  v-model="markdownToHtml" preview-only />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {getAboutMe} from "@/api/user";

const markdownToHtml = ref("")
const windowWidth = ref(document.body.clientWidth)
onMounted(() => {
  getAboutMe().then(res => {
    markdownToHtml.value = res.data
  })
})

</script>

<style scoped lang="scss">
.columns{
  justify-content: space-between;
  display: flex;
  margin: 0 auto;
}
.about-view{
  background-color: #fff;
  :deep(.md-editor-content){
    padding: 10px;
  }
  margin: 0.7rem auto;
}
</style>
