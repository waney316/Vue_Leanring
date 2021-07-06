<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <el-input
              placeholder="请输入服务名"
              v-model="filterText"
              class="input-with-select"
              size="small"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </div>
          <div class="text item">
            <el-tree
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
          <el-tabs
            v-model="activeName"
            type="border-card"
          >
            <el-tab-pane
              label="资源列表"
              name="first"
            >
              <div
                class="currentDataNull"
                v-if="nodeShow"
              >
                点击左侧树节点，展示相应的资源列表
              </div>
              <div v-else>
                <el-table
                  :data="resourceData.filter(data => !search || data.ip.includes(search))"
                  style="width: 100%"
                  size="small"
                >
                  <el-table-column
                    label="主机地址"
                    prop="ip"
                  >
                  </el-table-column>
                  <el-table-column
                    label="标识"
                    prop="tag"
                  >
                  </el-table-column>
                  <el-table-column align="right">
                    <template
                      slot="header"
                      slot-scope="scope"
                    >
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
            <el-tab-pane
              label="节点信息"
              name="second"
            >
              <div
                class="currentDataNull"
                v-if="nodeShow"
              >
                点击左侧树节点，展示相应的节点列表
              </div>
              <div v-else>
                <el-row>
                  <el-col :span="12"><span>ID：</span>{{ modelFiledData.id }}</el-col>
                  <el-col :span="12"><span>服务名称：</span>{{ modelFiledData.name }}</el-col>
                  <el-col :span="12"><span>服务图标：</span>{{ modelFiledData.icon }}</el-col>
                  <el-col :span="12"><span>标签：</span>{{ modelFiledData.tag }}</el-col>
                </el-row>
                <template v-for="item in modelFiledData.fields">
                  <div>
                    <el-row
                      :key="item.id"
                      :span="24"
                    >
                      <el-col :span="4">标识：{{ item.name }}</el-col>
                      <el-col :span="4">名称：{{ item.cname }}</el-col>
                      <el-col :span="4">模型：{{ item.model }}</el-col>
                      <el-col :span="4">必填：{{ item.required }}</el-col>
                      <el-col :span="4">类型：{{ item.type }}</el-col>
                    </el-row>
                  </div>
                </template>

              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getServiceTree, getServiceResource, getModelDetails } from "@/api/cmdb";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data () {
    return {
      //搜索字段
      filterText: '',
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
  mounted () {
    this.modelList();
  },

  //监听搜索字段
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //获取服务树列表
    modelList () {
      getServiceTree().then(response => {
        this.serviceData = response.data
      });
    },

    //字段过滤
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //选择中节点
    getNodeResource () {
      console.log(this.$refs.tree.getCurrentNode().id);
      var id = this.$refs.tree.getCurrentNode().id
      this.nodeShow = false
      //选中节点时获取关联资源
      getServiceResource({ id: id }).then(res => {
        console.log(res.data);
        if (res.code === 0) {
          this.total = res.data.count
          this.resourceData = res.data.results
        }
        //获取对应服务模型字段信息
        getModelDetails(id).then(res => {
          console.log(res.data);
          this.modelFiledData = res.data
        })

      })
    },
  },


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
</style>
