<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>主机批量管理</span>
      </div>
      <div class="text item">
        <el-form
          :model="hostManagerForm"
          :rules="hostManagerRules"
          ref="hostManagerForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item
            label="数据源选择"
            prop="dataSource"
          >
            <el-select
              v-model="hostManagerForm.dataSource"
              clearable
              placeholder="请选择Zabbix数据源"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in dataSourceOption"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="操作类型"
            prop="method"
          >
            <el-select
              v-model="hostManagerForm.method"
              clearable
              placeholder="请选择操作类型"
              style="margin-left: 10px"
            >
              <el-option
                label="查询主机"
                value="getinfo"
              > </el-option>
              <el-option
                label="禁用主机"
                value="disable"
              > </el-option>
              <el-option
                label="启用主机"
                value="enable"
              > </el-option>
              <el-option
                label="删除主机"
                value="delete"
              > </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="主机列表"
            prop="hosts"
          >
            <el-input
              type="textarea"
              v-model="hostManagerForm.hosts"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('hostManagerForm')"
            >立即执行</el-button>
            <el-button @click="resetForm('hostManagerForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div
      class="log"
      v-show="LogVisible"
    >
      <p
        v-for="(item, index) in log"
        :key="index"
      >
        {{ item }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  getZabbixList,
  hostManager
} from "@/api/zabbix";
import Log from "@/components/LogShow";

export default {
  components: { Log },
  data () {
    return {
      //日志
      log: [],
      LogVisible: false,

      dataSource: "",
      dataSourceOption: "",
      method: "",

      hostManagerForm: {},
      hostManagerRules: {
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        method: [
          { required: true, message: "请选择操作类型", trigger: "blur" }
        ],
        hosts: [
          { required: true, message: "请输入主机", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getDataSourceList();
  },
  mounted () {
    //页面刷新时如果存在socket连接先行关闭
    this.closeConnect();
  },
  beforeDestroy () {
    //页面离开时如果存在socket连接先行关闭
    this.closeConnect();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        this.dataSourceOption = response.data.results;
      });
    },

    //用于主机管理表
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const copyForm = Object.assign({}, this.hostManagerForm);
          var hosts = this.validateHost(copyForm.hosts);
          copyForm.hosts = hosts;
          console.log(copyForm);
          //显示日志并清空
          this.log = [];
          this.LogVisible = true;
          //建立socket连接
          this.handleConnect();
          console.log("向后端发起主机管理任务请求");
          setTimeout(() => {
            hostManager(copyForm).then(response => {
              this.$message({
                showClose: true,
                message: response.data,
                type: "success"
              });
            });
          }, 1000);
        }
      });
    },

    //重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    validateHost (data) {
      let hostArr = [];
      data.split("\n").forEach(element => {
        hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
      });
      return hostArr;
    },

    //socket连接
    handleConnect () {
      //如果socket事先存在，则关闭
      if (window.ws) {
        //清空log
        this.log = [];
        this.LogVisible = true;
        window.ws.close();
        console.log("关闭socket");
        window.ws.onclose = function (event) {
          console.log(new Date() + "socker已关闭");
        };
      }

      if ("WebSocket" in window) {
        //创建socket
        let self = this;
        window.ws = new WebSocket("ws://127.0.0.1:8000/ws/zabbix");
        console.log(ws.readyState);
        //
        ws.send = function () { };
        // 连接建立后的回调函数
        ws.onopen = function () {
          console.log("连接已建立");
        };
        //监听消息
        ws.onmessage = function (event) {
          var data = JSON.parse(event.data);
          self.log.push(data["message"]);
        };

        ws.onerror = function (event) {
          console.log("服务端连接异常！");
        };
      }
    },

    //关闭socket连接
    closeConnect () {
      if (window.ws) {
        window.ws.close();
        console.log("中止监听");
      }
    }
  }
};
</script>

<style scoped>
.log {
  background-color: #333;
  overflow-y: scroll;
  color: #fff;
  height: 300px;
  margin-top: 10px;
}
</style>
