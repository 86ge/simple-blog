<template>
  <div >
    <div class="comment-card" :style="{width:  windowWidth > 700? '100%': '95%'}">
      <el-input @blur="closeView" ref="editTask" autofocus="autofocus" type="textarea" style="width: 80%"  autosize show-word-limit maxlength="200" placeholder="请输入评论内容" v-model="commentContent"></el-input>
      <el-button v-if="isLogin" @mousedown.stop.prevent="comment" plain>评论</el-button>
      <el-button v-else plain disabled>请先登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, ref, watch} from "vue";
import {addComment} from "@/api/comment";
import {ElMessage} from "element-plus";
const editTask = ref()
const props = defineProps<{
  commentBlogId: string|number,
  commentCommentId?: string|number,
  commentUserName:string|number
  watchClick:string|number
}>()
const showView = ref(true)
const windowWidth = ref(document.body.clientWidth)
const isLogin =ref(false)
const accountRef = ref('')
const commentContent = ref('')
const checkLogin = () => {
  const userInfo = window.localStorage.getItem("userInfo")
  if (userInfo){
    isLogin.value = true
    accountRef.value = JSON.parse(userInfo).account
  }
}
const emit = defineEmits(['refreshComment','closeView'])
const comment = () => {
if (commentContent.value.trim() == ''){
    ElMessage.error('评论内容不能为空')
    return
  }
  addComment({
    context: commentContent.value,
    commentBlogId: props.commentBlogId,
    commentCommentId: props.commentCommentId
  }).then(() => {
    ElMessage.success("评论成功")
    emit('refreshComment')
  })

}
watch(() => props.watchClick, () => {
  editTask.value.focus()
})
const closeView = () => {
  emit('closeView')
}
const changeShow = () => {
  showView.value = false
}

checkLogin()
</script>

<style scoped lang="scss">
.comment-card{
  :deep( .el-textarea__inner) {
    min-height: 50px !important;
    resize: none;
    line-height: normal;
    overflow-y: hidden;
  }
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  background-color: #fff;
  padding: 10px;
}

</style>
