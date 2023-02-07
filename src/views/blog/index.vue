<template>
<div class="blog-view" :style="{width:  windowWidth > 700? '600px': '95%'}" >
  <div style="">
    <div class="blog-title">{{ blogTitle }}</div>
  </div>
  <div  class="auto-line-feed blog-view">
    <md-editor v-model="markdownToHtml" preview-only />
    <div class="comment-button-box">
      <el-link @click="showComment" class="comment-font" :icon="ChatSquare">{{ commentList.length }} 条评论</el-link>
      <el-link class="comment-font">{{updateTime}}</el-link>
    </div>
    <div v-show="showCommentHandle" style="padding: 14px">
      <div class="comment-context">
        <post-comment comment-user-name="" @refreshComment="refreshComment" :comment-blog-id="bolgIdRef"></post-comment>
        <el-divider />
        <template v-for="item of commentList">
          <comment @addComment="refreshComment"
                   :select-comment-id="selectComment"
                   v-if="item.commentCommentId==null"
                   :item="item"
                   :blog-id="bolgIdRef"></comment>
        </template>
      </div>
    </div>
  </div>
</div>

</template>


<script setup lang="ts">
import { ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {getBlogById} from "@/api/blog";
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {ChatSquare} from '@element-plus/icons-vue'
import Comment from "@/components/Comment/commentCard.vue";
import {getCommentByBlogId} from "@/api/comment";
import PostComment from "@/components/Comment/postComment.vue";

const  windowWidth = ref(document.body.clientWidth)
const route = useRoute();
const router = useRouter();
const blogTitle = ref('')
const value = ref('**Hello,World**')
const markdownToHtml = ref("")
const updateTime = ref("")
const showCommentHandle = ref(false)
const commentList = ref([])
const bolgIdRef =ref('')
const selectComment=ref('')

const showComment = () => {
  showCommentHandle.value= !showCommentHandle.value
}

const getBlog = () => {
  bolgIdRef.value = route.params.blogId
  const blogId:string = route.params.blogId;
  getBlogById({
    blogId:blogId
  }).then(res => {
    getCommentByBlogId({
      blogId:blogId
    }).then(res => {
      commentList.value = res.data
    })
    if (res.data == null) {
      router.push("/404")
    }
    const markdown = res.data.markdown;
    updateTime.value = res.data.updateTime;
    markdownToHtml.value=markdown
    blogTitle.value = res.data.title;
  })
}
const refreshComment = () => {
  getCommentByBlogId({
    blogId:route.params.blogId
  }).then(res => {
    commentList.value = res.data
  })
}

getBlog()
</script>

<style scoped lang="scss">
.blog-view{
  background-color: #fff;
  :deep(.md-editor-content){
    padding: 10px;
  }
  margin: 0.7rem auto;
}
.blog-title{
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.auto-line-feed{
   word-wrap:break-word;
   word-break:break-all;
 }
.comment-button-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 0 !important;
}
.comment-font{
  font-size: 18px
}
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
  margin: 0.7rem auto;
  background-color: #fff;
  padding: 10px;
}
.comment-context{
  border: rgba(183, 183, 183, 0.68) 1px solid;
  overflow: hidden;
}
</style>
