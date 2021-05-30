<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>告警查询</span>
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

          <span style="margin-left: 15px">告警</span>
          <el-input
            v-model="listQuery.name"
            placeholder="请输入告警名称或主机"
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
            v-show="showButton"
          >
            <el-button
              type="success"
              icon="el-icon-upload"
            >
              导出
            </el-button>
          </div>
        </div>
        <div v-if="listQuery.dataSource !== ''">
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
                  icon="el-icon-edit"
                >
                  编辑
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
        <div
          v-else
          style="text-align: center; font-size: 20px; padding-top: 30px; padding-bottom: 30px"
        >
          请选择数据源，来加载数据
        </div>

      </div>
    </el-card>

    <el-dialog
      title="更新模版名称"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left: 50px"
      >

        <el-form-item
          label="模版名称"
          prop="name"
        >
          <el-input
            v-model="temp.name"
            placeholder="请输入模版名称"
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
          @click="updateTemplate()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

//分类的增删改查
import {
  getZabbixList, listTemplate, delTemplate, updateTemplate
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

      //是否显示按钮
      showButton: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //分页向后端传递的参数
        page: 1,
        size: 10,
        dataSource: ""
      },
      dialogFormVisible: false,
      //数据源选择
      dataSourceOption: [],
      temp: {
        name: undefined
      },
      downloadLoading: false,

      rules: {
        name: [
          { required: true, message: "模板名称必须填写", trigger: "blur" },
        ],
      },
    };
  },
  //页面刷新时执行
  created () {
    this.getDataSourceList();
  },

  methods: {
    // 获取模板列表
    getList () {
      if (this.listQuery.dataSource) {
        this.listLoading = true;
        //将查询参数传递给后端
        listTemplate(this.listQuery).then((response) => {
          console.log(response);
          console.log(response.data);
          this.list = response.data.results;
          this.total = response.data.count;
          this.listLoading = false
          //显示删除导出按钮
          this.showButton = true
        });
      } else {
        this.showButton = false
      }

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
    //数据更新
    handleUpdate (row) {
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData () {
      const data = {}
      updateTemplate(data).then(response => {
        console.log(response);
      })
    },
    //数据删除
    handleDelete (row, index) {
      if (this.multipleSelection.length === 0) {
        this.$message({
          "message": "必须选中至少一个模板",
          "type": "warning"
        })
      } else {
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
      }


    },
  },
};
</script>
