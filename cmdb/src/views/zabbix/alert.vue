<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span style="margin-top: 3px">告警查询</span>
        <i
          :class="[
            'el-collapse-item__arrow',
            'el-icon-arrow-right',
            showForm ? 'is_active' : 'active'
          ]"
          ref="collapse"
          @click="selectcollapse()"
          style="float: right"
        ></i>
      </div>

      <div class="text item">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          :rules="rules"
          size="mini"
          v-show="showForm"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item
                label="数据源"
                prop="dataSource"
              >
                <el-select
                  v-model="form.dataSource"
                  clearable
                  placeholder="请选择数据源"
                  style="margin-left: 10px"
                  @change="getDataSourceList"
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
            <el-col :span="16">
              <el-form-item label="主机组">
                <el-select
                  v-model="form.groupids"
                  clearable
                  multiple
                  filterable
                  :loading="groupLoading"
                  placeholder="请选择主机组"
                  style="display: block; width: 100%;"
                >
                  <el-option
                    v-for="item in optionGroups"
                    :key="item.groupid"
                    :label="item.name"
                    :value="item.groupid"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="查询IP">
            <el-input
              type="textarea"
              v-model="form.hosts"
              :autosize="{ minRows: 1 }"
            ></el-input>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="时间范围">
                <div class="block">
                  <el-date-picker
                    v-model="selectTime"
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
            <el-col :span="10">
              <el-form-item label="告警级别">
                <el-checkbox-group v-model="form.severities">
                  <el-checkbox label="1">信息</el-checkbox>
                  <el-checkbox label="2">警告</el-checkbox>
                  <el-checkbox label="3">一般严重</el-checkbox>
                  <el-checkbox label="4">严重</el-checkbox>
                  <el-checkbox label="5">灾难</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm('form')"
                >查询</el-button>
                <el-button
                  type="error"
                  @click="resetForm('form')"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card style="margin-top: 5px">
      <div
        slot="header"
        class="clearfix"
      >
        <span style="margin-top: 3px">告警数据 </span>
        <el-alert
          title="由于zabbixAPI限制,默认返回最新2000条数据"
          type="info"
          show-icon
          style="display: inline; margin-left: 10px; font-size: 15px"
        >
        </el-alert>

        <el-button
          type="success"
          style="float: right"
          size="mini"
          icon="el-icon-download"
          @click="handleDownload"
          v-show="showButton"
        >
          导出
        </el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%; margin-top:10px"
      >
        <el-table-column
          label="问题时间"
          prop="clock"
          align="center"
          width="160"
        >
          <template slot-scope="{ row }">
            <span>{{ row.clock | transTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="告警级别"
          align="center"
          width="100"
        >
          <template slot-scope="{ row }">
            <el-tag
              :color="handleSeverity(row)"
              effect="dark"
              type="info"
            >
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="主机"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.host }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="告警名称"
          prop="name"
          align="center"
          min-width="180"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="是否恢复"
          align="center"
          min-width="40"
        >
          <template slot-scope="{ row }">
            <el-tag
              type="danger"
              v-if="row.r_eventid == 0"
            >否</el-tag>
            <el-tag
              type="success"
              v-else
            >是</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="恢复时间"
          align="center"
          width="160"
        >
          <template slot-scope="{ row }">
            <span v-if="row.r_eventid == 0">-</span>
            <span v-else>{{ row.r_clock | transTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
//分类的增删改查
import { getZabbixList, listAlerts, listAllHostGroup } from "@/api/zabbix";

import moment from "moment";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "zabbixAlert",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //是否显示按钮
      showButton: false,
      showForm: true,
      tableKey: 0,
      allAlerts: [],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        //分页向后端传递的参数
        page: 1,
        size: 20
      },
      dialogFormVisible: false,
      groupLoading: true,
      activeName: "1",
      //数据源选择
      dataSourceOption: [],
      optionGroups: "",
      selectTime: [],
      tempForm: [],
      form: {
        dataSource: undefined,
        groupids: [],
        hosts: "",
        severities: []
      },
      downloadLoading: false,

      rules: {
        dataSource: [
          { required: true, message: "数据源须指定", trigger: "blur" }
        ]
      }
    };
  },
  //页面刷新时执行
  created () {
    this.getDataSourceList();
  },

  methods: {
    //是否显示搜索表单
    selectcollapse () {
      this.showForm = !this.showForm;
    },
    // 获取告警列表
    getList () {
      if (this.tempForm) {
        this.listLoading = true;
        //将查询参数传递给后端
        listAlerts(this.listQuery, this.tempForm).then(response => {
          this.list = response.data.results;
          this.total = response.data.count;
          this.listLoading = false;
          //显示删除导出按钮
          this.showButton = true;
          console.log(this.list);
        });
      } else {
        this.showButton = false;
      }
    },

    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        // console.log(response.data)
        this.dataSourceOption = response.data.results;
      });
      this.getHostGroupList();
    },
    //主机主机组列表
    getHostGroupList () {
      if (this.form.dataSource) {
        const data = {
          dataSource: this.form.dataSource
        };
        listAllHostGroup(data).then(response => {
          this.optionGroups = response.data;
          this.groupLoading = false;
        });
      }
    },
    addAlertLevel (level) {
      switch (level) {
        case "未分类":
          return "notclassify";
        case "信息":
          return "infomation";
        case "警告":
          return "warning";
        case "一般严重":
          return "average";
        case "严重":
          return "high";
        case "灾难":
          return "danger";
      }
    },

    handleSeverity (row) {
      console.log(row.severity);
      switch (row.severity) {
        case "未分类":
          return "#97AAB3";
        case "信息":
          return "#7499FF";
        case "警告":
          return "#FFC859";
        case "一般严重":
          return "#FFA059";
        case "严重":
          return "#E97659";
        case "灾难":
          return "#E45959";
      }
    },
    //用于查询
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.getList()
          var obj = this.form;
          var tempForm = {};
          Object.keys(obj).forEach(function (key) {
            // console.log(key, obj[key]);
            if (obj[key].length != 0) {
              tempForm[key] = obj[key];
            }
          });
          //如果时间查询不为空，则分开写入时间
          if (this.selectTime && this.selectTime.length != 0) {
            tempForm["time_from"] = Math.round(this.selectTime[0] / 1000);
            tempForm["time_till"] = Math.round(this.selectTime[1] / 1000);
          }

          //处理hosts
          tempForm.hosts = this.validateHost(this.form);
          this.tempForm = tempForm;
          (this.listQuery = {
            page: 1,
            size: 20
          }),
            this.getList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    //处理表单中host数据, 输入为数组项
    validateHost (formTem) {
      if (formTem.hosts) {
        let hostArr = [];
        formTem.hosts.split("\n").forEach(element => {
          hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        });
        return hostArr;
      }
    },
    //数据导出
    handleDownload () {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "告警时间",
          "告警级别",
          "主机",
          "告警标题",
          "是否恢复",
          "恢复时间"
        ];
        const filterVal = [
          "clock",
          "severity",
          "host",
          "name",
          "r_eventid",
          "r_clock"
        ];

        clearTimeout(this.timer); //清除延迟执行
        const data = this.formatJson(filterVal);
        this.timer = setTimeout(() => {
          //设置延迟执行

          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename:
              "告警数据-" + form.dataSource + "-" + new Date().toISOString()
          });
        }, 1000);
      });
    },
    formatJson (filterVal) {
      listAlerts({ size: this.total }, this.tempForm).then(response => {
        console.log(response.data);
        this.allAlerts = response.data.results;
      });
      return this.allAlerts.map(v =>
        filterVal.map(j => {
          if (j === "clock") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>

<style lang="scss">
.is_active {
  transform: rotate(90deg);
}
.el-table .notclassify {
  font-weight: bold;
  border-radius: 30px;
  background-color: "#97AAB3";
}

.infomation {
  font-weight: bold;
  border-radius: 30px;
  background-color: "#7499FF";
}
.el-table td .cell .warning {
  font-weight: bold;
  border-radius: 30px;
  background-color: "#FFC859";
}
.average {
  font-weight: bold;
  border-radius: 30px;
  background-color: "#FFA059";
}
.high >>> span {
  font-weight: bold;
  border-radius: 30px;
  border: 2px solid salmon;
  background-color: "#E97659" !important;
}
.disaster {
  font-weight: bold;
  border-radius: 30px;
  background-color: "E45959";
}
</style>
