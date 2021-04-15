<template>
  <div>
    <ul>
      <template v-for="(n, i) in list">
        <li :key="i" :id="i === 0 ? 'test': ''">
          <input type="checkbox">
          {{ n }}
        </li>
      </template>
    </ul>
    <button @click="add">添加</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    add () {
      this.list.unshift(10)
    }
  }
}
</script>
