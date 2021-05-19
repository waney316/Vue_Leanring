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

          <span style="margin-left: 5px">模板名称</span>
          <el-input
            v-model="listQuery.name"
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

          <div
            style="float: right"
            v-show="listQuery.dataSource"
          >
            <el-button
              type="danger"
              @click="handleDelete"
            >
              删除
            </el-button>
            <el-button type="success">
              逐个导出
            </el-button>
            <el-button type="success">
              合并导出
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
          @selection-change="handleSelectionChange"
        >

          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>

          <el-table-column
            label="模板ID"
            prop="id"
            align="center"
            width="100"
          >
            <template slot-scope="{ row }">
              <span>{{ row.templateid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="模板名称"
            prop="name"
            align="center"
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
            label="监控项数"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.items }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="触发器数量"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.triggers }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="自动发现"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.discoveries }}</span>
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
  getZabbixList, listTemplate, delTemplate
} from '@/api/zabbix'

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination



export default {
  name: "zabbixTemplate",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      //多选框选中
      multipleSelection: [],
      templateids: [],
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
      temp: {
        id: undefined,
        dataSource: ""
      },
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
      //将查询参数传递给后端
      listTemplate(this.listQuery).then((response) => {
        console.log(response);
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false
      });
    },

    //搜索查询
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },

    //表格多选框选中
    handleSelectionChange (row) {
      this.multipleSelection = row;
    },
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        // console.log(response.data)
        this.dataSourceOption = response.data.results
      })
    },

    //数据删除
    handleDelete (row, index) {
      console.log(this.multipleSelection);
      this.templateids.length = 0
      //获取到模板id加入templteids
      this.multipleSelection.forEach(element => {
        this.templateids.push(element.templateid)
      });
      const data = {
        "dataSource": this.listQuery.dataSource,
        "templateids": this.templateids
      }
      this.$confirm('此操作将直接删除模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTemplate(data).then(response => {
          console.log(data);
          if (response.code === 0) {
            this.$notify({
              title: "删除成功",
              message: response.message,
              type: "success"
            })
            this.listQuery.name = ""
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
  },
};
</script>
