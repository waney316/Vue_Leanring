<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>主机管理</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <span>数据源</span>

          <el-select
            v-model="listQuery.dataSource"
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
          <span style="margin-left: 15px">IP地址</span>
          <el-input
            v-model="listQuery.ip"
            placeholder="请输入要查询的主机名或IP地址"
            style="width: 200px;margin-left: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />

          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 5px"
            @click="handleFilter"
          >
            搜索
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
          <el-checkbox
            v-model="showTemplates"
            class="filter-item"
            style="margin-left:10px;"
            @change="tableKey=tableKey+1"
          >
            显示模板
          </el-checkbox>
          <el-checkbox
            v-model="showGroups"
            class="filter-item"
            @change="tableKey=tableKey+1"
          >
            显示群组
          </el-checkbox>
        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 110%; margin-top: 10px"
        >
          <el-table-column
            label="主机ID"
            prop="id"
            align="center"
            width="80"
          >
            <template slot-scope="{row}">
              <span>{{ row.hostid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="主机名"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.host }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="接入IP"
            width="150px"
            align="center"
          >
            <template slot-scope="{row}">
              <span
                v-for="(item, index) in row.interfaces"
                :key="index"
              >
                {{ item.ip }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="监控项"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.items }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="应用集"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.applications }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="触发器"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.triggers }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="是否启用"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="代理"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.proxy_hostid }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTemplates"
            label="关联模板"
            width="220"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag
                size="small"
                v-for="item in row.parentTemplates"
                :key="item.templateid"
                type="info"
              >
                {{ item.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showGroups"
            label="主机群组"
            width="180"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag
                size="small"
                v-for="item in row.groups"
                :key="item.groupid"
                type="info"
              >
                {{ item.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="监控状态"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <el-tag
                size="small"
                :type="showTags(row.available)"
              >
                {{ row.available }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="190"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row,$index}">
              <el-button
                type="primary"
                size="mini"
                @click="getDetail(row,$index)"
                icon="el-icon-message"
              >
                详情
              </el-button>

              <el-button
                v-if="row.status!='deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row,$index)"
                icon="el-icon-delete"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />

        <el-dialog
          :title="title"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            ref="dataForm"
            :model="temp"
            label-position="left"
            label-width="70px"
            :inline="true"
            style="width: 450px; margin-left:50px;"
          >

            <el-form-item
              label="主机名"
              prop="host"
            >
              <el-input
                :value="temp.host"
                :disabled="true"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="主机ID"
              prop="hostid"
            >
              <el-input
                :value="temp.hostid"
                :disabled="true"
                style="width: 30px"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="主机组"
              prop="groups"
            >
              <span v-for="item of temp.groups">
                {{ item.name }}
              </span>
            </el-form-item>
            <el-form-item
              label="接口"
              prop="interfaces"
            >
              <span v-for="item of temp.interfaces">
                接入IP: {{ item.ip }}
                接入类型：{{ item.type}}
                接入端口： {{ item.port }}
              </span>
            </el-form-item>
            <el-form-item
              label="模板"
              prop="parentTemplates"
            >
              <span v-for="item of temp.parentTemplates">
                {{ item.name }}
              </span>
            </el-form-item>
            <el-form-item
              label="类型"
              prop="flags"
            >
              {{temp.flags}}
            </el-form-item>
            <el-form-item
              label="异常"
              prop="error"
            >
              {{temp.error}}
            </el-form-item>
            <el-form-item
              label="异常开始时间"
              prop="error_from"
            >
              {{temp.error_from}}
            </el-form-item>

          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click="dialogFormVisible = false"
              type="success"
            >
              确认
            </el-button>
          </div>
        </el-dialog>

      </div>
    </el-card>
  </div>
</template>

<script>
import {
  listHost, getZabbixList
} from '@/api/zabbix'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'Host',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter (type) {
      return calendarTypeKeyValue[type]
    }
  },
  data () {
    return {

      dataSourceOption: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showTemplates: false,
      showGroups: false,
      // 主机详情信息变量定义
      title: "",
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      downloadLoading: false
    }
  },
  created () {
    this.getDataSourceList();
  },
  methods: {
    //获取数据分类列表
    getDataSourceList () {
      getZabbixList().then(response => {
        // console.log(response.data)
        this.dataSourceOption = response.data.results
        console.log(this.classifyOption)
      })
    },
    //获取主机列表
    getList () {
      this.listLoading = true
      listHost(this.listQuery).then(response => {
        console.log(response);
        this.list = response.data.results
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    //主机状态tag选择
    showTags (val) {
      if (val === "未知") {
        return "info"
      } else if (val === "正常") {
        return "success"
      } else if (val === "异常") {
        return "danger"
      }
    },

    //过滤查询
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },

    //获取单个主机详情
    getDetail (row) {
      this.temp = Object.assign({}, row); // copy obj
      this.title = this.temp.host + " 主机详情"
      console.log(this.temp);
      this.dialogFormVisible = true
    },
    //删除单个主机
    handleDelete (row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },

    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
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
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
