<template>
  <div class="mask">
    <div class="poster">
      <div class="inner-mask">{{ data}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LogShow",
  props: ["data"],
  data () {
    return {};
  }
};
</script>
<style lang="scss">
.mask {
  width: 100%;
  height: 100%;
  position: relative;
  .poster {
    position: relative;
    width: 100%;
  }

  .inner-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 1);
    opacity: 0.4;
    height: 100%;
    width: 100%;
    filter: alpha(opacity=60);
  }
}
</style>
