<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>API日志审计</span>
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

        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%; margin-top:15px"
        >
          <el-table-column
            label="请求IP"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <span>{{ row.remote_ip }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="请求方式"
            align="center"
            width="80"
          >
            <template slot-scope="{ row }">
              <el-tag size="small">{{ row.method }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="请求路径"
            align="center"
            min-width="160"
          >
            <template slot-scope="{ row }">

              <span>{{ row.uri }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Params"
            align="center"
            min-width="80"
          >
            <template slot-scope="{ row }">
              <span>{{ row.query_string }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Body"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.body }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="状态码"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.status_code }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="请求时间"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.create_time }}</span>
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
  getAuditLog
} from "@/api/system";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
export default {
  name: "AuditLog",
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
      getAuditLog(this.listQuery).then(response => {
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









  }
};
</script>
