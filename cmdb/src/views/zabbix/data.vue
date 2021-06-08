<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>数据查询</span>
        <el-button
          type="primary"
          size="mini"
          style="float: right"
          @click="keyManager"
          >监控键值管理</el-button
        >
      </div>

      <transition name="slide-fade">
        <div class="text item" v-show="show">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="数据源" prop="dataSource">
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
            <el-form-item label="监控项" prop="key">
              <el-select
                v-model="form.key"
                clearable
                multiple
                filterable
                placeholder="请选择监控项"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in keyOption"
                  :key="item.key"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="时间范围" prop="time_from">
              <div class="block">
                <el-date-picker
                  v-model="time"
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
            <el-form-item label="查询IP" prop="host">
              <el-input type="textarea" v-model="form.host"></el-input>
            </el-form-item>
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

    <el-dialog title="监控键值管理" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-card style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>查询历史</span>
      </div>
      <div class="text item">
        <template>
          <el-table
            :data="
              tableData.filter(
                data =>
                  !search ||
                  data.name.toLowerCase().includes(search.toLowerCase())
              )
            "
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column label="数据源" prop="task_name" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.task_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="查询时间" prop="create_time" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="查询键值" prop="task_name" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.task_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="任务状态" prop="task_status" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.task_status }}</span>
              </template>
            </el-table-column>

            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"
                />
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  >任务详情</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="handleDelete(scope.$index, scope.row)"
                  >导出</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getLoadDataHistory"
      />
    </el-card>
  </div>
</template>

<script>
import { getZabbixList } from "@/api/zabbix";
import { getTaskHistory } from "@/api/tasks";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      show: true,
      dialogFormVisible: false,
      dialogStatus: "",
      time: "",
      tableData: [],
      search: "",

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      keyOption: [
        { key: "cpu.pused", name: "CPU使用率" },
        { key: "memory.pused", name: "内存使用率" }
      ],
      listLoading: true,

      dialogFormVisible: false,
      dialogStatus: "",
      //数据源选择
      dataSourceOption: [],
      downloadLoading: false,

      //查询form
      form: {
        dataSource: "",
        time_from: "",
        time_till: "",
        host: "",
        key: ""
      },
      rules: {
        host: [
          { required: true, message: "主机列表必须填写", trigger: "blur" }
        ],
        dataSource: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ]
      }
    };
  },

  mounted() {
    //刷新页面时获取数据源列表和任务列表
    this.getDataSourceList();
    this.getLoadDataHistory();
  },
  methods: {
    keyManager() {
      this.dialogFormVisible = true;
    },
    getDataSourceList() {
      getZabbixList().then(response => {
        // console.log(response.data)
        this.dataSourceOption = response.data.results;
      });
    },
    //用于查询
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.time_from = this.time[0];
          this.form.time_till = this.time[1];
          console.log(this.form);
          const tempForm = Object.assign({}, this.form);
          tempForm.host = this.validateHost(this.form);
          console.log(tempForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //用户重置
    resetForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].resetFields();
    },
    //处理表单中host数据, 输入为数组项
    validateHost(formTem) {
      if (formTem.host) {
        let hostArr = [];
        formTem.host.split("\n").forEach(element => {
          hostArr.push(element.replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        });
        return hostArr;
      }
    },
    //查询任务列表结果
    getLoadDataHistory() {
      //添加请求属性
      Object.assign(this.listQuery, { task_type: "load_data" });
      console.log(this.listQuery);
      getTaskHistory().then(response => {
        this.total = response.data.count;
        this.tableData = response.data.results;
        console.log(response);
      });
    },

    //根据任务结果生成数据存储
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["Id", "Title", "Author", "Readings", "Date"];
        const filterVal = [
          "id",
          "title",
          "author",
          "pageviews",
          "display_time"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
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
</style>
