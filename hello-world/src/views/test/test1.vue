<template>
  <div>
    <router-link :to="{ name: 'test2' }">
      <h1>
        当前为test1，点击跳转至test2,
        <hr />
        <!-- 当前页面参数id: {{ this.$route.params.id }} -->
        参数： {{ id }}
      </h1>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['id']
}
</script>
