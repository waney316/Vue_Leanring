<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>监控项键值管理</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入监控项名称或key"
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
          <el-table-column
            label="所属类型"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="监控项名称"
            prop="name"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="KEY值"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">
              <span>{{ row.key }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="更新时间"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.update_time.split(".")[0] }}</span>
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
            placeholder="请输入监控项名称"
          />
        </el-form-item>

        <el-form-item
          label="KEY"
          prop="key"
        >
          <el-input
            v-model="temp.key"
            placeholder="请输入监控项键值信息"
          />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="temp.type"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button
          type="primary"
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
import { getItemList, updateItem, delItem, createItem } from "@/api/cmdb";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "ItemInfo",
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
      //分类选择
      classifyOption: [],
      temp: {
        // id: undefined,
        name: "",
        key: "",
        type: "",
        remarks: ""
      },
      options: [
        { label: "zabbix", value: "zabbix" },
        { label: "prometheus", value: "prometheus" },
        { label: "其他", value: "other" }
      ],

      //信息
      info: "",
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新监控项",
        create: "添加监控项"
      },
      dialogInfoVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: "监控项名称必须填写", trigger: "blur" }
        ],
        key: [
          { required: true, message: "监控项key必须填写", trigger: "blur" }
        ],
        type: [
          { required: true, message: "监控项须关联数据源类型", trigger: "blur" }
        ]
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
      getItemList(this.listQuery).then(response => {
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

    //添加数据源
    createData () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createItem(this.temp).then(response => {
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
      console.log(this.temp);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // console.log(tempData);
          updateItem(tempData, tempData.id).then(response => {
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
          delItem(row.id).then(response => {
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
