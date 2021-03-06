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
            placeholder="请输入IP地址或标识"
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
          :key="'table' + tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%; margin-top:10px"
        >
          <el-table-column label="IP地址" align="center" width="180">
            <template slot-scope="{ row }">
              <span>{{ row.ip }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资源数据" align="center" width="80">
            <template slot-scope="{ row }">
              <span v-if="!row.data">
                <el-tag type="danger">无</el-tag>
              </span>
              <span v-else>{{ row.data }}</span>
            </template>
          </el-table-column>
          <el-table-column label="配置信息" align="center" width="80">
            <template slot-scope="{ row }">
              <span v-if="!row.configuration">
                <el-tag type="danger">无</el-tag>
              </span>
              <span v-else><el-tag type="success">是</el-tag> </span>
            </template>
          </el-table-column>

          <el-table-column label="服务标签" align="center" min-width="140">
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                v-for="item in row.services"
                :key="'mini' + item.id"
                style="margin-left: 10px"
                >{{ item.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="标识" align="center" width="160">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(item, index) in row.tag"
                :key="'info' + index"
                type="info"
                size="mini"
                style="margin-left: 10px"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            min-width="100"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                class="el-icon-edit"
                type="primary"
                size="mini"
                @click="filedUpdate(row)"
              >
                服务字段
              </el-button>
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

    <!-- 主机资源编辑 -->
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
            v-model="updateServices"
            placeholder="请选择"
            multiple
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in models"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-select
            v-model="form.tag"
            placeholder="请输入标签"
            multiple
            style="width: 100%"
            filterable
            allow-create
          >
          </el-select>
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

    <!-- 关联服务字段编辑 -->
    <el-drawer
      size="35%"
      custom-class="overflow-auto"
      title="关联服务字段编辑"
      :visible.sync="drawer"
      :direction="direction"
    >
      <el-form
        ref="filedsForm"
        :model="filedsForm"
        size="mini"
        label-position="left"
        label-width="120px"
        style="width: 80%; margin-left: 50px"
      >
        <template v-for="service in hostFileds">
          <div :key="service.id">
            <div class="field-header">
              <span>{{ service.name }}</span>
            </div>
            <div class="field-form" v-if="service.fields.length > 0">
              <template v-for="field in service.fields">
                <el-form-item
                  :label="field.cname"
                  :key="field.id"
                  :rules="[{ required: field.required, message: '字段必填' }]"
                >
                  <el-input :placeholder="field.type"></el-input>
                </el-form-item>
              </template>
            </div>
            <div v-else><span>无字段</span></div>
          </div>
        </template>

        <el-form-item style="margin-top: 3px" size="medium">
          <el-button @click="drawer = false" type="danger">
            取消
          </el-button>
          <el-button type="primary">
            立即创建
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
//分类的增删改查
import {
  getHostResource,
  delHostResource,
  createHostResource,
  updateHostResource,
  getHostDetail,
  getModelList
} from "@/api/cmdb";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "HostResource",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      testService: ["zabbix_proxy", "zabbix_server", "mysql"],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      models: [],
      hostFileds: [],
      filedsForm: {},
      updateServices: [],
      form: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新主机",
        create: "添加主机"
      },
      rules: {
        ip: [{ required: true, message: "主机IP地址必须填写", trigger: "blur" }]
      },

      drawer: false,
      direction: "rtl"
    };
  },
  //页面刷新时执行
  created() {
    this.getList();
    this.modelList();
  },

  methods: {
    //获取所有服务模型列表
    //获取模型分组列表
    modelList() {
      getModelList().then(res => {
        this.models = res.data.results;
        console.log(this.models);
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
          createHostResource(this.form).then(response => {
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
      this.updateServices = [];
      this.form = Object.assign({}, row); // copy obj
      this.form.services.forEach(ele => {
        this.updateServices.push(ele.id);
      });
      console.log(this.updateServices);

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
          tempData.services = this.updateServices;
          updateHostResource(tempData.id, tempData).then(response => {
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
      this.$confirm("此操作将删除该主机资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delHostResource(row.id).then(response => {
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

    //服务模型字段编辑
    filedUpdate(row) {
      this.drawer = true;
      this.hostFileds = row.services;
      console.log(this.hostFileds);
    }
  }
};
</script>

<style scoped>
.field-header > span {
  color: #909399;
  font-size: 15px;
  line-height: 10px;
  padding: 20px;
  font-weight: bold;
  text-align: left;
  display: block;
}

.field-form {
  outline: 1px white dashed;
  outline-offset: -10px;
  border-radius: 4%;
}
</style>
