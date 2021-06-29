<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>Zabbix数据源</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入数据源名称或URL"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            size="small"
          />

          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            style="margin-left: 5px"
            size="small"
          >
            搜索
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
            size="small"
          >
            新建
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
          @sort-change="sortChange"
        >
          <!-- <el-table-column
            label="ID"
            prop="id"
            sortable="custom"
            align="center"
            :class-name="getSortClass('id')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column> -->

          <el-table-column
            label="资源池"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.source_room }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="数据源名称"
            prop="name"
            sortable="custom"
            align="center"
            width="120"
            :class-name="getSortClass('name')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="ZabbixAPI地址"
            align="center"
            min-width="150"
          >
            <template slot-scope="{ row }">
              <span>{{ row.url }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Zabbix用户"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.user }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="备注"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.remarks }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="240"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                size="mini"
                @click="handleConnect(row.name)"
              >
                测试连接
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>

              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                删除
              </el-button>
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
      </div>
    </el-card>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left: 50px"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="temp.name"
            placeholder="请输入zabbix名称"
          />
        </el-form-item>

        <el-form-item
          label="API地址"
          prop="url"
        >
          <el-input
            v-model="temp.url"
            placeholder="请输入ZABBIX API地址"
          />
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="user"
        >
          <el-input
            v-model="temp.user"
            placeholder="请输入ZABBIX用户"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="temp.password"
            placeholder="请输入ZABBIX用户密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="资源池"
          prop="source_room"
        >
          <el-input
            v-model="temp.source_room"
            placeholder="请输入资源池"
          />
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input
            v-model="temp.remarks"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogFormVisible = false"
          size="small"
        > 关闭 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          size="small"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 登陆验证 -->
    <el-dialog :visible.sync="dialogInfoVisible">
      <el-alert
        title="连接成功"
        type="success"
        show-icon
        :closable="false"
      >
        <h3>API版本：{{ info.api_data }}</h3>
        <h3
          v-for="(val, key, i) in info.user_data"
          :key="i"
        >
          {{ key }}: {{ val }}
        </h3>
      </el-alert>

      <!-- 用户名：{{info.user_data.username}}
      会话过期时间：{{info.user_data.session_time}}
      用户类型：{{info.user_data.privilege}} -->
    </el-dialog>
  </div>
</template>

<script>
//分类的增删改查
import {
  getZabbixList,
  createZabbix,
  updateZabbix,
  deleteZabbix,
  testZabbix
} from "@/api/zabbix";

import waves from "@/directive/waves"; // waves directive
// import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "zabbixInfo",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //分页向后端传递的参数
        page: 1,
        size: 10
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions: [],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      //分类选择
      classifyOption: [],
      temp: {
        // id: undefined,
        name: "",
        url: "",
        user: "",
        password: "",
        source_room: "",
        remarks: ""
      },
      //信息
      info: "",
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新数据源",
        create: "添加数据源"
      },
      dialogInfoVisible: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: "数据名称须填写", trigger: "blur" }],
        url: [{ required: true, message: "API地址须填写", trigger: "blur" }],
        user: [{ required: true, message: "用户名须填写", trigger: "blur" }],
        password: [{ required: true, message: "密码须填写", trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  //页面刷新时执行
  created () {
    this.getList();
  },

  methods: {
    //获取zabbix数据源列表
    getList () {
      this.listLoading = true;
      getZabbixList(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },

    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },

    handleModifyStatus (row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange (data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID (order) {
      if (order === "ascending") {
        this.listQuery.ordering = "+id";
      } else {
        this.listQuery.ordering = "-id";
      }
      this.handleFilter();
    },
    resetTemp () {
      this.temp = {
        remarks: "",
        name: ""
      };
    },

    //新增输入框，校验
    handleCreate () {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //连接zabbix测试
    handleConnect (instance_name) {
      const data = {
        name: instance_name
      };
      console.log(data);
      testZabbix(data).then(response => {
        const response_data = {
          api_data: response.data.api_data.data,
          user_data: response.data.user_data.data
        };
        this.info = response_data;
        console.log(this.info);
        this.dialogInfoVisible = true;
      });
    },
    //添加数据源
    createData () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createZabbix(this.temp).then(response => {
            console.log(response);
            // 如果后端返回的状态码为0,则创建成功
            if (response.code === 0) {
              this.$notify({
                title: "创建成功",
                message: response.message,
                type: "success",
                duration: 2000
              });
              this.dialogFormVisible = false; // 关闭输入框
              this.getList(); //重新获取列表
            } else {
              this.$notify({
                title: "创建失败",
                message: response.data.message,
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },

    //数据更新
    handleUpdate (row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // console.log(tempData);
          updateZabbix(tempData, tempData.id).then(response => {
            console.log(response);
            if (response.code === 0) {
              this.$notify({
                title: "更新成功",
                message: response.message,
                type: "success"
              });
              this.dialogFormVisible = false; //关闭更新输入框
              this.getList(); //重新获取列表
            } else {
              this.$notify({
                title: "更新失败",
                message: response.message,
                type: "failed"
              });
            }
          });
        }
      });
    },

    //数据删除
    handleDelete (row, index) {
      // console.log(row, index);  //index:当前列表页的索引顺序值
      this.$confirm("此操作将删除该数据源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteZabbix(row.id).then(response => {
            console.log(response);
            if (response.code === 0) {
              this.$notify({
                title: "删除成功",
                message: response.message,
                type: "success"
              });
              this.getList();
            } else {
              this.$notify({
                title: "删除失败",
                message: response.message,
                type: "failed"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      // console.log(sort);
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>
