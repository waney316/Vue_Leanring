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
            :model="ruleForm"
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
              label="接入类型选择"
              prop="createTypeOption"
            >
              <el-select
                v-model="createType"
                clearable
                placeholder="请选择接入类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in createTypeOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主机群组"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item
              label="关联模板"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item
              label="代理"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="ruleForm.desc"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="是否启用"
              prop="delivery"
            >
              <el-switch v-model="ruleForm.delivery"></el-switch>
            </el-form-item>


            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="主机-群组管理"
          name="second"
        >
          <el-form
            :model="ruleForm"
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
                v-model="operationType"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in operationTypeOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主机组选择"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="ruleForm.desc"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="主机-模板管理"
          name="third"
        >
          <el-form
            :model="ruleForm"
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
                v-model="operationType"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in operationTypeOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="模板选择"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="ruleForm.desc"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="主机管理"
          name="four"
        >
          <el-form
            :model="ruleForm"
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
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="ruleForm.desc"
              ></el-input>
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
                  v-for="item in hostoperationOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>



            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>


      </el-tabs>
    </el-card>
  </div>
</template>


<script>
import {
  getZabbixList
} from '@/api/zabbix'
export default {
  data () {
    return {
      dataSource: "",
      dataSourceOption: "",
      //创建接入类型
      createType: "",
      createTypeOption: [
        { "name": "agent", "alais": "agent接入" },
        { "name": "snmp", "alais": "snmp接入" },
      ],
      //操作类型，添加、删除、替换
      operationType: "",
      operationTypeOption: [
        { "name": "add", "alias": "添加" },
        { "name": "replcae", "alias": "替换" },
        { "name": "remove", "alias": "移除" }
      ],
      hostoperation: "",
      hostoperationOption: [
        { "name": "show", "alias": "查询" },
        { "name": "enable", "alias": "启用" },
        { "name": "disable", "alias": "禁用" },
        { "name": "delete", "alias": "删除" }
      ],
      listQuery: "",
      activeName: 'first',
      ruleForm: {
        name: '',
        dataSource: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        dataSource: [
          { required: true, message: '请选择Zabbix数据源', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
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
        // console.log(response.data)
        this.dataSourceOption = response.data.results
        console.log(this.classifyOption)
      })
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
