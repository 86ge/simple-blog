<template>
  <div v-if="!isLogin" style="text-align: center; padding: 4px; overflow: hidden">
    <template v-if="!phoneView">
      <el-button type="primary" @click.stop="handleClick('login')">登录</el-button>
      <el-button type="danger" @click.stop="handleClick('register')">注册</el-button>
    </template>
    <template v-else>
      <el-dropdown trigger="click">
        <el-avatar :size="docWidth > 500 ? '64px' : 'small'" shape="square" :icon="UserFilled" />
        <template #dropdown>
          <el-dropdown-menu class="dropdown-menu">
            <el-dropdown-item @click.stop="handleClick('login')">登录</el-dropdown-item>
            <el-dropdown-item @click.stop="handleClick('register')">注册</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
  <div v-else style="text-align: center; padding: 4px; overflow: hidden">
    <el-dropdown trigger="click">
      <el-avatar :size="!phoneView ? 'default' : 'small'" shape="square" :src="avatar" />
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu">
          <el-dropdown-item @click="$router.push('/mine')">我的评论</el-dropdown-item>
          <el-dropdown-item @click="showUpdateInfo">我的信息</el-dropdown-item>
          <el-dropdown-item divided @click="useUserStore().logout()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <!-- 登录对话框 -->
  <el-dialog v-model="loginView" title="登录" class="dialog" :width="dialogWidth">
    <div>
      <el-form
        ref="loginFormRef"
        :model="loginFormData"
        :rules="loginFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="account" label="用户名">
          <el-input v-model="loginFormData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input show-password v-model="loginFormData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="loginView = false">取消</el-button>
      <el-button type="primary" @click="handleLogin">确认</el-button>
    </template>
  </el-dialog>
  <!-- 注册对话框 -->
  <el-dialog v-model="registerView" title="注册" class="dialog" :width="dialogWidth">
    <div>
      <el-form
        ref="registerFormRef"
        :model="registerFormData"
        :rules="registerFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="account" label="用户名">
          <el-input v-model="registerFormData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input show-password v-model="registerFormData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <el-select v-model="registerFormData.avatar" placeholder="请选择">
            <el-option
              style="height: auto !important"
              v-for="item in avatarList"
              :key="item[0]"
              :label="item[0]"
              :value="item[0]"
            >
              <div style="height: auto !important; text-align: center; margin-top: 5px">
                <el-avatar size="default" shape="square" :src="item[1]" />
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="registerView = false">取消</el-button>
      <el-button type="primary" @click="handleRegister">确认</el-button>
    </template>
  </el-dialog>
  <!-- 信息对话框 -->
  <el-dialog v-model="myMsgView" title="我的信息" class="dialog" :width="dialogWidth">
    <div>
      <el-form
        ref="myInfoFormRef"
        :model="myInfoFormData"
        :rules="myMsgFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item prop="account" label="用户名">
          <el-input disabled v-model="myInfoFormData.account" placeholder="请输入" />
        </el-form-item>
        <el-divider />
        <el-form-item prop="oldPassword" label="原密码">
          <el-input show-password v-model="myInfoFormData.oldPassword" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="newPassword" label="修改新密码">
          <el-input show-password v-model="myInfoFormData.newPassword" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认新密码">
          <el-input show-password v-model="myInfoFormData.confirmPassword" placeholder="请输入" />
        </el-form-item>
        <el-divider />
        <el-form-item prop="avatar" label="头像">
          <el-select v-model="myInfoFormData.avatar" placeholder="请选择">
            <el-option
              style="height: auto !important"
              v-for="item in avatarList"
              :key="item[0]"
              :label="item[0]"
              :value="item[0]"
            >
              <div style="height: auto !important; text-align: center; margin-top: 5px">
                <el-avatar size="default" shape="square" :src="item[1]" />
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="myMsgView = false">取消</el-button>
      <el-button type="primary" @click="handleUpdateInfo">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { updateInfo } from "@/api/user"
import { useUserStore } from "@/store/modules/user"
import { getAvatarList } from "@/api/avatar"
import { UserFilled } from "@element-plus/icons-vue"
const avatarList = ref<Map<String, String>>()
const loginView = ref(false)
const registerView = ref(false)
const myMsgView = ref(false)
const phoneView = ref(document.body.clientWidth <= 650)
const avatar = ref("")
const docWidth = ref(document.body.clientWidth)

