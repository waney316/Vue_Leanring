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
          <span>字段</span>
          <el-input
            v-model="listQuery.title"
            placeholder="Title"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.sort"
            style="width: 140px"
            class="filter-item"
            @change="handleFilter"
          >

          </el-select>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
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
            v-model="showReviewer"
            class="filter-item"
            style="margin-left:15px;"
            @change="tableKey=tableKey+1"
          >
            扩展列
          </el-checkbox>
        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column
            label="主机ID"
            prop="id"
            sortable="custom"
            align="center"
            width="80"
            :class-name="getSortClass('id')"
          >
            <template slot-scope="{row}">
              <span>{{ row.hostid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="主机名"
            width="220px"
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
              <span v-for="(item, index) in row.interfaces" :key="index" >
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
            label="监控状态"
            width="80px"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.available }}</span>
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
            v-if="showReviewer"
            label="Reviewer"
            width="110px"
            align="center"
          >
            <template slot-scope="{row}">
              <span style="color:red;">{{ row.reviewer }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row,$index}">
              <el-button
                type="primary"
                size="mini"
                @click="getDetail(row.hostid)"
              >
                详情
              </el-button>

              <el-button
                v-if="row.status!='deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row,$index)"
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
          :title="textMap[dialogStatus]"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
            label-width="70px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item
              label="Type"
              prop="type"
            >

            </el-form-item>
            <el-form-item
              label="Date"
              prop="timestamp"
            >
              <el-date-picker
                v-model="temp.timestamp"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
            <el-form-item
              label="Title"
              prop="title"
            >
              <el-input v-model="temp.title" />
            </el-form-item>
            <el-form-item label="Status">
              <el-select
                v-model="temp.status"
                class="filter-item"
                placeholder="Please select"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Imp">
              <el-rate
                v-model="temp.importance"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :max="3"
                style="margin-top:8px;"
              />
            </el-form-item>
            <el-form-item label="Remark">
              <el-input
                v-model="temp.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">
              Cancel
            </el-button>
            <el-button
              type="primary"
              @click="dialogStatus==='create'?createData():updateData()"
            >
              Confirm
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
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
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
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    // 过去某个主机详情

    handleDelete (row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv (pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
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
