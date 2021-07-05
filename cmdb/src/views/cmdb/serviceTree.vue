<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-input
              placeholder="请输入服务名或IP"
              v-model="field"
              class="input-with-select"
              size="small"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="text item">
            <el-tree :data="serviceData" :props="defaultProps"></el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div>
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="资源列表" name="first">
              <div class="currentDataNull">
                点击左侧树节点，展示相应的资源列表
              </div>
            </el-tab-pane>
            <el-tab-pane label="节点信息" name="second">
              <div class="currentDataNull">
                点击左侧树节点，展示相应的节点列表
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getModelGroupList } from "@/api/cmdb";
export default {
  data() {
    return {
      //服务树搜索字段
      field: "",
      activeName: "first",

      serviceData: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.modelList();
  },
  mounted() {},
  methods: {
    modelList() {
      getModelGroupList().then(response => {
        console.log(response.data);
        var data = response.data.results;
        var classifArr = [];
        console.log(this.serviceData);
        data.forEach(element => {
          classifArr.push(element.classify);
        });

        classifArr.forEach(element => {
          this.serviceData.push();
        });
      });
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
</style>
