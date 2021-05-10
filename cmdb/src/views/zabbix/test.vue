<template>
  <div>
    <el-button
      type="success"
      @click="handleConnect"
    >测试连接</el-button>
    <el-dialog :visible.sync="dialogInfoVisible">
      用户ID: {{ info.userid }}
      用户名：{{ info.username }}
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogInfoVisible: false,
      info: ""
    }
  },
  methods: {
    handleConnect () {
      const data = { name: "test" }
      getList(data).then(response => {
        // response_data = {"userid": 001, "username": "test", }
        this.info = response_data
        this.dialogInfoVisible = true
      });
    }
  }
}
</script>