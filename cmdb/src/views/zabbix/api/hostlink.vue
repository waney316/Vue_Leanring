<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>主机-群组-模版-代理关联</span>
      </div>
      <div class="text item">
        <el-form
          :model="hostLinkForm"
          :rules="hostLinkRules"
          ref="hostLinkForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item
            label="数据源选择"
            prop="dataSource"
          >
            <el-select
              v-model="hostLinkForm.dataSource"
              clearable
              placeholder="请选择Zabbix数据源"
              style="margin-left: 10px"
              @change="
                getProxyList('hostLink'),
                  getHostGroupList('hostLink'),
                  getTemplateList('hostLink')
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
          <el-form-item
            label="操作类型"
            prop="operationModule"
          >
            <el-select
              v-model="hostLinkForm.operationModule"
              clearable
              placeholder="请选择模块"
              style="margin-left: 10px"
            >
              <el-option
                label="主机群组管理"
                value="hostGroupManager"
              ></el-option>
              <el-option
                label="主机模版管理"
                value="hostTemplateManager"
              ></el-option>
              <el-option
                label="主机代理管理"
                value="hostProxyManager"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="操作类型"
            prop="method"
          >
            <el-select
              v-model="hostLinkForm.method"
              clearable
              placeholder="请选择操作类型"
              style="margin-left: 10px"
            >
              <el-option
                label="添加"
                value="add"
              ></el-option>
              <el-option
                label="移除"
                value="remove"
              ></el-option>
              <el-option
                label="替换"
                value="replace"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="主机组选择"
            prop="group"
            v-if="hostLinkForm.operationModule === 'hostGroupManager'"
          >
            <el-select
              v-model="hostLinkForm.groups"
              multiple
              filterable
              clearable
              allow-create
              style="width:100%"
              :loading="templateLoading"
              placeholder="请选择主机群组"
            >
              <el-option
                v-for="item in groupArr"
                :key="item.groupid"
                :label="item.name"
                :value="item.groupid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="模版选择"
            prop="template"
            v-if="hostLinkForm.operationModule === 'hostTemplateManager'"
          >
            <el-select
              v-model="hostLinkForm.templates"
              multiple
              filterable
              clearable
              allow-create
              style="width:100%"
              :loading="templateLoading"
              placeholder="请选择模板"
            >
              <el-option
                v-for="item in templateArr"
                :key="item.templateid"
                :label="item.name"
                :value="item.templateid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="代理选择"
            prop="proxy"
            v-if="hostLinkForm.operationModule === 'hostProxyManager'"
          >
            <el-select
              v-model="hostLinkForm.proxy"
              filterable
              clearable
              allow-create
              style="width:100%"
              :loading="templateLoading"
              placeholder="请选择代理"
            >
              <el-option
                v-for="item in proxyList"
                :label="item.host"
                :value="item.proxyid"
                :key="item.proxyid"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="主机列表"
            prop="hosts"
          >
            <el-input
              type="textarea"
              v-model="hostLinkForm.hosts"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitHostLinkForm('hostLinkForm')"
              size="mini"
            >立即执行</el-button>
            <el-button
              @click="resetForm('hostLinkForm')"
              size="mini"
            >重置</el-button>
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
  listAllTemplates,
  listAllHostGroup,
  hostTemplate,
  hostGroup,
  listAllProxies
} from "@/api/zabbix";
import Log from "@/components/LogShow";

export default {
  components: { Log },
  data () {
    return {
      //日志
      log: [],
      LogVisible: false,
      groupLoading: true,
      templateLoading: true,
      dataSource: "",
      dataSourceOption: "",
      show_field: "true",

      templateArr: [],
      groupArr: [],
      proxyList: [],

      //主机群组/主机模版/主机代理
      operationModule: "",
      //操作类型，添加、删除、替换
      method: "",

      //主机群组模版关联
      hostLinkForm: {
        // hosts: ""
      },
      //主机接口管理
      hostManagerForm: {},

      hostLinkRules: {
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        operationModule: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        method: [
          { required: true, message: "请选择操作类别", trigger: "blur" }
        ],
        hosts: [
          { required: true, message: "请输入IP,以换行分割", trigger: "blur" }
        ],
        groups: [{ required: true, message: "请选择主机组", trigger: "blur" }],
        templates: [{ required: true, message: "请选择模版", trigger: "blur" }],
        proxy: [{ required: true, message: "请选择代理", trigger: "blur" }]
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
    //页面刷新时如果存在socket连接先行关闭
    this.closeConnect();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        this.dataSourceOption = response.data.results;
      });
    },
    //主机主机组列表
    getHostGroupList (params) {
      if (this.hostLinkForm.dataSource) {
        listAllHostGroup({ dataSource: this.hostLinkForm.dataSource }).then(
          response => {
            this.groupArr = response.data;
            console.log(this.groupArr);
            this.groupLoading = false;
          }
        );
      }
    },
    //获取模板列表
    getTemplateList (params) {
      if (this.hostLinkForm.dataSource) {
        listAllTemplates({ dataSource: this.hostLinkForm.dataSource }).then(
          response => {
            this.templateArr = response.data;
            console.log(this.templateArr);
            this.templateLoading = false;
          }
        );
      }
    },
    //获取代理列表
    getProxyList (params) {
      if (this.hostLinkForm.dataSource) {
        listAllProxies({ dataSource: this.hostLinkForm.dataSource }).then(
          response => {
            this.proxyList = response.data;
            console.log(this.proxyList);
          }
        );
      }
    },

    //用于主机模板群组关联
    submitHostLinkForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const copyForm = Object.assign({}, this.hostLinkForm);
          delete copyForm["operationModule"]; //移除operationModule字段
          var hosts = this.validateHost(copyForm.hosts);
          copyForm.hosts = hosts;
          console.log(copyForm);
          //显示日志并清空
          this.log = [];
          this.LogVisible = true;
          //建立socket连接
          this.handleConnect();

          if (this.hostLinkForm.operationModule === "hostTemplateManager") {
            console.log("向后端发起主机模版请求");
            setTimeout(() => {
              hostTemplate(copyForm).then(response => {
                this.$message({
                  showClose: true,
                  message: response.data,
                  type: "success"
                });
              });
            }, 1000);
          } else if (this.hostLinkForm.operationModule === "hostGroupManager") {
            console.log("向后端发起主机群组请求");
            setTimeout(() => {
              hostGroup(copyForm).then(response => {
                this.$message({
                  showClose: true,
                  message: response.data,
                  type: "success"
                });
              });
            }, 1000);
          }
        }
      });
    },

    //重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    //socket连接
    handleConnect () {
      //如果socket事先存在，则关闭
      if (window.ws) {
        //清空log
        this.log = [];
        this.LogVisible = true;
        window.ws.close();
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
          console.log(event.data);
          var data = JSON.parse(event.data);
          self.log.push(data["message"]);
          console.log(data["message"]);
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
    },
    validateHost (data) {
      let hostArr = [];
      data.split("\n").forEach(element => {
        hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
      });
      return hostArr;
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
