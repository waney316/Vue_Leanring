<template>
    <div>
        v-text: <span v-text="content" :class="test"></span>
        <br>
        v-html: <span v-html="content"></span>
        <input type="text" :disabled="disabledStatus">
        <br>
        <!-- 插值表达式 -->
        <div>
            {{ content.split('').reverse().join("") }}
        </div>
    </div>
</template>

<script>
/*
v-text:
v-html:
*/
export default {
  data () {
    return {
    //   content: '<h1>51reboot</h1>',
      content: '51reboot',
      test: '51reboot',
      disabledStatus: true
    }
  },

  methods: {

  }
}
</script>
