<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="model-header">
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="createModelGroupHandle()"
          >
            服务模型分组
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="createModelHandle()"
          >
            服务模型
          </el-button>
        </div>
      </div>
      <template v-for="group in models">
        <div :key="group.id" style="margin-bottom: 10px">
          <div class="model-group-list">
            {{ group.name }}
            <i class="el-icon-edit" @click="updateModelGroupHandle(group)"></i>
            <i
              v-if="group.models.length == 0"
              class="el-icon-delete"
              @click="delModelGroupHandle(group.id)"
            ></i>
          </div>

          <div class="model-list">
            <template v-for="item in group.models">
              <div
                class="model-info"
                :key="item.id"
                @click="toModelDetail(item.id)"
              >
                <i :class="item.icon"></i>
                <div class="model-name">
                  {{ item.name }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </el-card>
    <!-- 服务模型分组  -->
    <el-dialog
      :title="modelGroupMap[modelGroupStatus]"
      :visible.sync="modelGroupFormVisible"
      width="35%"
    >
      <el-form
        :model="modelGroupForm"
        size="small"
        :rules="modelGroupRules"
        ref="modelGroupForm"
      >
        <el-form-item label="分组名称" label-width="120px" prop="name">
          <el-input
            v-model="modelGroupForm.name"
            autocomplete="off"
            placeholder="请输入服务模型分组名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelGroupFormVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitModelGroupForm('modelGroupForm')"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 服务模型 -->
    <el-dialog
      title="添加服务模型"
      :visible.sync="modelFormVisible"
      width="40%"
    >
      <el-form
        :model="modelForm"
        size="small"
        :rules="modelRules"
        ref="modelForm"
      >
        <el-form-item label="服务名称" label-width="120px" prop="name">
          <el-input
            v-model="modelForm.name"
            autocomplete="off"
            placeholder="请输入服务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务分组" label-width="120px" prop="group">
          <el-select
            v-model="modelForm.group"
            placeholder="请选择服务模型分组"
            style="width:100%"
          >
            <el-option
              v-for="item in models"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" label-width="120px" prop="icon">
          <el-input
            v-model="modelForm.icon"
            autocomplete="off"
            placeholder="请输入图标"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" label-width="120px" prop="tag">
          <el-select
            v-model="modelForm.tag"
            multiple
            filterable
            allow-create
            default-first-option
            size="small"
            placeholder="请输入服务模型标签"
            style="width: 100%"
          >
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelFormVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitModelForm('modelForm')"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getModelGroupList,
  createModelGroup,
  updateModelGroup,
  deleteModelGroup,
  createModel,
  updateModel,
  deleteModel
} from "@/api/cmdb";
export default {
  data() {
    return {
      listQuery: {},
      models: [],

      //模型分组数据
      modelGroupForm: {},
      modelGroupStatus: "create",
      modelGroupFormVisible: false,
      modelGroupMap: {
        create: "创建服务模型分组",
        update: "更新服务模型分组"
      },
      modelGroupRules: {
        name: [
          { required: true, message: "请输入服务模型分组名称", trigger: "blur" }
        ]
      },

      modelForm: {},
      modelStatus: "create",
      modelFormVisible: false,
      modelRules: {
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        group: [
          { required: true, message: "请输入服务模型分组", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.modelList();
  },
  mounted() {},
  methods: {
    //新增服务模型分组
    createModelGroupHandle() {
      this.modelGroupFormVisible = true;
      this.modelGroupStatus = "create";
      this.$nextTick(() => {
        this.$refs["modelGroupForm"].clearValidate();
      });
    },
    updateModelGroupHandle(item) {
      this.modelGroupFormVisible = true;
      this.modelGroupStatus = "update";
      this.modelGroupForm = item;
      this.$nextTick(() => {
        this.$refs["modelGroupForm"].clearValidate();
      });
    },
    delModelGroupHandle(id) {
      this.$confirm("是否确认删除该模型分组?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteModelGroup(id).then(res => {
            console.log(res);
            if (res.code === 0) {
              this.modelList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //表单提交
    submitModelGroupForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.modelGroupStatus == "create") {
            createModelGroup(this.modelGroupForm).then(res => {
              this.modelGroupFormVisible = false;
              this.modelList();
              this.$notify({
                type: "success",
                title: "成功",
                message: "新建模型分组成功"
              });
            });
          } else if (this.modelGroupStatus == "update") {
            const data = {
              name: this.modelGroupForm.name
            };
            updateModelGroup(this.modelGroupForm.id, data).then(res => {
              this.modelGroupFormVisible = false;
              this.modelList();
              this.$notify({
                type: "success",
                title: "成功",
                message: "更新模型分组成功"
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //新增服务模型
    createModelHandle() {
      console.log(this.models);
      this.modelForm = {};
      this.modelFormVisible = true;
      this.$nextTick(() => {
        this.$refs["modelForm"].clearValidate();
      });
    },

    submitModelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          createModel(this.modelForm).then(res => {
            this.modelFormVisible = false;
            this.modelList();
            this.$notify({
              type: "success",
              title: "成功",
              message: "新建服务模型成功"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    modelList() {
      getModelGroupList().then(response => {
        console.log(response.data);
        this.models = response.data.results;
      });
    },

    toModelDetail(id) {
      console.log(this.$router);
      this.$router.push({ path: "/cmdb/details", query: { id: id } });
    }
  }
};
</script>

<style scoped>
.model-title {
  display: inline-block;
  width: 4px;
  height: 15px;
  vertical-align: middle;
  margin: 0 10px 0 0;
  background: #c3cdd7;
}
.model-group-list {
  font-size: 14px;
  color: #999;
  border-left: 2px solid #ccc;
  padding-left: 5px;
}

.model-group-list:hover i {
  display: inline;
}

.model-group-list > i {
  margin-left: 10px;
  cursor: pointer;
  display: none;
}

.model-info {
  width: calc(20% - 20px);
  height: 70px;
  border: 1px solid #dde4eb;
  border-radius: 4px;
  margin-left: 14px;
  margin-top: 20px;
  cursor: pointer;
  display: inline-block;
}
.model-info > i {
  float: left;
  width: 66px;
  text-align: center;
  font-size: 32px;
  color: #3a84ff;
  line-height: 68px;
}

.model-name {
  margin: 20px 0 0px 5px;
  line-height: 20px;
  font-size: 15px;
  text-align: center;
}
</style>
