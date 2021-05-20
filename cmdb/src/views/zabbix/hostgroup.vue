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

          <div
            style="float: right"
            v-show="showButton"
          >
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
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete"
            >
              删除
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
            label="主机组ID"
            prop="id"
            align="center"
            width="100"
          >
            <template slot-scope="{ row }">
              <span>{{ row.groupid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="主机组名称"
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
      <div v-else style="text-align: center; font-size: 20px; padding-top: 30px; padding-bottom: 30px">
        请选择数据源，来加载数据
      </div>

      </div>
    </el-card>
    <el-dialog
      :title="textMap[dialogStatus]"
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
          label="群组名称"
          prop="name"
        >
          <el-input
            v-model="temp.name"
            placeholder="请输入主机组名称"
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
import {
  getZabbixList, listHostGroup, delHostGroup, UpdateHostgroup, createHostGroup
} from '@/api/zabbix'

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "zabbixHostGroup",
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      //多选框选中
      multipleSelection: [],
      groupids: [],
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
      dialogStatus: "",
      showButton: false,
      temp: {
        name: undefined
      },
      textMap: {
        update: "更新主机组名称",
        create: "添加主机组",
      },
      //数据源选择
      dataSourceOption: [],
      downloadLoading: false,
      rules: {
        name: [
          { required: true, message: "主机组名称必须填写", trigger: "blur" },
        ],
      },
    };
  },
  //页面刷新时执行
  created () {
    this.getDataSourceList();
  },

  methods: {
    //表格多选框选中
    handleSelectionChange (row) {
      this.multipleSelection = row;
    },

    // 获取模板列表
    getList () {
      if(this.listQuery.dataSource){
        this.listLoading = true;
        console.log(this.listQuery);
        //将查询参数传递给后端
        listHostGroup(this.listQuery).then((response) => {
          console.log(response.data);
          this.list = response.data.results;
          this.total = response.data.count;
          this.listLoading = false;
          this.showButton = true
        });       
      }else{
        this.showButton = false
      }

    },

    //过滤查询
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },
    //重置
    resetTemp () {
      this.temp = {};
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
      updateHostGroup(data).then(response => {
        console.log(response);
      })
    },
    //主机组新建
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
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createHostGroup(this.temp).then((response) => {
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
      console.log(this.multipleSelection);
      if (this.multipleSelection.length === 0) {
        this.$message({
          "message": '必须选中至少一个主机组',
          "type": "warning"
        });
      } else {
        this.groupids.length = 0
        //获取到模板id加入templteids
        this.multipleSelection.forEach(element => {
          this.groupids.push(element.groupid)
        });
        const data = {
          "dataSource": this.listQuery.dataSource,
          "groupids": this.groupids
        }
        this.$confirm('此操作将直接删除主机组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delHostGroup(data).then(response => {
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
