<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="主机新建" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="主机组关联" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="模版关联" name="third">角色管理</el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
