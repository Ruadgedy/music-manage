/* eslint-disable */
import axios from 'axios'
import router from '../router'
axios.defaults.timeout = 5000;  //超时时间设置
axios.defaults.withCredentials = true;  //true允许跨域
//Content-Type 响应头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


if (process.env.NODE_ENV === 'production') {
  /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
  if (process.env.VUE_APP_FLAG === 'pro') {
    //production 生产环境
    axios.defaults.baseURL = 'http://localhost:8888';
  } else {
    //test 测试环境
    axios.defaults.baseURL = 'http://localhost:8888';
  }
} else {
  //dev 开发环境
  axios.defaults.baseURL = 'http://localhost:8888';
}

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200){
      return Promise.resolve(response)
    }else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status){
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;
        case 403:
          // console.log('管理员权限已修改请重新登录')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;

        // 404请求不存在
        case 404:
          // console.log('请求页面飞到火星去了')
          break;
      }
      return Promise.reject(error.response);
    }
  }
)
