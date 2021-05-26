<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="主机新建"
          name="first"
        >
          <el-form
            :model="hostCreateForm"
            :rules="rules"
            ref="hostCreateForm"
            label-width="100px"
            label-position="left"
            class="demo-ruleForm"
            size="small"
          >
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item
                  label="数据源选择"
                  prop="dataSource"
                >
                  <el-select
                    v-model="dataSource"
                    clearable
                    placeholder="请选择Zabbix数据源"
                    @change="getProxyList('hostCreate'), getHostGroupList('hostCreate'), getTemplateList('hostCreate')"
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
                <el-form-item
                  label="接入类型"
                  prop="type"
                >
                  <el-select
                    v-model="hostCreateForm.type"
                    clearable
                    placeholder="请选择接入类型"
                    @change="handleType"
                  >
                    <el-option
                      label="SNMP接入"
                      value="snmp"
                    >
                    </el-option>
                    <el-option
                      label="Agent接入"
                      value="agent"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="挂载代理"
                  prop="proxy"
                >
                  <el-select
                    v-model="hostCreateForm.proxy"
                    clearable
                    placeholder="请选择挂载的代理"
                  >
                    <el-option
                      label="不挂载代理"
                      value=""
                    ></el-option>
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
                <el-form-item
                  label="接入端口"
                  prop="port"
                >
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
              v-show="hostCreateForm.type==='snmp'"
            >
              <el-select
                v-model="snmpversion"
                placeholder="请选择snmp版本"
              >
                <el-option
                  label="SNMPv2"
                  value="2"
                ></el-option>
                <el-option
                  label="SNMPv3"
                  value="3"
                ></el-option>
              </el-select>
            </el-form-item>
            <template>
              <div v-show="snmpversion==='2' && snmpversion!='' ">
                <el-form-item label="SNMP团体字">
                  <el-input v-model="community"></el-input>
                </el-form-item>
              </div>
            </template>

            <template>
              <div v-show="snmpversion==='3'">
                <el-row :gutter="16">
                  <el-col :span='8'>
                    <el-form-item label="用户名称">
                      <el-input v-model="user"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='8'>
                    <el-form-item label="上下文名称">
                      <el-input v-model="contextname"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="安全级别">
                  <el-select
                    v-model="securityLevel"
                    placeholder="选择安全级别"
                  >
                    <el-option
                      label="noAuthnoPriv"
                      value='0'
                    ></el-option>
                    <el-option
                      label="authNoPriv"
                      value='1'
                    ></el-option>
                    <el-option
                      label="authPriv"
                      value='2'
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="验证协议"
                  v-show="snmpversion&&(securityLevel==='1'||securityLevel==='2')"
                >
                  <el-row :gutter="10">
                    <el-col :span="3">
                      <el-select
                        v-model="authprotocol"
                        placeholder="选择验证协议"
                      >
                        <el-option
                          label="MD5"
                          value='0'
                        ></el-option>
                        <el-option
                          label="SHA"
                          value='1'
                        ></el-option>
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

                <el-form-item
                  label="隐私协议"
                  v-show="securityLevel==='2'"
                >
                  <el-row :gutter="10">
                    <el-col :span="3">
                      <el-select
                        v-model="privprotocol"
                        placeholder="选择隐私协议"
                      >
                        <el-option
                          label="DES"
                          value='0'
                        ></el-option>
                        <el-option
                          label="AES"
                          value='1'
                        ></el-option>
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

            <el-form-item
              label="主机群组"
              prop="group"
            >
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
            <el-form-item
              label="关联模板"
              prop="template"
            >
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

            <el-form-item
              label="主机列表"
              prop="host"
            >
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
            <el-form-item
              label="是否启用"
              prop="status"
            >
              <el-switch
                v-model="hostCreateForm.status"
                active-value="0"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
            <el-button
              type="primary"
              @click="submitForm('hostCreateForm')"
            >立即创建</el-button>
            <el-button @click="resetForm('hostCreateForm')">重置</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="主机-群组-模版-代理管理"
          name="second"
        >
          <el-form
            :model="hostManagerForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="数据源选择"
              prop="dataSource"
            >
              <el-select
                v-model="dataSource"
                clearable
                placeholder="请选择Zabbix数据源"
                style="margin-left: 10px"
                @change="getProxyList('hostManager'), getHostGroupList('hostManager'), getTemplateList('hostManager')"
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
              prop="operationTypeOption"
            >
              <el-select
                v-model="operationModule"
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
              prop="operationTypeOption"
            >
              <el-select
                v-model="operationType"
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
              prop="name"
              v-show="operationModule==='hostGroupManager'"
            >
              <el-select
                v-model="hostManagerForm.group"
                multiple
                filterable
                clearable
                allow-create
                style="width:100%"
                :loading="templateLoading"
                placeholder="请选择主机群组"

              >
                <el-option
                  v-for="item in groupArr2"
                  :key="item.templateid"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="模版选择"
              prop="name"
              v-show="operationModule==='hostTemplateManager'"
            >
              <el-select
                v-model="hostManagerForm.template"
                multiple
                filterable
                clearable
                allow-create
                style="width:100%"
                :loading="templateLoading"
                placeholder="请选择模板"
              >
                <el-option
                  v-for="item in templateArr2"
                  :key="item.templateid"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="代理选择"
              prop="name"
              v-show="operationModule==='hostProxyManager'"
            >
              <el-select
                v-model="hostManagerForm.proxy"
                filterable
                clearable
                allow-create
                style="width:100%"
                :loading="templateLoading"
                placeholder="请选择代理"
              >
                <el-option
                  v-for="item in proxyList2"
                  :label="item.host"
                  :value="item.host"
                  :key="item.proxyid"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="hostManagerForm.desc"
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

        </el-tab-pane>
        <el-tab-pane
          label="主机管理"
          name="four"
        >
          <el-form
            :model="hostManagerForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
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
              prop="hostoperation"
            >
              <el-select
                v-model="hostoperation"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  label="查询主机"
                  value="show"
                >
                </el-option>
                <el-option
                  label="禁用主机"
                  value="disable"
                >
                </el-option>
                <el-option
                  label="启用主机"
                  value="enable"
                >
                </el-option>
                <el-option
                  label="删除主机"
                  value="delete"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="hostManagerForm.desc"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('hostManagerForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('hostManagerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
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
  listAllProxies,
} from "@/api/zabbix";
import Log from "@/components/LogShow";

