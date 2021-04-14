<template>
    <div>
        <h1>监听器</h1>
        {{ fullName }}
        <hr>
        lastName: <input type="text" v-model="lastName">
        firstName: <input type="text" name="" id="" v-model="firstName">

        <button @click="testCache">测试缓存</button>
    </div>
</template>

<script>
export default {
  data () {
    return {
      firstName: 'wang',
      lastName: 'wei',
      fullName: 'wangwei'
    }
  },
  methods: {
    testCache () {
      this.firstName = 'wang'
    }
  },

  watch: {
    lastName () {
      console.log('监听到lastname 变化')
      this.fullname = this.firstName + this.lastName
    },
    firstName () {
      console.log('firstName 变化')
      this.fullname = this.firstName + this.lastName
    }
  }
}
</script>
