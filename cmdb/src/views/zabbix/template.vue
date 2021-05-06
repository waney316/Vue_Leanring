<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>模板管理</span>
      </div>
      <div class="text item">

        <div class="filter-container">
          <el-select
            v-model="temp.dataSource"
            clearable
            placeholder="请选择数据源"
          >
            <el-option
              v-for="item in dataSourceOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            type="success"
            icon="el-icon-check"
            @click="handleFilter"
            style="margin-left: 5px"
          >
            确认
          </el-button>
          <el-input
            v-model="listQuery.search"
            placeholder="请输入模版名称"
            style="width: 200px; margin-left: 5px"
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
            label="资源池"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.source_room
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="数据源名称"
            prop="name"
            sortable="custom"
            align="center"
            :class-name="getSortClass('name')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="ZabbixAPI地址"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.url
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Zabbix用户"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.user
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
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
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                size="mini"
                @click="handleUpdate(row)"
              >
                导出
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

  </div>
</template>

<script>

//分类的增删改查
import {
  getZabbixList, listTemplate
} from '@/api/zabbix'

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "zabbixTemplate",
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
        size: 10,
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      //s数据源选择
      dataSourceOption: [],
      temp: {
        id: undefined,
        name: "",
        url: "",
        user: "",
        source_room: "",
        remarks: "",
        dataSource: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "添加数据源",
        create: "更新数据源",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: "数据名称须填写", trigger: "blur" },
        ]
      },
      downloadLoading: false,
    };
  },
  //页面刷新时执行
  created () {
    this.getList();
    this.getDataSourceList();
  },

  methods: {
    getList () {
      this.listLoading = true;
      //将查询参数传递给后端
      getZabbixList(this.listQuery).then((response) => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false
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
        name: "",
      };
    },
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        console.log(response.data)
        this.dataSourceOption = response.data.results
        console.log(this.classifyOption)
      })
    },
  
    //数据删除
    handleDelete (row, index) {
      // console.log(row, index);  //index:当前列表页的索引顺序值
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataDict(row.id).then(response => {
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      // console.log(sort);
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
