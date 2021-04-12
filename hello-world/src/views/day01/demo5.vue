<template>
    <div>
       {{ fullName }}
       <br>
       lastName: <input type="text" v-model="lastName">
       firstName: <input type="text" v-model="firstName">
       <button @click="test">测试按钮</button>

        <hr>
        <h2>setter演示</h2>
        <input type="text" v-model="value" >
        <button @click="testButton">测试</button>

        <hr>
        方法返回：{{ showFullName   () }}
    </div>
</template>

<script>
// 计算属性依赖其他属性生成
export default {
  data () {
    return {
      lastName: 'xyz',
      firstName: 'abc',
      value: ''
    }
  },

  computed: {
    // fullName看成变量
    // fullName () {
    //   console.log('computed')
    //   return this.firstName + this.lastName
    // }

    fullName: {
      get () {
        console.log('compute  get')
        return this.firstName + this.lastName
      },
      set (value) {
        console.log('compute  set')
        var name = value.split(' ')
        this.lastName = name[0]
        this.firstName = name[1]
      }
    }
  },
  methods: {
    test () {
      this.firstName = 'abc'
    },
    testButton () {
      this.fullName = this.value
    },
    // 通过方法返回fullName
    showFullName () {
      return this.firstName + this.lastName
    }
  }
}
</script>
