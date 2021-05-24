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
                    @change="getProxyList(dataSource)"
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
                      :value="item.proxyid"
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
              <div v-show="snmpversion==='2'&&snmpversion!=''">
                <el-form-item label="SNMP团体字">
                  <el-input v-model="community"></el-input>
                </el-form-item>
              </div>
            </template>

            <template>
              <div v-show="snmpversion==='3'">
                <el-form-item label="上下文名称">
                  <el-input v-model="context"></el-input>
                </el-form-item>

                <el-form-item label="用户名称">
                  <el-input v-model="user"></el-input>
                </el-form-item>

                <el-form-item label="安全级别">
                  <el-select
                    v-model="securityLevel"
                    placeholder="选择安全级别"
                  >
                    <el-option
                      label="noAuthnoPriv"
                      value="noAuthnoPriv"
                    ></el-option>
                    <el-option
                      label="authNoPriv"
                      value="authNoPriv"
                    ></el-option>
                    <el-option
                      label="authPriv"
                      value="authPriv"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="验证协议"
                  v-show="snmpversion&&(securityLevel==='authNoPriv'||securityLevel==='authPriv')"
                >
                  <el-row :gutter="10">
                    <el-col :span="3">
                      <el-select
                        v-model="authprotocol"
                        placeholder="选择验证协议"
                      >
                        <el-option
                          label="MD5"
                          value="md5"
                        ></el-option>
                        <el-option
                          label="SHA"
                          value="sha"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4.5">
                      <el-input placeholder="请输入验证口令"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item
                  label="隐私协议"
                  v-show="securityLevel==='authPriv'"
                >
                  <el-row :gutter="10">
                    <el-col :span="3">
                      <el-select
                        v-model="privprotocol"
                        placeholder="选择隐私协议"
                      >
                        <el-option
                          label="DES"
                          value="des"
                        ></el-option>
                        <el-option
                          label="AES"
                          value="aes"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4.5">
                      <el-input placeholder="请输入私钥"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>

              </div>
            </template>

            <el-form-item
              label="主机群组"
              prop="group"
            >
              <el-input
                v-model="hostCreateForm.group"
                placeholder="请关联主机群组, 以换行为间隔,不可为空"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="关联模板"
              prop="template"
            >
              <el-input
                v-model="hostCreateForm.template"
                placeholder="请关联模板, 以换行为间隔,可为空"
              ></el-input>
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
              <el-switch v-model="show_field"  active-value="true" inactive-value="false"></el-switch>
            </el-form-item>
            <el-form-item
              label="是否启用"
              prop="status"
            >
              <el-switch v-model="hostCreateForm.status"       active-value="1"     inactive-value="0"></el-switch>
            </el-form-item>
            <el-button
              type="primary"
              @click="submitForm('hostCreateForm')"
            >立即创建</el-button>
            <el-button @click="resetForm('hostCreateForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>


<script>
import {
  getZabbixList, hostCreate, hostTemplate, hostGroup, hostManager, listProxy
} from '@/api/zabbix';
import Log from "@/components/LogShow";

export default {
  components: { Log },
  data () {
    return {
      dataSource: "",
      dataSourceOption: "",
      show_field: "",
      hostArr: [],
      templateArr: [],
      groupArr: [],

      //操作类型，添加、删除、替换
      operationType: "",
      operationTypeOption: [
        { "name": "add", "alias": "添加" },
        { "name": "replcae", "alias": "替换" },
        { "name": "remove", "alias": "移除" }
      ],

      //主机管理接口：查询启用禁用删除
      hostoperation: "",
      hostoperationOption: [
        { "name": "show", "alias": "查询" },
        { "name": "enable", "alias": "启用" },
        { "name": "disable", "alias": "禁用" },
        { "name": "delete", "alias": "删除" }
      ],

      listQuery: "",
      //默认显示第几个tab
      activeName: 'first',
      //代理列表
      proxyList: "",
      //主机新建数据样例
      snmpversion: "",
      community: "",
      context: "",
      user: "",
      securityLevel: "",
      authprotocol: "",
      privprotocol: "",
      hostCreateForm: {
        host: '', //创建的主机列表
        proxy: '', // 关联代理,默认空字符即不关联代理
        group: '',  //主机组
        template: '', //模版
        type: '',  //接入类型
        status: '',  //是否启用
        port: ''    //端口
      },

      //主机接口管理数据样例
      hostManagerForm: {
        name: ""
      },

      rules: {
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择接入类型', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请关联主机组', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入ip列表', trigger: 'blur' }
        ],


      }
    };
  },
  created () {
    this.getDataSourceList();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        this.dataSourceOption = response.data.results
      })
    },

    //获取代理列表
    getProxyList (params) {
      console.log(params);
      const data = {
        "dataSource": params,
      }
      listProxy(data).then(response => {
        this.proxyList = response.data.results
      })

    },

    handleClick (tab, event) {
      console.log(tab, event);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //复制表单
          const tempData = {}
          tempData.data = Object.assign({}, this.hostCreateForm);
          tempData.dataSource = this.dataSource
          tempData.show_field = this.show_field
          this.validateHost(this.hostCreateForm.host)
          tempData.data.host = this.hostArr
          console.log(tempData);
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    //处理切换接入类型后表单问题
    handleType () {
      this.snmpversion = ""
      // console.log(this.hostCreateForm.type);
      // console.log(this.snmpversion);
      // console.log(this.dataSource);
    },
    //处理表单中host数据, 输入为数组项
    validateHost(host){
      host.split("\n").forEach(element => {
        this.hostArr.push(element.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
      });
    }
  }
};
</script>
