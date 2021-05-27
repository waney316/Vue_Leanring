<template>
  <div class="log">
    <p
      class="log-item"
      v-for="host in hosts"
      :key="host.hostid"
    >
      <span>{{ host }}</span>
      <span>{{ host.ip}}</span>
      <span>{{ host.hostid}}</span>
      <span>{{ host.status}}</span>
    </p>
    <div>
      <el-button @click="handleClick">显示后端输出</el-button>
    </div>
  </div>

</template>

<script>
import { socketRequest } from "@/api/zabbix";
export default {
  name: 'LogShow',
  // props: {
  // 	hosts: Array
  // },
  data () {
    return {
      hosts: []
    }
  },
  mounted () {
    this.WebSocketTest()
  },
  methods: {
    handleClick () {
      socketRequest().then(response => {
        console.log(response);
      })

    },

    WebSocketTest () {
      let self = this
      if ("WebSocket" in window) {
        // 打开一个 web socket
        var ws = new WebSocket("ws://127.0.0.1:8000/ws/");

        // 连接建立后的回调函数
        // ws.onopen = function () {
        //   // Web Socket 已连接上，使用 send() 方法发送数据
        //   ws.send("admin:123456");
        //   alert("正在发送：admin:123456");
        // };

        // 接收到服务器消息后的回调函数
        ws.onmessage = function (evt) {
          console.log(evt.data);
          var received_msg = evt.data;
          if (received_msg.indexOf("sorry") == -1) {
            // alert("收到消息："+received_msg);
            self.hosts.push(received_msg)
          }

        };

        // 连接关闭后的回调函数
        ws.onclose = function () {
          // 关闭 websocket
          alert("连接已关闭...");
        };
      }
      else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.log {
  background-color: #333;
  overflow-y: scroll;
  color: #fff;
  height: 300px;
}

.log-item span {
  padding: 5px 10px;
}
</style>
