<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>Trap-InfluxDB 数据源</span>

        <el-button
          icon="el-icon-message"
          type="warning"
          size="mini"
          plain
          style="margin-left: 50px;font-weight: bold"
          @click="tipsDialogVisible = true"
        >snmptrap存储查询说明</el-button>
        </el-alert>

      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入数据源名称或地址"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />

          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            style="margin-left: 5px"
          >
            搜索
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleCreate"
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
        >
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
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="InfluxDB地址"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.host }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Trap存储库名"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.database }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="连接用户"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.user }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="220"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                class="el-icon-edit"
                type="primary"
                size="mini"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>

              <el-button
                class="el-icon-delete"
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
        :model="form"
        size="small"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left: 50px"
      >
        <el-form-item
          label="资源池名称"
          prop="source_room"
        >
          <el-input
            v-model="form.source_room"
            placeholder="请输入资源池名称"
          />
        </el-form-item>

        <el-form-item
          label="数据源名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入数据源名称"
          />
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="14">
            <el-form-item
              label="InfluxDB地址"
              prop="host"
            >
              <el-input
                v-model="form.host"
                placeholder="请输入InfluxDB地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label-width="50px"
              label="端口"
              prop="port"
            >
              <el-input
                v-model="form.port"
                placeholder="请输入连接端口"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="14">

            <el-form-item
              label="用户"
              prop="user"
            >
              <el-input
                v-model="form.user"
                placeholder="请输入连接用户"
              />
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item
              label-width="50px"
              label="密码"
              prop="password"
            >
              <el-input
                type="password"
                :show-password="true"
                v-model="form.password"
                placeholder="请输入连接密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="Database"
          prop="database"
        >
          <el-input
            v-model="form.database"
            placeholder="请输入Database名称"
          />
        </el-form-item>
        <el-form-item
          label="Measurements"
          prop="table"
        >
          <el-input
            v-model="form.table"
            placeholder="请输入Measurements名称"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="基于InfluxDB的snmptrap查询说明"
      :visible.sync="tipsDialogVisible"
      width="30%"
      center
    >
      <p>需要事先在服务器端配置自定义handler</p>
      <p>同事测试influxDB可接收到trap数据</p>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="tipsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="tipsDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//分类的增删改查
import {
  getInfluxdb, delInfluxdb, createInfluxdb, updateInfluxdb
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      form: {},
      tipsDialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新InfluxDB信息",
        create: "添加InfluxDB信息"
      },
      rules: {
        name: [
          { required: true, message: "数据源名称必须填写", trigger: "blur" }
        ],
        host: [
          { required: true, message: "InfluxDB地址必须填写", trigger: "blur" }
        ],
        port: [
          { required: true, message: "端口必须填写", trigger: "blur" }
        ],
        user: [
          { required: true, message: "用户必须填写", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码必须填写", trigger: "blur" }
        ],
        database: [
          { required: true, message: "数据库实例名必须填写", trigger: "blur" }
        ],
        table: [
          { required: true, message: "表名必须填写", trigger: "blur" }
        ],

      },
    };
  },
  //页面刷新时执行
  created () {
    this.getList();
  },

  methods: {
    //获取数据源列表
    getList () {
      this.listLoading = true;
      getInfluxdb(this.listQuery).then(response => {
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



    resetTemp () {
      this.form = {};
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
    //添加数据源
    createData () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.form);
          createInfluxdb(this.form).then(response => {
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
      this.form = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.form);
          updateInfluxdb(tempData.id, tempData).then(response => {
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
      this.$confirm("此操作将删除该数据源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delInfluxdb(row.id).then(response => {
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
    }
  }
};
</script>
