<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>数据分类</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            v-model="listQuery.search"
            placeholder="请输入分类名称"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          </el-select>

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
            icon="el-icon-edit"
            @click="handleCreate"
          >
            新建
          </el-button>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
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
          @sort-change="sortChange"
        >
          <el-table-column
            label="ID"
            prop="id"
            sortable="custom"
            align="center"
            style="width: 10%"
            :class-name="getSortClass('id')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="分类名称"
            prop="type_name"
            sortable="custom"
            align="center"
            :class-name="getSortClass('type_name')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.type_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.create_time
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.update_time
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
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
          label="分类名称"
          prop="type_name"
        >
          <el-input
            v-model="temp.type_name"
            placeholder="请输入分类名称"
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
  </div>
</template>

<script>

//分类的增删改查
import {
  getClassifyList, createClassify, updateClassify, deleteClassify
} from '@/api/cmdb'

import waves from "@/directive/waves"; // waves directive
// import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "Classify",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      excelName: "数据分类",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //分页向后端传递的参数
        page: 1,
        size: 10,
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions: [],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        remarks: "",
        type_name: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新分类",
        create: "创建分类",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type_name: [
          { required: true, message: "分类名称须填写", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  //页面刷新时执行
  created () {
    this.getList();
  },

  methods: {
    getList () {
      this.listLoading = true;
      //将查询参数传递给后端
      getClassifyList(this.listQuery).then((response) => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false;
        // }, 1.5 * 1000);
      });
    },
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
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
        type_name: "",
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
    //数据新建
    createData () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createClassify(this.temp).then((response) => {
            console.log(response);
            // 如果后端返回的状态码为0,则创建成功
            if (response.code === 0) {
              this.$notify({
                title: "创建成功",
                message: response.message,
                type: "success",
                duration: 2000
              })
              this.dialogFormVisible = false // 关闭输入框
              this.getList()   //重新获取列表

            } else {
              this.$notify({
                title: "创建失败",
                message: response.data.message,
                type: "error",
                duration: 2000
              })
            }
          })
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
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          const updateData = {
            "type_name": tempData.type_name,
            "remarks": tempData.remarks
          }
          updateClassify(updateData, tempData.id).then(response => {
            console.log(response);
            if (response.code === 0) {
              this.$notify({
                title: "更新成功",
                message: response.message,
                type: "success"
              })
              this.dialogFormVisible = false //关闭更新输入框
              this.getList()   //重新获取列表
            } else {
              this.$notify({
                title: "更新失败",
                message: response.message,
                type: "failed"
              })
            }
          })
        }
      });
    },

    //数据删除
    handleDelete (row, index) {
      // console.log(row, index);  //index:当前列表页的索引顺序值
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClassify(row.id).then(response => {
          console.log(response);
          if (response.code === 0) {
            this.$notify({
              title: "删除成功",
              message: response.message,
              type: "success"
            })
            this.getList()
          } else {
            this.$notify({
              title: "删除失败",
              message: response.message,
              type: "failed"
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    //数据导出
    handleDownload () {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["ID", "分类名称", "备注信息", "创建时间", "更新时间"];
        const filterVal = [
          "id",
          "type_name",
          "remarks",
          "create_time",
          "update_time",

        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.excelName,
        });
        this.downloadLoading = false;
      });
    },
    formatJson (filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      // console.log(sort);
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
