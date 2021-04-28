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
            v-model="listQuery.title"
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
            添加
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
                row.create_time | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.update_time | parseTime("{y}-{m}-{d} {h}:{i}")
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
                Edit
              </el-button>
              <el-button
                v-if="row.status != 'published'"
                size="mini"
                type="success"
                @click="handleModifyStatus(row, 'published')"
              >
                Publish
              </el-button>
              <el-button
                v-if="row.status != 'draft'"
                size="mini"
                @click="handleModifyStatus(row, 'draft')"
              >
                Draft
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
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
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import axios from 'axios'
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter (type) {
      return calendarTypeKeyValue[type];
    },
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        // id: undefined,
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
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.listLoading = false;
      // fetchList(this.listQuery).then((response) => {
      //   this.list = response.data.items;
      //   this.total = response.data.total;

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false;
      //   }, 1.5 * 1000);
      // });
      axios.get("http://localhost:8000/api/v1/classify").then(response => {
        this.list = response.data.data.list,
          this.total = response.data.data.total
        console.log(response.data);
      })
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
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp () {
      this.temp = {
        remarks: "",
        type_name: "",
      };
    },
    handleCreate () {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";

          axios.post("http://localhost:8000/api/v1/classify", this.temp).then(response => {
            console.log(response.data);
            if (response.data.code === 200) {
              this.$notify({
                title: "成功",
                message: "分类创建成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.$notify({
                title: "失败",
                message: "分类创建失败",
                type: "error",
                duration: 2000,
              })
            }

          }).catct(err => {
            console.log(err);
          })

          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp);
          //   this.dialogFormVisible = false;
          //   this.$notify({
          //     title: "Success",
          //     message: "Created Successfully",
          //     type: "success",
          //     duration: 2000,
          //   });
          // });
        }
      });
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
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
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete (row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleFetchPv (pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload () {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["ID", "分类名称", "创建时间", "更新时间", "备注信息"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson (filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
