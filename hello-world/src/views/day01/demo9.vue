<template>
    <div>
        <h1>v-if</h1>
        <h1 v-if="isShow">hello world</h1>

        <template v-if="isShow">
            <h1>hello world</h1>
            <h2>hello world</h2>
            <h3>hello world</h3>
            <h4>hello world</h4>
        </template>
        <button @click="isShow != isShow">切换</button>

        <hr>

        <h1>v-else</h1>
        <h1 v-if="isShow">展示v-if</h1>
        <h1 v-else-if="vElseIf">v-else-if判断</h1>
        <h2 v-else>else展示</h2>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      vElseIf: true
    }
  }
}
</script>
