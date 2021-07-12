<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>PromQL数据查询</span>
      </div>

      <transition name="slide-fade">
        <div class="text item" v-show="show">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            :rules="rules"
            size="small"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item label="数据源" prop="name">
                  <el-select
                    v-model="form.name"
                    clearable
                    placeholder="请选择数据源"
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
              </el-col>
              <el-col :span="7">
                <el-form-item label="查询类型" prop="method">
                  <el-select
                    v-model="form.method"
                    clearable
                    placeholder="请选择查询类型"
                    style="margin-left: 10px"
                  >
                    <el-option
                      v-for="item in methodOption"
                      :key="item.key"
                      :label="item.name"
                      :value="item.key"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="时间范围"
                  prop="time"
                  v-if="form.method === 'query_range'"
                >
                  <div class="block">
                    <el-date-picker
                      v-model="form.time"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      value-format="timestamp"
                      align="right"
                    >
                    </el-date-picker>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-form-item
              label="监控项"
              prop="key"
            >
              <el-select
                v-model="form.key"
                clearable
                allow-create
                filterable
                placeholder="请选择监控项或手动输入"
                style="margin-left: 10px; width: 50%"
              >
                <el-option
                  v-for="i in itemData"
                  :key="i.id"
                  :label="i.name"
                  :value="i.key"
                >
                </el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item
              label="查询IP"
              prop="hosts"
            >
              <el-input
                type="textarea"
                v-model="form.hosts"
              ></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')"
                >创建查询</el-button
              >
              <el-button type="danger" @click="resetForm('form')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </transition>
      <div style="text-align:center; font-size: 12px" @click="show = !show">
        <i class="el-icon-arrow-up" v-show="show">隐藏查询条件</i>
        <i class="el-icon-arrow-down" v-show="!show">展开查询条件</i>
      </div>
    </el-card>

    <!-- 查询告警规则文件 -->
    <el-card style="margin-top: 10px" v-if="rulesStatus">
      <template v-for="(rule, index) in rulesData">
        <div :key="index" style="margin-top: 10px">
          <div class="rule-header">
            <span>告警规则分组：{{ rule.name }}</span>
            <span>规则文件路径：{{ rule.file }}</span>
            <span>规则匹配周期：{{ rule.interval }}</span>
          </div>

          <el-table :data="rule.rules" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  border
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-row>
                    <template v-for="(item, key, index) in props.row.labels">
                      <el-col :span="6" :key="index">
                        <el-form-item :label="key">
                          <span>{{ item }}</span>
                        </el-form-item>
                      </el-col>
                    </template>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="规则名称" prop="name" min-width="160">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="表达式"
              prop="query"
              min-width="120"
            >
            </el-table-column>
            <el-table-column label="采集周期" prop="duration">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="告警描述"
              prop="annotations.summary"
            >
            </el-table-column>
            <el-table-column label="健康检查" prop="health" min-width="160">
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-card>

    <!-- 查询告警数据 -->
    <el-card style="margin-top: 10px" v-if="alertsStatus">
      <!-- 告警展示 -->
      <div>
        <el-table :data="alertsData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form
                border
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-row>
                  <template v-for="(item, key, index) in props.row.labels">
                    <el-col :span="6" :key="index">
                      <el-form-item :label="key">
                        <span>{{ item }}</span>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="告警时间" prop="activeAt" min-width="160">
          </el-table-column>
          <el-table-column
            label="告警实例"
            prop="labels.instance"
            min-width="120"
          >
          </el-table-column>
          <el-table-column label="告警分组" prop="labels.job">
          </el-table-column>
          <el-table-column label="状态" prop="state"> </el-table-column>
          <el-table-column
            label="告警描述"
            prop="annotations.summary"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="告警值" prop="annotations.value">
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.size"
          @pagination="getList"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getPromList,
  getPromActionList,
  promQuery,
  alertQuery
} from "@/api/prom";
import { getItemList } from "@/api/cmdb";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      form: {
        name: "", //prometheus数据源名称
        key: "" //查询键值
      },
      total: undefined,
      listQuery: {
        page: 1,
        size: 10
      },
      show: true,
      dataSourceOption: "",
      itemData: "",
      methodOption: "",
      pickerOptions: "",
      rules: {
        name: [{ required: true, message: "请选择数据源", trigger: "blur" }],
        method: [
          { required: true, message: "请选择查询类型", trigger: "blur" }
        ],
        key: [{ required: true, message: "请输入查询键值", trigger: "blur" }],
        time: [{ required: true, message: "必须选择时间范围", trigger: "blur" }]
      },
      textarea: "",
      //存储告警数据
      alertsData: [],
      alertsStatus: false,

      //存储规则数据
      rulesData: [],
      rulesStatus: false,

      //查询配置文件
      configStatus: false
    };
  },

  mounted() {
    //页面挂载时获取所有数据源和prometheus对应的监控项键值
    this.getDataSourceList();
    this.getPromItemList();
    this.getActionList();
  },
  methods: {
    //获取promethues数据源
    getDataSourceList() {
      getPromList().then(response => {
        if (response.code === 0) {
          this.dataSourceOption = response.data.results;
        }
      });
    },

    //获取监控键值
    getPromItemList() {
      getItemList({ type: "prometheus" }).then(response => {
        this.itemData = response.data.results;
      });
    },

    //获取查询方法集
    getActionList() {
      getPromActionList().then(response => {
        this.methodOption = response.data.results;
      });
    },

    //处理告警数据
    handleAlertsData(data) {
      this.alertsStatus = true;
      this.alertsData = data;
    },

    handleRulesData(data) {
      this.rulesStatus = true;
      this.rulesData = data;
    },

    getList() {
      queryTrapInfo(this.form, this.listQuery).then(response => {
        this.alertsData = response.data.results;
      });
    },
    //提交查询表单
    submitForm(formName) {
      this.rulesStatus = this.configStatus = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form.method);
          promQuery(this.form).then(response => {
            var res = response.data.results;
            //判断数据返回类型
            if (this.form.method == "alerts") {
              this.total = response.data.count;
              this.handleAlertsData(res);
            } else if (this.form.method == "rules") {
              this.handleRulesData(res);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.rule-header {
  font-size: 14px;
  color: #999;
  border-left: 2px solid #ccc;
  padding-left: 5px;
}
.rule-header span {
  margin-top: 8px;
  display: block;
}
</style>