function getAvatar() {
  getAvatarList({
    pageIndex: 1,
    pageSize: 20
  }).then((avatar: any) => {
    const arr: Array<{ imgId: string; imgUrl: string }> = avatar.data
    const map: Map<string, string> = new Map()
    for (const arrElement of arr) {
      map.set(arrElement.imgId, arrElement.imgUrl)
    }
    avatarList.value = map
  })
}

const handleClick = (type: string) => {
  if (type == "login") loginView.value = true
  else {
    registerView.value = true
    getAvatar()
  }
}
const loginFormRef = ref<FormInstance | null>(null)
const loginFormData = reactive({
  account: "",
  password: ""
})
const loginFormRules: FormRules = reactive({
  account: [{ required: true, min: 5, max: 16, trigger: "blur", message: "长度不得小于5位或大于16位" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})
const registerFormRef = ref<FormInstance | null>(null)
const registerFormData = reactive({
  account: "",
  password: "",
  avatar: ""
})
const registerFormRules: FormRules = reactive({
  account: [{ required: true, min: 5, max: 16, trigger: "blur", message: "长度不得小于5位或大于16位" }],
  password: [{ required: true, trigger: "blur", min: 8, max: 32, message: "长度不得小于8位或大于32位" }],
  avatar: [{ required: true, trigger: "blur", message: "请选择头像" }]
})

const myInfoFormRef = ref<FormInstance | null>(null)
const myInfoFormData = reactive({
  account: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  avatar: ""
})
const store = useUserStore()
const showUpdateInfo = () => {
  const item = store.userInfo
  getAvatar()
  if (!item) return
  myInfoFormData.oldPassword = ""
  myInfoFormData.newPassword = ""
  myInfoFormData.confirmPassword = ""
  myInfoFormData.avatar = item.avatar + ""
  myInfoFormData.account = item.account
  myMsgView.value = true
}
const validateNewPassword = (rule: any, value: string, callback: any) => {
  if (!value && myInfoFormData.oldPassword == "") callback()
  if (value.length < 8 || value.length > 32) {
    callback(new Error("长度不得小于8位或大于32位"))
  }
  if (myInfoFormData.oldPassword == value) {
    callback(new Error("新密码不能与旧密码相同"))
  }
}
const myMsgFormRules: FormRules = reactive({
  oldPassword: [{ min: 8, max: 32, trigger: "blur", message: "长度不得小于8位或大于32位" }],
  newPassword: [{ validator: validateNewPassword, min: 8, max: 32, trigger: "blur" }],
  confirmPassword: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (myInfoFormData.newPassword != myInfoFormData.confirmPassword) callback(new Error("两次密码不相同"))
      },
      trigger: "blur"
    }
  ]
})

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      store.login(loginFormData).then((res) => {
        // @ts-ignore
        if (res) {
          ElMessage.success("登陆成功")
          isLogin.value = true
          loginView.value = false
          location.reload()
        }
      })
    } else {
      return false
    }
  })
}
const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      useUserStore()
        .register(registerFormData)
        .then((res) => {
          // @ts-ignore
          if (res) {
            ElMessage.success("注册成功,请登陆")
            location.reload()
          }
        })
    } else {
      return false
    }
  })
}

const handleUpdateInfo = () => {
  updateInfo(myInfoFormData).then((res) => {
    // @ts-ignore
    if (res.msg.includes("成功")) {
      ElMessage.success("修改成功,请重新登陆")
      myMsgView.value = false
      store.logout()
      location.reload()
    }
  })
}

const dialogWidth = ref("50%")
const setDialogWidth = () => {
  const val = document.body.clientWidth
  const def = 500 // 默认宽度
  if (val < def) {
    dialogWidth.value = "90%"
  } else {
    dialogWidth.value = def + "px"
  }
}
const isLogin = ref<undefined | boolean>(false)
const accountRef = ref("")
watch(
  () => store.isLogin,
  (val) => {
    isLogin.value = val
    const item = store.userInfo
    if (item) {
      accountRef.value = item.account
      avatar.value = item.avatarUrl
    }
  }
)
setDialogWidth()
</script>

<style scoped lang="scss">
.dropdown-menu {
  :deep(.el-dropdown-menu__item) {
    justify-content: center;
  }
}
</style>
