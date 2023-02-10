<template>
  <div class="comment-card" style="flex-direction: column">
    <!--评论展示-->
    <div style="width: 100%">
      <div style="font-size: 12px;display: flex; align-items: center;color: #606266">
        <el-avatar size="small" shape="square" :src="item.avatar" style="margin-right: 10px" />
        <template v-if="!commentUser">
          {{ item.account }}
        </template>
        <template v-else>
          {{ splitUser(commentUser)[0] }}
          <el-icon>
            <CaretRight />
          </el-icon>
          {{ splitUser(commentUser)[1] }}
        </template>
      </div>
      <div>
        <div v-if="item.isDelete != 1" style="font-size: 14px;margin-top: 4px; margin-left: 32px">{{ item.context }}</div>
        <div v-else style="font-size: 14px;margin-top: 4px; margin-left: 32px">
          <el-tag class="ml-2" type="info">该评论已删除</el-tag>
        </div>
      </div>

      <div class="comment-button-box" style="padding: 0; width: 100%; margin: 4px 0 0 !important; color: #606266">
        <span style="font-size: 10px;margin-left: 32px; color: rgb(153, 153, 153)">{{ item.updateTime }}</span>
        <el-link :disabled="item.isDelete === 1" v-if="1 > 0" @click="showComment" class="comment-font"
          :icon="ChatSquare">{{ item.children ? item.children.length : 0 }}
          条评论
        </el-link>
        <el-link :disabled="item.isDelete === 1" v-else @click="showComment" class="comment-font"
          :icon="ChatSquare">评论</el-link>
      </div>
    </div>

    <!--  评论模块  -->
    <div style="width: 100%">
      <post-comment @close-view="showCommentHandle = !showCommentHandle" :watch-click="watchClick"
        :comment-user-name="item.parentUserName" @refreshComment="addCommentParent" v-show="showCommentHandle"
        :comment-blog-id="blogId" :comment-comment-id="props.item.id" />
    </div>
    <!--  子评论  -->
    <div style="padding-left: 14px; width: 100%; margin: 0 auto">
      <template v-for="item of props.item.children" :key="item.commentId">
        <comment-card :select-comment-id="selectComment" @addComment="refreshComment" :parent-id="parentId" :item="item"
          :blog-id="blogId" :comment-user="
            item.parentUserName && item.commentId != item.commentCommentId
             ? item.account + '->' + item.parentUserName
             : item.account
          " />
      </template>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from "vue"
import CommentCard from "@/components/Comment/commentCard.vue"
import { ChatSquare } from "@element-plus/icons-vue"
import PostComment from "@/components/Comment/postComment.vue"
import {useUserStore} from "@/store/modules/user";

const props = defineProps<{
  item: any
  blogId: string | number
  parentId: string | number
  parentNode?: Array<any>
  selectCommentId?: string | number | undefined
  isDelete?: string | number | undefined
  commentUser?: string
}>()
const emit = defineEmits(["addCommentParent", "addComment"])
const showCommentHandle = ref(false)
const selectComment = ref("")
const watchClick = ref("a")

useUserStore().test = '@/components/screenfull/index.vue'

const addCommentParent = () => {
  emit("addComment")
}

const showComment = () => {
  watchClick.value = Math.random() + ""
  showCommentHandle.value = !showCommentHandle.value
}

const refreshComment = () => {
  emit("addComment")
}

const splitUser = (commentUser: string) => {
  return commentUser.split("->")
}
</script>

<style scoped lang="scss">
.comment-button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  padding-top: 0 !important;
}

.comment-font {
  font-size: 15px;
}

.comment-card {
  :deep(.el-textarea__inner) {
    min-height: 50px !important;
    resize: none;
    line-height: normal;
    overflow-y: hidden;
  }
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 auto;
  background-color: #fff;
  padding: 10px 0;
}

.comment-context {
  overflow: hidden;
}
</style>
