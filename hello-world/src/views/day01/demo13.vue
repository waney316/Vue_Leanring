<template>
  <div>
    <h1>对象数据更新</h1>
    <ul>
      <template v-for="v in list">
        <li :key="v"> {{ v }}</li>
      </template>
    </ul>
    <button @click="update">更新名称</button>
    <hr>
    <h1>v-for -- v-if 联合使用</h1>
    <ul>
      <!-- v-for优先级 -->
      <!-- <template v-for="n in 10">
        <li :key=n v-if="n%2===1">{{ n }}</li>
      </template> -->
      <!-- v-if优先级 -->
      <template v-if="i===10">
        <li :key=n v-for="n in i">{{ n }}</li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      i: 10,
      list: {
        name: 'wangwei',
        age: 12
      }
    }
  },
  methods: {
    update () {
      // 对象数据添加属性，需要为data里注册
      this.$set(this.list, 'name', 'cshi')
    }
  }
}
</script>
