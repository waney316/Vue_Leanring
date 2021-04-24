<template>
  <div>
      <router-view></router-view>
    <h1>user, 参数： {{id}}</h1>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {

    }
  }
}
</script>
