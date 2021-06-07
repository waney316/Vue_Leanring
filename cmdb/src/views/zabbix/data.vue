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
            <el-form-item label="数据源">
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
            <el-form-item label="监控项">
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

            <el-form-item label="时间范围">
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
            <el-form-item label="查询IP">
              <el-input type="textarea" v-model="form.host"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')"
                >查询并导出</el-button
              >
              <el-button type="error" @click="resetForm('form')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </transition>
      <el-button
        class="el-collapse-item__arrow el-icon-arrow-right"
        @click="show = !show"
        type="mini"
        >隐藏</el-button
      >
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
            style="width: 100%"
          >
            <el-table-column label="数据源" prop="date"> </el-table-column>
            <el-table-column label="查询时间" prop="name"> </el-table-column>
            <el-table-column label="查询键值" prop="name"> </el-table-column>
            <el-table-column label="任务状态" prop="name"> </el-table-column>
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
    </el-card>
  </div>
</template>

<script>
import { getZabbixList } from "@/api/zabbix";

export default {
  data() {
    return {
      show: false,
      dialogFormVisible: false,
      dialogStatus: "",
      time: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
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
    this.getDataSourceList();
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
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
