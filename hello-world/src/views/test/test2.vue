<template>
  <div>
    <router-link :to="{name: 'test1', params: {id: '789'}}">
      <h1>当前为test2, 点击跳转至test1</h1>
      当前页面参数: {{ id }}
    </router-link>
  </div>
</template>
<script>
export default {
  props: ['id']
}
</script>
