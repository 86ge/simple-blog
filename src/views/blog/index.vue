<template>
  <div class="blog-view columns" :style="{ width: windowWidth > 800 ? '1100px' : '95%' }">
    <div :style="{ width: windowWidth > 600 ? '700px' : 'auto' }">
      <div style="background-color: #fff" class="auto-line-feed blog-view">
        <div class="blog-title">{{ blogTitle }}</div>
        <md-editor :marked-heading-id="generateId" :editor-id="state.id" v-model="markdownToHtml" preview-only />
        <div class="comment-button-box">
          <el-link @click="showComment" class="comment-font" :icon="ChatSquare"
            >{{ commentList.length }} 条评论
          </el-link>
          <el-link class="comment-font">{{ updateTime }}</el-link>
        </div>
        <transition name="el-fade-in-linear">
          <div v-show="showCommentHandle" style="padding: 0 14px">
            <div class="comment-context">
              <post-comment comment-user-name="" @refreshComment="refreshComment"
                            :comment-blog-id="blogIdRef" watch-click=""></post-comment>
              <el-divider />
              <template v-for="item of commentList" :key="item.blogId">
                <comment
                  :parent-id="''"
                  @addComment="refreshComment"
                  :select-comment-id="selectComment"
                  v-if="item.commentCommentId == null"
                  :item="item"
                  :blog-id="blogIdRef"
                />
              </template>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <template v-if="windowWidth > 900">
      <el-affix :offset="90">
        <div style="height: auto; width: 300px">
          <el-card>
            <md-catalog :editor-id="state.id" @onClick="changeElement" :scroll-element="element" />
          </el-card>
        </div>
      </el-affix>
    </template>
  </div>
  <template v-if="windowWidth<=900">
    <transition name="el-fade-in-linear">
      <div v-show="showSidebar" style="float: right;margin-right: 18px">
        <el-affix  position="bottom" :offset="80" >
          <el-space direction="vertical" size="small">
            <el-popover :visible="showMobileHanding" placement="left" :width="200" trigger="click">
              <template #reference>
                <div @click="showMobileHanding = !showMobileHanding" class="sidebar-icon">
                  <el-icon :size="32">
                    <Memo />
                  </el-icon>
                </div>
              </template>
              <div style="max-height: 400px">
                <md-catalog :editor-id="state.id" @onClick="changeElement" :scroll-element="element" />
              </div>
            </el-popover>
            <div @click="" class="sidebar-icon">
              <el-icon :size="32">
                <Top />
              </el-icon>
            </div>
          </el-space>
        </el-affix>
      </div>
    </transition>
  </template>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getBlogById } from "@/api/blog"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
// @ts-ignore
import { ChatSquare } from "@element-plus/icons-vue"
import Comment from "@/components/Comment/commentCard.vue"
import { getCommentByBlogId } from "@/api/comment"
import PostComment from "@/components/Comment/postComment.vue";

const windowWidth = ref(document.body.clientWidth)
const route = useRoute()
const router = useRouter()
const blogTitle = ref("")
const markdownToHtml = ref("")
const updateTime = ref("")
const showCommentHandle = ref(false)
const commentList = ref([])
const blogIdRef = ref("")
const selectComment = ref("")
const element = ref(document.documentElement)
const showSidebar = ref(false)
const showMobileHanding = ref(false)

const showComment = () => {
  showCommentHandle.value = !showCommentHandle.value
}
//目录点击
const changeElement = (e: any, t: any) => {
  showMobileHanding.value = false
  router.push("/blog/" + route.params.blogId + "?heading=heading-" + t.index)
}
//载入时获取有无标题id
onMounted(() => {
  const catalogName: string = route.query.heading + ""
  if (catalogName.includes("heading-")) {
    nextTick(() => {
      setTimeout(() => {
        document.getElementById(catalogName)?.scrollIntoView({ block: "center", behavior: "smooth" })
        document.documentElement
          .getElementsByClassName("md-editor-catalog-active")
          .item(0)
          ?.setAttribute("class", "md-editor-catalog-link")
      }, 100)
    })
  }
})
window.onscroll = () => {
  handler(function () {
    showSidebar.value = document.documentElement.scrollTop > 300
  })
}
let timer: string | number | NodeJS.Timeout | null | undefined = null
function handler(value:Function) {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    value();
  }, 300)

}
const MdCatalog = MdEditor.MdCatalog
const state = reactive({
  id: "my-editor"
})
const generateId = (_text: any, _level: any, index: any) => `heading-${index}`
MdEditor.config({
  markedRenderer(renderer) {
    renderer.heading = (text, level, _r, _s, index) => {
      const id = generateId(text, level, index)
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    return renderer
  }
})
//监听标题id变化
watch(
  () => route.query.heading,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return
    }
    if (newVal?.includes("heading-")) {
      setTimeout(() => {
        document.getElementById(newVal + "")?.scrollIntoView({ block: "center", behavior: "smooth" })
      }, 0)
    }
  }
)
const getBlog = () => {
  blogIdRef.value = route.params.blogId + ""
  getBlogById({
    blogId: blogIdRef.value
  }).then((res) => {
    getCommentByBlogId({
      blogId: blogIdRef.value
    }).then((res) => {
      commentList.value = res.data
    })
    if (res.data == null) {
      router.push("/404")
    }
    const markdown = res.data.markdown
    updateTime.value = res.data.updateTime
    markdownToHtml.value = markdown
    blogTitle.value = res.data.title
  })
}
const refreshComment = () => {
  getCommentByBlogId({
    blogId: route.params.blogId + ""
  }).then((res) => {
    commentList.value = res.data
  })
}
//@ts-ignore
 const debounce = (fn, t) => {
  let delay = t || 500;
  let timer: string | number | NodeJS.Timeout | null | undefined;
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};
getBlog()
</script>

<style scoped lang="scss">
.blog-view {
  :deep(.md-editor-content) {
    padding: 10px;
  }

  margin: 0.7rem auto;
}

.columns {
  justify-content: space-between;
  display: flex;
  margin: 0 auto;
}

.blog-title {
  background-color: #fff;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.auto-line-feed {
  word-wrap: break-word;
  word-break: break-all;
}

.comment-button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  padding-top: 0 !important;
}

.comment-font {
  font-size: 18px;
}

.comment-card {
  :deep(.el-textarea__inner) {
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
}

.comment-context {
  overflow: hidden;
}

.sidebar-icon {
  border-radius: 10px;
  display: flex;
  height: 40px;
  width: 40px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-lighter);
  text-align: center;
  line-height: 40px;
  color: #1989fa;
  justify-content: center;
  align-items: center;
}
</style>
