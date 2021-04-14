<template>
    <div>
        <h1 :style="{color: fontColor, fontSize: fontSize}">style样式绑定,数据形式</h1>
        <span>调整字体大小</span><input type="text" v-model="fontSize">
        <h1 :style="styleObject">对象样式绑定 </h1>

        <h1 :style="[styleObject]">数组样式绑定</h1>
    </div>
</template>

<script>
export default {
  data () {
    return {
      fontColor: 'red',
      fontSize: 50 + 'px',
      styleObject: {
        color: 'blue',
        fontSize: 50 + 'px'
      }
    }
  }
}
</script>
