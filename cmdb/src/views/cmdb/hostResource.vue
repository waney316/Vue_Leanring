<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>主机资源</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入IP地址或主机名"
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
            icon="el-icon-circle-plus-outline"
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
          <el-table-column label="ID" align="center" width="120">
            <template slot-scope="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="IP地址" align="center" min-width="100">
            <template slot-scope="{ row }">
              <span>{{ row.ip }}</span>
            </template>
          </el-table-column>

          <el-table-column label="主机名" align="center" width="120">
            <template slot-scope="{ row }">
              <span>{{ row.hostname }}</span>
            </template>
          </el-table-column>

          <el-table-column label="服务标签" align="center" min-width="160">
            <template slot-scope="{ row }">
              <span>{{ row.service_model }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        size="small"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left: 50px"
      >
        <el-form-item label="主机IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入主机资源常用IP" />
        </el-form-item>
        <el-form-item label="关联服务" prop="service_model">
          <el-select
            v-model="form.service_model"
            placeholder="请选择"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in modelGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="配置信息" prop="configuration">
          <el-input v-model="form.configuration" placeholder="请输入配置信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">
          关闭
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//分类的增删改查
import { getHostResource, getModelList } from "@/api/cmdb";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "HostResource",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      model: [],
      modelGroup: [],
      form: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新主机",
        create: "添加主机"
      },
      rules: {
        ip: [
          { required: true, message: "InfluxDB地址必须填写", trigger: "blur" }
        ]
      }
    };
  },
  //页面刷新时执行
  created() {
    this.getList();
    this.getModelGroupList();
  },

  methods: {
    //获取所有服务模型列表
    //获取模型分组列表
    getModelGroupList() {
      getModelList().then(res => {
        this.modelGroup = res.data.results;
        console.log(this.modelGroup);
        this.modelGroup.forEach(element => {
          if (element.models.length > 0) {
            this.model.concat(element.models);
            console.log(this.model);
          }
        });
        console.log(this.model);
      });
    },

    //获取数据源列表
    getList() {
      this.listLoading = true;
      getHostResource(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    resetTemp() {
      this.form = {};
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
    handleUpdate(row) {
      this.form = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
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
    handleDelete(row, index) {
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
