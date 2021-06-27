<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Alertmanager数据源管理</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入数据源名称或地址"
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
        >
          <el-table-column label="资源池" align="center" width="120">
            <template slot-scope="{ row }">
              <span>{{ row.source_room }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="数据源名称"
            prop="name"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="API地址" align="center" min-width="120">
            <template slot-scope="{ row }">
              <span>{{ row.url }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="API"
            align="center"
            class-name="small-padding fixed-width"
            width="240"
          >
            <template slot-scope="{ row, $index }">
              <el-button-group>
                <el-button
                  type="success"
                  size="mini"
                  @click="reloadService(row.id, 'health')"
                >
                  健康检查
                </el-button>
                <el-button
                  type="success"
                  size="mini"
                  @click="reloadService(row.id, 'reload')"
                >
                  热加载
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="240"
          >
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 80%; margin-left: 50px"
      >
        <el-form-item label="资源池名称" prop="source_room">
          <el-input v-model="temp.source_room" placeholder="请输入资源池名称" />
        </el-form-item>

        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="API地址" prop="url">
          <el-input v-model="temp.url" placeholder="请输入API地址" />
        </el-form-item>
      </el-form>
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//分类的增删改查
import {
  getAlertList,
  updateAlert,
  delAlert,
  createAlert,
  managerAlert
} from "@/api/prom";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "AlertInfo",
  components: { Pagination },
  directives: { waves },
  data() {
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
      //分类选择
      classifyOption: [],
      temp: {
        // id: undefined,
        name: "",
        key: "",
        type: "",
        remarks: ""
      },
      options: [],

      //信息
      info: "",
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新Alertmanager数据源",
        create: "添加Alertmanager数据源"
      },
      dialogInfoVisible: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: "数据源名称必须填写", trigger: "blur" }
        ],
        url: [
          { required: true, message: "数据源API地址必须填写", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  //页面刷新时执行
  created() {
    this.getList();
  },

  methods: {
    //获取数据源列表
    getList() {
      this.listLoading = true;
      getAlertList(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },
    //热加载服务
    reloadService(id, action) {
      if (action == "health") {
        managerAlert(id, { action: action }).then(resposne => {
          this.$message({
            type: "success",
            message: resposne.message
          });
        });
      } else {
        this.$confirm(
          "API操作需要服务配置有web.enable-lifecycle, 否则不会生效！",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            managerAlert(id, { action: action }).then(resposne => {
              console.log(resposne);
              if (action == "reload" && resposne.message == "") {
                this.$message({
                  type: "success",
                  message: "热更新配置成功"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },

    resetTemp() {
      this.temp = {
        remarks: "",
        name: ""
      };
    },

    //新增输入框，校验
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //添加数据源
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createAlert(this.temp).then(response => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      console.log(this.temp);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // console.log(tempData);
          updateAlert(tempData, tempData.id).then(response => {
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
    handleDelete(row, index) {
      // console.log(row, index);  //index:当前列表页的索引顺序值
      this.$confirm("此操作将删除该数据源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAlert(row.id).then(response => {
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
    }
  }
};
</script>
