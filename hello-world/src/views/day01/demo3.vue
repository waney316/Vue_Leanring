<template>
    <div>
        {{ content }}
        <br>
        <input type="text" v-model="content">
        <br>
        <button @click=del>删除</button>
    </div>
</template>

<script>
export default {
  // 数据层
  data () {
    return {
      content: '51reboot'
    }
  },
  // 实例创建前和创建之后
  beforeCreate () {
    console.log('beforecreate')
  },
  created () {
    console.log('create')
  },

  // 渲染前和渲染后
  unmounted () {
    console.log('unmountd')
  },
  mounted () {
    console.log('mount')
  },

  // 数据更新前后
  beforeUpdate () {
    console.log('beforeupdate')
  },
  updated () {
    console.log('update')
  },

  // 实例销毁
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyd')
  },
  methods: {
    del () {
      this.$destroy()
    }
  }
}
</script>
