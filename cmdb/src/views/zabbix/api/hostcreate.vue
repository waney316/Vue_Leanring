<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 15px">主机批量新建</span>
      </div>
      <div class="text item">
        <!-- 添加主机 -->
        <el-form
          :model="hostCreateForm"
          :rules="hostCreateRules"
          ref="hostCreateForm"
          label-width="100px"
          label-position="left"
          class="demo-ruleForm"
          size="mini"
        >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="数据源选择" prop="dataSource">
                <el-select
                  v-model="dataSource"
                  clearable
                  placeholder="请选择Zabbix数据源"
                  @change="
                    getProxyList('hostCreate'),
                      getHostGroupList('hostCreate'),
                      getTemplateList('hostCreate')
                  "
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
            </el-col>
            <el-col :span="6">
              <el-form-item label="接入类型" prop="type">
                <el-select
                  v-model="hostCreateForm.type"
                  clearable
                  placeholder="请选择接入类型"
                  @change="handleType"
                >
                  <el-option label="SNMP接入" value="snmp"> </el-option>
                  <el-option label="Agent接入" value="agent"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="挂载代理" prop="proxy">
                <el-select
                  v-model="hostCreateForm.proxy"
                  clearable
                  placeholder="请选择挂载的代理"
                >
                  <el-option label="不挂载代理" value=""></el-option>
                  <el-option
                    v-for="item in proxyList"
                    :label="item.host"
                    :value="item.host"
                    :key="item.proxyid"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接入端口" prop="port">
                <el-input
                  v-model="hostCreateForm.port"
                  placeholder="端口"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="SNMP版本"
            prop="snmp"
            v-show="hostCreateForm.type === 'snmp'"
          >
            <el-select v-model="snmpversion" placeholder="请选择snmp版本">
              <el-option label="SNMPv2" value="2"></el-option>
              <el-option label="SNMPv3" value="3"></el-option>
            </el-select>
          </el-form-item>
          <template>
            <div v-show="snmpversion === '2' && snmpversion != ''">
              <el-form-item label="SNMP团体字">
                <el-input v-model="community"></el-input>
              </el-form-item>
            </div>
          </template>

          <template>
            <div v-show="snmpversion === '3'">
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="用户名称">
                    <el-input v-model="user"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="上下文名称">
                    <el-input v-model="contextname"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="安全级别">
                <el-select v-model="securitylevel" placeholder="选择安全级别">
                  <el-option label="noAuthnoPriv" value="0"></el-option>
                  <el-option label="authNoPriv" value="1"></el-option>
                  <el-option label="authPriv" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="验证协议"
                v-show="
                  snmpversion &&
                    (securitylevel === '1' || securitylevel === '2')
                "
              >
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-select
                      v-model="authprotocol"
                      placeholder="选择验证协议"
                    >
                      <el-option label="MD5" value="0"></el-option>
                      <el-option label="SHA" value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4.5">
                    <el-input
                      placeholder="请输入验证口令"
                      v-model="authpassphrase"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="隐私协议" v-show="securitylevel === '2'">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-select
                      v-model="privprotocol"
                      placeholder="选择隐私协议"
                    >
                      <el-option label="DES" value="0"></el-option>
                      <el-option label="AES" value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4.5">
                    <el-input
                      placeholder="请输入私钥"
                      v-model="privpassphrase"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </template>

          <el-form-item label="主机群组" prop="group">
            <el-select
              v-model="hostCreateForm.group"
              multiple
              filterable
              allow-create
              clearable
              :loading="groupLoading"
              style="width:100%"
              placeholder="请选择关联的主机群组"
            >
              <el-option
                v-for="item in groupArr"
                :key="item.groupid"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联模板" prop="template">
            <el-select
              v-model="hostCreateForm.template"
              multiple
              filterable
              clearable
              allow-create
              style="width:100%"
              :loading="templateLoading"
              placeholder="请选择关联的模板"
            >
              <el-option
                v-for="item in templateArr"
                :key="item.templateid"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="主机列表" prop="host">
            <el-input
              type="textarea"
              placeholder="请输入IP列表, 以换行为间隔, 默认以IP作为主机名"
              v-model="hostCreateForm.host"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="是否以IP作为主机名"
            prop="show_field"
            label-width="14%"
          >
            <el-switch
              v-model="show_field"
              active-value="true"
              inactive-value="false"
            ></el-switch>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-switch
              v-model="hostCreateForm.status"
              active-value="0"
              inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-button
            type="primary"
            @click="submitForm('hostCreateForm')"
            size="small"
            >立即创建</el-button
          >
          <el-button @click="resetForm('hostCreateForm')" size="small"
            >重置</el-button
          >
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

      hostCreateRules: {
        // dataSource: [
        //   { required: true, message: "请选择数据源", trigger: "blur" }
        // ],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        type: [{ required: true, message: "请选择接入类型", trigger: "blur" }],
        group: [{ required: true, message: "请关联主机组", trigger: "blur" }],
        host: [{ required: true, message: "请输入ip列表", trigger: "blur" }]
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
  beforeDestroy() {
    //页面离开时如果存在socket连接先行关闭
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
    getHostGroupList() {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllHostGroup(data).then(response => {
          this.groupArr = response.data;

          this.groupLoading = false;
        });
      }
    },
    //获取模板列表
    getTemplateList() {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllTemplates(data).then(response => {
          this.templateArr = response.data;
          this.templateLoading = false;
        });
      }
    },
    //获取代理列表
    getProxyList() {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        };
        listAllProxies(data).then(response => {
          console.log(response);
          this.proxyList = response.data;
        });
      }
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
