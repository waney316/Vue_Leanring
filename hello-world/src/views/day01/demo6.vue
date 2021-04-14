<template>
    <div>
        <span>服务器运行状态：<span :class="hostStatusColor">{{ hostStatus }}</span></span>
        <button @click="switchStatus">切换状态</button>
        <hr>
        <h1 :class="fontColor">class样式绑定-变量形式</h1>
        <button @click="changeColor">切换</button>
        <hr>

        <h1 :class="{fontColorGreen: isColorRed, fontSize: isFontSize}">class样式绑定 对象形式</h1>
        <!-- 数组语法 -->
        <h1 :class="[fontColor]">class样式绑定 对象形式</h1>
        <!-- <div ></div> -->

    </div>
</template>

<script>
export default {
  data () {
    return {
      hostStatus: '运行中',
      hostStatusColor: 'fontColorGreen',
      fontColor: 'fontColorRed',
      isColorRed: true,
      isFontSize: true
    }
  },
  methods: {
    changeColor () {
      if (this.fontColor === 'fontColorRed') {
        this.fontColor = 'fontColorGreen'
      } else {
        this.fontColor = 'fontColorRed'
      }
    },
    switchStatus () {
      if (this.hostStatus === '运行中') {
        this.hostStatus = '故障'
        this.hostStatusColor = 'fontColorRed'
      } else {
        this.hostStatusColor = 'fontColorGreen'
        this.hostStatus = '运行中'
      }
    }
  }
}
</script>

<style scoped>
    .fontColorRed {
        color: red;
    }
    .fontColorGreen{
        color: green;
        font-weight: bold;
    }

    .fontSize{
        font-size: 50px;
    }
</style>
