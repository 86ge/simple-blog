import {Ref, ref, UnwrapRef} from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import {type ILoginData, loginApi, getUserInfoApi, checkLoginApi} from "@/api/user"
import {useRouter} from "vue-router";

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])

  let isLogin:Ref<UnwrapRef<boolean|undefined>> = ref(undefined)

  const checkLogin = () => {
      return new Promise((resolve, reject) => {
        checkLoginApi().then((res: any) => {
          let data: string = res.msg
          if (data.includes("未登录")) {
            isLogin.value=false
            window.localStorage.clear()
            reject(false)
          }
          let item = window.localStorage.getItem("userInfo");
          if(item) {
            let info:any = JSON.parse(item)
            if (info.msg.token) {
              isLogin.value=true
              setToken(info.msg.token)
              resolve(true)
            }
          }else{
            removeToken()
            reject(false)
          }
        }).catch(() => {
          window.localStorage.clear()
          reject(false)
        })
      })
  }

  /** 登录 */
  const login = (loginData: ILoginData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        account: loginData.account,
        password: loginData.password,
      })
        .then((res: any) => {
          setToken(res.data.token)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    window.localStorage.clear()
    token.value = ""
    roles.value = []
    resetRouter()
    router.push("/").then(()=>{
      location.reload()
    })
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { isLogin,token, roles, login, logout, resetToken, checkLogin }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
