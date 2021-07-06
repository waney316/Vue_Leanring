<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-input
              placeholder="请输入服务名"
              v-model="filterText"
              class="input-with-select"
              size="small"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="text item">
            <el-tree
              highlight-current
              class="filter-tree"
              :data="serviceData"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="getNodeResource"
              ref="tree"
            ></el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div>
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="资源列表" name="first">
              <div class="currentDataNull" v-if="nodeShow">
                点击左侧树节点，展示相应的资源列表
              </div>
              <div v-else>
                <el-table
                  :data="
                    resourceData.filter(
                      data => !search || data.ip.includes(search)
                    )
                  "
                  style="width: 100%"
                  border
                  size="small"
                >
                  <el-table-column label="主机地址" prop="ip">
                  </el-table-column>
                  <el-table-column label="标识" prop="tag"> </el-table-column>
                  <el-table-column align="right">
                    <template slot="header" slot-scope="scope">
                      <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.size"
                  @pagination="getNodeResource"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="节点信息" name="second">
              <div class="currentDataNull" v-if="nodeShow">
                点击左侧树节点，展示相应的节点列表
              </div>
              <div v-else>
                <el-row class="tree-node-info">
                  <el-col :span="12">
                    <span>ID: </span> {{ modelFiledData.id }}
                  </el-col>
                  <el-col :span="12">
                    <span>名称: </span> {{ modelFiledData.name }}
                  </el-col>
                  <el-col :span="12">
                    <span>图标: </span> <i :class="modelFiledData.icon"></i>
                  </el-col>
                  <el-col :span="12">
                    <span>标签: </span>
                    <el-tag
                      v-for="(item, index) in modelFiledData.tag"
                      :key="index"
                      >{{ item }}</el-tag
                    >
                  </el-col>
                </el-row>

                <el-table
                  :data="modelFiledData.fields"
                  style="width: 100%; margin-top: 20px"
                >
                  <el-table-column prop="cname" label="字段名称" width="180">
                  </el-table-column>
                  <el-table-column prop="name" label="字段标识" width="180">
                  </el-table-column>
                  <el-table-column prop="type" label="字段类型">
                  </el-table-column>
                  <el-table-column prop="required" label="是否必填">
                    <template slot-scope="scope">
                      <el-tag
                        :type="scope.row.required ? 'success' : 'danger'"
                        disable-transitions
                        >{{ scope.row.required ? "是" : "否" }}</el-tag
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getServiceTree,
  getServiceResource,
  getModelDetails
} from "@/api/cmdb";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      //搜索字段
      filterText: "",
      activeName: "first",
      search: "",

      nodeShow: true,

      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },

      modelFiledData: {},
      serviceData: [],
      resourceData: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted() {
    this.modelList();
  },

  //监听搜索字段
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //获取服务树列表
    modelList() {
      getServiceTree().then(response => {
        this.serviceData = response.data;
      });
    },

    //字段过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //选择中节点
    getNodeResource() {
      var id = this.$refs.tree.getCurrentNode().id;
      this.nodeShow = false;
      //选中节点时获取关联资源
      getServiceResource({ id: id }).then(res => {
        console.log(res.data);
        if (res.code === 0) {
          this.total = res.data.count;
          this.resourceData = res.data.results;
        }
      });
      //获取对应服务模型字段信息
      getModelDetails(id).then(res => {
        this.modelFiledData = res.data;
      });
      //并发请求
      // Promise.all()
    }
  }
};
</script>

<style scoped>
.currentDataNull {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 28px;
  color: #ddd;
}

.tree-node-info > .el-col {
  margin-top: 20px;
}

.tree-node-info > .el-col > span {
  color: #909389;
  margin-right: 15px;
}
</style>