export default {
  components: { Log },
  data () {
    return {
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
      snmpversion: '',
      community: "",
      contextname: "",
      user: "",
      securityLevel: '',
      authprotocol: '',
      authpassphrase: "",
      privprotocol: '',
      privpassphrase: "",
      hostCreateForm: {
        host: "", //创建的主机列表
        proxy: "", // 关联代理,默认空字符即不关联代理
        group: "", //主机组
        template: "", //模版
        type: "", //接入类型
        status: "", //是否启用
        port: "", //端口
      },

      //主机接口管理数据样例
      hostManagerForm: {},

      rules: {
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        type: [{ required: true, message: "请选择接入类型", trigger: "blur" }],
        group: [{ required: true, message: "请关联主机组", trigger: "blur" }],
        host: [{ required: true, message: "请输入ip列表", trigger: "blur" }],
      },
    };
  },
  created () {
    this.getDataSourceList();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then((response) => {
        this.dataSourceOption = response.data.results;
      });
    },
    //主机主机组列表
    getHostGroupList (params) {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        }
        listAllHostGroup(data).then(response => {
          params == "hostCreate" ? this.groupArr = response.data : this.groupArr2 = response.data
          this.groupLoading = false
        })
      }
    },
    //获取模板列表
    getTemplateList (params) {
      if (this.dataSource) {
        const data = {
          dataSource: this.dataSource
        }
        listAllTemplates(data).then(response => {
          params == "hostCreate" ? this.templateArr = response.data : this.templateArr2 = response.data
          this.templateLoading = false
        })
      }
    },
    //获取代理列表
    getProxyList (params) {
      if(this.dataSource){
          const data = {
            dataSource: this.dataSource,
        };
      listAllProxies(data).then((response) => {
        console.log(response);
        params == "hostCreate" ? this.proxyList = response.data : this.proxyList2 = response.data
      });
      }

    },

    handleClick (tab, event) {
      this.dataSource = ""
      console.log(tab, event);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.snmpversion);
          console.log(this.securityLevel);
          const formData = []
          const copyForm = Object.assign({}, this.hostCreateForm)
          if (copyForm.type === "snmp") {
            copyForm.details = this.handleSnmp()
          }
          formData.push(this.validateHost(copyForm)) //处理文本框中的ip,写入hostArr
          const tempData = {
            dataSource: this.dataSource,
            show_field: this.show_field,
            api_version: "5",
            data: formData
          };
          console.log(tempData);

          //向后端发起post请求
          hostCreate(tempData).then(response => {
            console.log(response);
            if (response.code != 0) {
              this.$message({
                showClose: true,
                message: response.message,
                type: 'error'
              });
            } else {
              this.$message({
                showClose: true,
                message: response.data,
                type: 'success'
              });
            }
          })

          // alert('submit!');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    //处理切换接入类型后表单问题
    handleType () {
      console.log(typeof (this.snmpversion));
      this.snmpversion = ''
      // console.log(this.hostCreateForm.type);
      // console.log(this.snmpversion);
      // console.log(this.dataSource);
    },
    //处理表单中host数据, 输入为数组项
    validateHost (formTem) {
      if (formTem.host) {
        let hostArr = []
        formTem.host.split("\n").forEach((element) => {
          hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        });
        let tmepForm = Object.assign({}, formTem)
        tmepForm.host = hostArr
        return tmepForm;
      }
    },

    //处理snmp添加
    handleSnmp () {
      const details = {
        version: this.snmpversion,
        bulk: 1,
      };
      console.log(this.community);
      if (this.snmpversion === '2') {
        details.community = this.community
      } else if (this.snmpversion === '3') {
        if (this.contextname != "") {
          details.contextname = this.contextname;
        }
        details.securityname = this.user;
        details.securityLevel = this.securityLevel
        if (this.securityLevel === '2') {
          details.authprotocol = this.authprotocol;
          details.privprotocol = this.privprotocol;
          details.authpassphrase = this.authpassphrase;
          details.privpassphrase = this.privpassphrase
        } else if (this.securityLevel === '1') {
          details.authprotocol = this.authprotocol;
          details.authpassphrase = this.authpassphrase;
        } else if (this.securityLevel === '0') {

        }
      }
      return details
    }
  },
};
</script>
