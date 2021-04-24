<template>
  <div class="">
      <h1>这是一个get请求</h1>
      <button @click="handleGet">GET</button>
      <hr>
      <h1>这是一个post请求</h1>
      <button @click=handlePost>POST</button>
      <hr>
      <h1>这是并发请求</h1>
      <button @click="spreadGet">并发请求</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  components: {

  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    handleGet () {
      console.log('get')
      axios.get('/data.json', {
        // baseURL: 'https://fdevops.com', // 自动加载url前面
        params: {
          username: 'wangzhe' // 请求参数  ?username=wangzhe
        }
      }).then(response => {
        console.log(response.data)
      }).catch(err => {
        console.log(err)
      })
    },

    // post请求
    handlePost () {
      axios.post('/data.json', {
        username: 'wangwei',
        // 如果url需要添加请求参数
        params: {
          page: '10'
        }
      }).then(response => {
        console.log(response.data)
      }).catch(err => {
        console.log(err)
      })
    },

    // 并发请求
    spreadGet () {
      axios.all(
        // 并发请求的url
        [
          axios.get('/data.json'),
          axios.get('/data1.json')
        ]
      ).then(axios.spread(function (res1, res2) {
        console.log(res1.data)
        console.log(res2.data)
      }))
    }

  }
}
</script>

<style scoped lang="scss">

</style>
