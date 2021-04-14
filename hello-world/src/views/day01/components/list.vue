<template>
<!-- 一个template下只能包含一个div元素 -->
    <div>
        <ul>
            <li v-for="(item, index) in list" v-bind:key="index">
                {{ index }} - {{ item }}- <button @click="del(index)">删除</button>
            </li>
        </ul>
        <!-- 与data里val值绑定 -->
        <input type="text" v-model="val">
        <button @click="add">添加</button>
    </div>
</template>

<script>
export default {
  props: ['list'],
  data () {
    return {
      // list: ['a', 'b', 'c', 'd', 'e'],
      val: ''
    }
  },
  methods: {
    add () {
      this.list.push(this.val)
    },
    del (index) {
      this.list.splice(index, 1)
    }
  }
}
</script>
