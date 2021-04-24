<template>
  <div>
    <input type="text" v-model="href" />
    <button @click="handleClick">点击跳转: {{ href }}</button>
    <hr>
    <router-view name="default"></router-view>
    <router-view name="user2"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      href: 'test1'
    }
  },

  methods: {
    handleClick () {
      if (this.href === 'test1') {
        // this.$router.push('/test1/999')
        this.$router.push({ name: 'test1', params: { id: 999 } })
      } else {
        // this.$router.push('/test2')
        this.$router.push({ name: 'test2' })
      }
    }
  }
}
</script>
