<template>
  <div>
    <div class="log">
      <p v-for="(item, index) in log" :key="index">
        {{ index }} --- {{ item }}
      </p>
    </div>
    <el-button @click="handleConnect">开始监听</el-button>
    <el-button @click="closeConnect">关闭监听</el-button>
  </div>
</template>

<script>
import { socketRequest } from "@/api/zabbix";
export default {
  name: "LogShow",
  // props: {
  // 	hosts: Array
  // },
  data() {
    return {
      log: []
    };
  },
  // mounted () {
  //   this.WebSocketTest()
  // },
  methods: {
    //socket连接
    handleConnect() {
      if ("WebSocket" in window) {
        //创建socket
        let self = this;
        window.ws = new WebSocket("ws://127.0.0.1:8000/ws/");

        //
        ws.send = function() {};
        // 连接建立后的回调函数
        ws.onopen = function() {
          alert("连接已建立");
        };
        //监听消息
        ws.onmessage = function(event) {
          var data = JSON.parse(event.data);
          var message = data["message"];
          self.log.push(message);
          console.log(message);
        };

        ws.onerror = function(event) {
          alert("服务端连接异常！");
        };

        ws.onclose = function(event) {
          alert("websocket已关闭！");
        };
      }
    },

    //关闭socket连接
    closeConnect() {
      console.log(window.ws);
      window.ws.close();
      window.ws.onclose = function(event) {
        alert("中止监听");
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.log {
  background-color: #333;
  overflow-y: scroll;
  color: #fff;
  height: 300px;
}
</style>
