<template>
  <div>
    <h1>数据更新</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        '张无忌',
        '小昭',
        '赵敏',
        '阿朱',
        '周芷若'
      ]
    }
  },
  created () {
    // push：向数组里添加元素
    // console.log(this.list)
    // console.log(this.list.push('王者'))
    // console.log(this.list)

    // pop: 删除数组里最后一个数据
    // console.log(this.list)
    // console.log(this.list.pop())
    // console.log(this.list)

    // shift: 删除数组中第一个值
    // console.log(this.list)
    // console.log(this.list.shift())
    // console.log(this.list)

    // unshift: 向数组添加一个或多个元素
    // console.log(this.list)
    // console.log(this.list.unshift('您好', '我不好'))
    // console.log(this.list)

    // sort: 排序
    // console.log(this.list)
    // console.log(this.list.sort())
    // console.log(this.list)

    // reverse: 翻转
    console.log(this.list)
    console.log(this.list.reverse())
  },
  mounted () {
    console.log('页面渲染挂载')
  }

}
</script>
