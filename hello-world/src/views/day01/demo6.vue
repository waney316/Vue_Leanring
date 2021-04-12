<template>
    <div>

        <h1 :class="fontColor">class样式绑定-变量形式</h1>
        <button @click="changeColor">切换</button>
        <hr>

        <h1 >class样式绑定 对象形式</h1>
        <div :class="{isfontColorRed: isColorRed}"></div>

    </div>
</template>

<script>
export default {
  data () {
    return {
      fontColor: 'fontColorRed',
      isColorRed: false
    }
  },
  methods: {
    changeColor () {
      if (this.fontColor === 'fontColorRed') {
        this.fontColor = 'fontColorGreen'
      } else {
        this.fontColor = 'fontColorRed'
      }
    }
  }
}
</script>

<style scoped>
    .fontColorRed {
        color: red;
    }
    fontColorGreen{
        color: green;
    }

    fontSize{
        font-size: 50px;
    }
</style>
