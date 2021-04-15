<template>
  <div>
    <h1>列表渲染</h1>
    <ul>
      <li v-for="(item, index) in List" :key="index">
        索引：{{index}}--值：{{item}} --- <button @click='delLi(index)'>删除</button>
      </li>
    </ul>

    <hr>
  <h1>使用值范围</h1>
  <ul>
    <li v-for="(n,i) in 5" :key="i">{{i}} -- {{ n}}</li>
  </ul>

  <hr>
  <h1>使用对象数据</h1>
  <ul>
    <li v-for="(item,index) in objectArray" :key="index">{{index}} -- {{ item.name }} </li>
  </ul>
  <hr>

  <h1>v-for遍历对象</h1>
    <ul>
      <li v-for="(item, key, index) in objects" :key="item">{{index}}-- {{key}} -- {{ item}}</li>
    </ul>

    <h1>修改对象的值</h1>
    <input type="text" v-model="value">
    <button @click="changeValue">更新名称</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      List: [
        '王者',
        '张三',
        '无敌',
        '不好'
      ],
      objectArray: [
        { name: '哈哈哈' }, { name: '我我我' }, { name: '来了了' }
      ],
      objects: {
        name: 'waney',
        age: '20',
        address: '深圳'
      },
      value: ''
    }
  },
  methods: {
    delLi (index) {
      this.List.splice(index, 1)
    },
    changeValue () {
      this.objects.name = this.value
    }
  }
}
</script>
