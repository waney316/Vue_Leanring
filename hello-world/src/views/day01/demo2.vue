<template>
    <div>
        <!-- <List></List> -->
        <!-- 父组件向子组件传值 -->
        <List :list="list"></List>
    </div>
</template>

<script>
// 全局注册
// import Vue from 'vue'
import List from './components/list'
// Vue.component('list', List)

export default {
  data () {
    return {
      list: ['a', 'b', 'c', 'd', 'e']
    }
  },
  components: {
  // 局部组件注册
    List
  }
}
</script>
