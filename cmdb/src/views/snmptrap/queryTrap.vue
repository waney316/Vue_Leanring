<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>Trap-InfluxDB查询</span>

      </div>
      <transition name="slide-fade">
        <div
          class="text item"
          v-show="show"
        >
          <div class="filter-container">
            <!-- 查询表单 -->
            <template>
              <el-form
                size="small"
                :model="queryForm"
                :rules="rules"
                ref="queryForm"
                label-width="100px"
              >
                <el-row :gutter="24">
                  <el-col :span="6">
                    <el-form-item
                      label="数据源选择"
                      prop="name"
                    >
                      <el-select
                        v-model="queryForm.name"
                        placeholder="请选择查询数据源"
                      >
                        <template v-for="item in dbList">
                          <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      label="时间范围"
                      prop="time"
                    >
                      <el-date-picker
                        v-model="queryForm.time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="center"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      style="margin-left: 20px"
                      label="设备IP"
                      prop="ip"
                    >
                      <el-input v-model="queryForm.ip"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item
                  label="关键字"
                  prop="varbinds"
                >
                  <el-input
                    type="textarea"
                    v-model="queryForm.varbinds"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitForm('queryForm')"
                  >查询</el-button>
                  <el-button @click="resetForm('queryForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </div>
      </transition>
      <div
        style="text-align:center; font-size: 12px"
        @click="show = !show"
      >
        <i
          class="el-icon-arrow-up"
          v-show="show"
        >隐藏查询条件</i>
        <i
          class="el-icon-arrow-down"
          v-show="!show"
        >展开查询条件</i>
      </div>
    </el-card>
    <!-- 展示查询的trap内容 -->
    <el-card style="margin-top: 10px">
      <div
        slot="header"
        class="clearfix"
      >
        <div style="margin-top: 3px; margin-bottom: 15px">
          <span>Trap数据 </span>
          <el-alert
            title="默认返回限制10000条数据"
            type="info"
            show-icon
            style="display: inline; margin-left: 10px; font-size: 15px"
          >
          </el-alert>
        </div>

        <template>
          <el-table
            border
            :data="list"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-form-item label="TRAP时间">
                    <span>{{ props.row.time }}</span>
                  </el-form-item>
                  <el-form-item label="设备IP">
                    <span>{{ props.row.host_ip }}</span>
                  </el-form-item>
                  <el-form-item label="设备名">
                    <span>{{ props.row.host_name }}</span>
                  </el-form-item>
                  <el-form-item label="告警OID">
                    <span>{{ props.row.oid }}</span>
                  </el-form-item>
                  <el-form-item label="TRAP详情">
                    <span>{{ props.row.varbinds }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="生成时间"
              prop="time"
              align="center"
            >
            </el-table-column>
            <el-table-column
              width="120"
              label="设备IP"
              prop="host_ip"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="告警OID"
              prop="oid"
              align="center"
            >
            </el-table-column>
            <el-table-column
              min-width="200"
              label="详情"
              prop="varbinds"
              align="center"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
          </el-table>
        </template>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.size"
          @pagination="getTrapList"
        />

      </div>
    </el-card>

  </div>
</template>

<script>
//分类的增删改查
import {
  getInfluxdb, queryTrapInfo
} from "@/api/trap";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "Influxdb",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      show: true,
      list: null,
      dbList: null,
      listQuery: {
        page: 1,
        size: 20
      },
      listLoading: true,
      total: 0,
      tempForm: "",
      queryForm: {
        time: "",
        host_ip: "",
        host_name: "",
        oid: "",
        varbinds: ""
      },
      rules: {
        name: [
          { required: true, message: "数据源名称必须填写", trigger: "blur" }
        ]
      },

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }

    };
  },
  //页面刷新时执行
  created () {
    this.getList()
  },

  methods: {
    //获取数据源列表
    getList () {
      this.listLoading = true;
      getInfluxdb().then(response => {
        console.log(response.data);
        this.dbList = response.data.results;
        this.listLoading = false;
      });
    },

    //获取trap列表
    getTrapList () {
      console.log(this.tempForm);
      queryTrapInfo(this.tempForm, this.listQuery).then(response => {
        this.list = response.data.results
      })
    },
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp () {
      this.form = {};
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.queryForm)
          Object.keys(obj).forEach(function (key) {
            if (obj[key] == "" || obj[key] === undefined) {
              delete obj[key]
            }
          });
          console.log(this.queryForm);
          this.tempForm = obj
          console.log(this.tempForm);
          queryTrapInfo(this.tempForm).then(res => {
            this.list = res.data.results
            this.total = res.data.count
            console.log(res.data);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      console.log(this.$refs[formName]);
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },

  }
};
</script>
<style>
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