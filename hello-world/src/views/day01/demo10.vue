<template>
  <div>
    <h1>key演示</h1>
    <template v-if="loginType === 'username'" >
      <label for="">用户名：</label>
      <input type="text" placeholder="please enter your username" :key="username">
    </template>
    <template v-else>
      <label for="">邮箱登录：</label>
      <input type="text" placeholder="please enter your email" :key="email">
    </template>
    <hr>
    <button @click="switchLoginType">登录方式验证</button>
    <hr>
      <!-- 
        v-show 在判断后，始终会渲染数据且使用 css 的 display 展示或者隐藏功能页面。
      而 v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。 
      -->
      <h2 v-show="false">v-show</h2>
      <h2 v-if="true">v-if</h2>
  </div>

</template>

<script>
export default {
  data () {
    return {
      username: 'username',
      email: 'email',
      loginType: 'username'
    }
  },
  methods: {
    switchLoginType () {
      if (this.loginType === 'username') {
        this.loginType = ''
      } else {
        this.loginType = 'username'
      }
    }
  }
}
</script>
