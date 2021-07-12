<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>主机批量管理</span>
      </div>
      <div class="text item">
        <el-form
          :model="hostManagerForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item label="数据源选择" prop="dataSource">
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
          <el-form-item label="操作类型" prop="hostoperation">
            <el-select
              v-model="hostoperation"
              clearable
              placeholder="请选择操作类型"
              style="margin-left: 10px"
            >
              <el-option label="查询主机" value="show"> </el-option>
              <el-option label="禁用主机" value="disable"> </el-option>
              <el-option label="启用主机" value="enable"> </el-option>
              <el-option label="删除主机" value="delete"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主机列表" prop="desc">
            <el-input type="textarea" v-model="hostManagerForm.desc"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('hostManagerForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('hostManagerForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="log" v-show="LogVisible">
      <p v-for="(item, index) in log" :key="index">
        {{ item }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  getZabbixList,
  listAllTemplates,
  listAllHostGroup,
  hostCreate,
  hostTemplate,
  hostGroup,
  hostManager,
  listAllProxies
} from "@/api/zabbix";
import Log from "@/components/LogShow";
import { socketRequest } from "@/api/zabbix";

export default {
  components: { Log },
  data() {
    return {
      //日志
      log: [],
      LogVisible: false,
      groupLoading: true,
      templateLoading: true,
      dataSource: "",
      dataSourceOption: "",
      show_field: "true",
      //主机新建
      templateArr: [],
      groupArr: [],
      proxyList: [],
      //主机管理
      templateArr2: [],
      groupArr2: [],
      proxyList2: [],
      //主机群组/主机模版/主机代理
      operationModule: "",
      //操作类型，添加、删除、替换
      operationType: "",
      //主机管理接口：查询启用禁用删除
      hostoperation: "",
      //默认显示第几个tab
      activeName: "first",
      //主机新建数据样例
      snmpversion: "",
      community: "",
      contextname: "",
      user: "",
      securitylevel: "",
      authprotocol: "",
      authpassphrase: "",
      privprotocol: "",
      privpassphrase: "",
      hostCreateForm: {
        host: "", //创建的主机列表
        proxy: "", // 关联代理,默认空字符即不关联代理
        group: "", //主机组
        template: "", //模版
        type: "", //接入类型
        status: "", //是否启用
        port: "" //端口
      },

      //主机群组模版关联
      hostLinkForm: {},
      //主机接口管理
      hostManagerForm: {},

      //三个tab下校验规则
      hostCreateRules: {
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        type: [{ required: true, message: "请选择接入类型", trigger: "blur" }],
        group: [{ required: true, message: "请关联主机组", trigger: "blur" }],
        host: [{ required: true, message: "请输入ip列表", trigger: "blur" }]
      },
      hostLinkRules: {
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        operationModule: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        operationType: [
          { required: true, message: "请选择操作类别", trigger: "blur" }
        ],
        hosts: [
          { required: true, message: "请输入IP,以换行分割", trigger: "blur" }
        ]
      },
      hostManagerRules: {
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        operationModule: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        operationType: [
          { required: true, message: "请选择操作类别", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getDataSourceList();
  },
  mounted() {
    //页面刷新时如果存在socket连接先行关闭
    this.closeConnect();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList() {
      getZabbixList().then(response => {
        this.dataSourceOption = response.data.results;
      });
    },
    //主机主机组列表
    getHostGroupList(params) {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllHostGroup(data).then(response => {
          params == "hostCreate"
            ? (this.groupArr = response.data)
            : (this.groupArr2 = response.data);
          this.groupLoading = false;
        });
      }
    },
    //获取模板列表
    getTemplateList(params) {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllTemplates(data).then(response => {
          params == "hostCreate"
            ? (this.templateArr = response.data)
            : (this.templateArr2 = response.data);
          this.templateLoading = false;
        });
      }
    },
    //获取代理列表
    getProxyList(params) {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllProxies(data).then(response => {
          console.log(response);
          params == "hostCreate"
            ? (this.proxyList = response.data)
            : (this.proxyList2 = response.data);
        });
      }
    },

    handleClick(tab, event) {
      //点击tab切换时关闭socket,清空日志
      this.closeConnect();
      this.dataSource = "";
      this.log = [];
      this.LogVisible = false;
      console.log(tab, event);
    },
    //用于新建主机
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = [];
          const copyForm = Object.assign({}, this.hostCreateForm);
          if (copyForm.type === "snmp") {
            copyForm.details = this.handleSnmp();
          }
          formData.push(this.validateHost(copyForm)); //处理文本框中的ip,写入hostArr
          const tempData = {
            dataSource: this.dataSource,
            show_field: this.show_field,
            api_version: "5",
            data: formData
          };
          console.log(tempData);
          this.LogVisible = true;
          //建立socket连接
          this.handleConnect();

          //向后端发起创建主机请求
          setTimeout(() => {
            hostCreate(tempData).then(response => {
              console.log(response);
              if (response.code != 0) {
                this.$message({
                  showClose: true,
                  message: response.message,
                  type: "error"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: response.data,
                  type: "success"
                });
              }
            });
          }, 100);

          // alert('submit!');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //用于主机模板群组管理
    submitHostLinkForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = [];
          const copyForm = Object.assign({}, this.hostLinkForm);
        }
      });
    },

    //用于主机管理表
    submitHostMangerForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = [];
          const copyForm = Object.assign({}, this.hostCreateForm);
        }
      });
    },

    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //处理切换接入类型后表单问题
    handleType() {
      console.log(typeof this.snmpversion);
      this.snmpversion = "";
    },
    //处理表单中host数据, 输出为数组项
    validateHost(formTem) {
      if (formTem.host) {
        let hostArr = [];
        formTem.host.split("\n").forEach(element => {
          hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        });
        let tmepForm = Object.assign({}, formTem);
        tmepForm.host = hostArr;
        return tmepForm;
      }
    },

    //处理snmp添加
    handleSnmp() {
      const details = {
        version: this.snmpversion,
        bulk: 1
      };
      console.log(this.community);
      if (this.snmpversion === "2") {
        details.community = this.community;
      } else if (this.snmpversion === "3") {
        if (this.contextname != "") {
          details.contextname = this.contextname;
        }
        details.securityname = this.user;
        details.securitylevel = this.securitylevel;
        if (this.securitylevel === "2") {
          details.authprotocol = this.authprotocol;
          details.privprotocol = this.privprotocol;
          details.authpassphrase = this.authpassphrase;
          details.privpassphrase = this.privpassphrase;
        } else if (this.securitylevel === "1") {
          details.authprotocol = this.authprotocol;
          details.authpassphrase = this.authpassphrase;
        } else if (this.securitylevel === "0") {
        }
      }
      return details;
    },

    //socket连接
    handleConnect() {
      //如果socket事先存在，则关闭
      if (window.ws) {
        //清空log
        this.log = [];
        this.LogVisible = true;
        window.ws.close();
        window.ws.onclose = function(event) {
          console.log(new Date() + "socker已关闭");
        };
      }

      if ("WebSocket" in window) {
        //创建socket
        let self = this;
        window.ws = new WebSocket("ws://127.0.0.1:8000/ws/zabbix");
        console.log(ws.readyState);
        //
        ws.send = function() {};
        // 连接建立后的回调函数
        ws.onopen = function() {
          console.log("连接已建立");
        };
        //监听消息
        ws.onmessage = function(event) {
          console.log(event.data);
          var data = JSON.parse(event.data);
          self.log.push(data["message"]);
          console.log(data["message"]);
        };

        ws.onerror = function(event) {
          console.log("服务端连接异常！");
        };
      }
    },

    //关闭socket连接
    closeConnect() {
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
