<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>主机组管理</span>
      </div>
      <div class="text item">

        <div class="filter-container">
          <span>数据源</span>

          <el-select
            v-model="listQuery.dataSource"
            clearable
            placeholder="请选择数据源"
            style="margin-left: 10px"
            @change="getList"
          >
            <el-option
              v-for="item in dataSourceOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>

          <span style="margin-left: 5px">主机组名称</span>
          <el-input
            v-model="listQuery.name"
            placeholder="请输入主机组名称"
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

          <div style="float: right">
            <el-button type="danger">
              删除
            </el-button>
          </div>

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
            type="selection"
            width="55"
          >
          </el-table-column>

          <el-table-column
            label="主机组ID"
            prop="id"
            sortable="custom"
            align="center"
            :class-name="getSortClass('id')"
            width="100"
          >
            <template slot-scope="{ row }">
              <span>{{ row.groupid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="主机组名称"
            prop="name"
            sortable="custom"
            align="center"
            :class-name="getSortClass('name')"
            min-width="200"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="关联主机"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.hosts }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="模板数量"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.templates }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发现类型"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.flags }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="组类型"
            align="center"
          >
            <template slot-scope="{ row }">
              <span v-if="row.templates!='0'">模板组</span>
              <span v-else>主机组</span>
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
  getZabbixList, listHostGroup
} from '@/api/zabbix'

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "zabbixHostGroup",
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
      //数据源选择
      dataSourceOption: [],
      downloadLoading: false,
    };
  },
  //页面刷新时执行
  created () {
    this.getDataSourceList();
  },

  methods: {
    // 获取模板列表
    getList () {
      this.listLoading = true;
      console.log(this.listQuery);
      //将查询参数传递给后端
      listHostGroup(this.listQuery).then((response) => {
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

    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        // console.log(response.data)
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
