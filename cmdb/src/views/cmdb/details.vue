<template>
  <div class="app-container">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>字段数据</span>
          <el-button
            style="float: right; padding: 3px 0;margin-left: 15px"
            type="text"
            icon="el-icon-delete"
            v-if="model.fields && model.fields.length === 0"
            @click="deleteModelHanle"
            >删除</el-button
          >
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            icon="el-icon-edit"
            @click="updateModelHandle"
            >编辑</el-button
          >
        </div>
        <div class="text item" style="font-size: 14px;">
          <el-row>
            <el-col :span="12" style="margin-bottom: 15px"
              ><span class="model-info-title">ID: </span>{{ model.id }}</el-col
            >
            <el-col :span="12" style="margin-bottom: 15px"
              ><span class="model-info-title">名称: </span
              >{{ model.name }}</el-col
            >
            <el-col :span="12"
              ><span class="model-info-title">图标: </span>{{ model.icon }}
            </el-col>
            <el-col :span="12"
              ><span class="model-info-title">标签: </span
              ><el-tag
                v-for="item in model.tag"
                :key="item"
                size="small"
                style="margin-left: 5px"
                >{{ item }}</el-tag
              ></el-col
            >
          </el-row>
        </div>
      </el-card>
    </div>

    <div style="margin-top: 20px">
      <el-card>
        <div slot="header" class="clearfix">
          <span>字段管理</span>
        </div>

        <div class="text item">
          <!-- 字段渲染 -->
          <div class="field-list">
            <el-row>
              <template v-for="field in model.fields">
                <el-col :span="4" class="field-col" :key="field.id">
                  <el-button
                    style="height: 55px"
                    plain
                    @click="updateFieldHandle(field)"
                    ><span>{{ field.cname }}</span
                    ><br /><span class="filed-bottom">{{
                      field.name
                    }}</span></el-button
                  >
                </el-col>
              </template>
              <el-col :span="4" class="field-col">
                <el-button
                  style="height: 55px;font-size: 14px; color: #999;"
                  class="field-col"
                  plain
                  icon="el-icon-circle-plus-outline"
                  @click="createFieldHandle(model.id)"
                  >添加字段</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 模型信息编辑 -->
    <el-dialog title="服务模型编辑" :visible.sync="modelShow" width="40%">
      <el-form
        :model="modelForm"
        :rules="modelRules"
        ref="modelForm"
        label-width="65px"
        size="small"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="modelForm.name"
            size="small"
            placeholder="请输入模型名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-select
            v-model="modelForm.group"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in modelGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="modelForm.icon" />
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-select
            v-model="modelForm.tag"
            multiple
            filterable
            allow-create
            default-first-option
            size="small"
            placeholder="请输入模型标签"
            style="width: 100%"
          >
            <el-option
              v-for="item in modelForm.tag"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modelShow = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="submitModelForm('modelForm')"
          size="small"
          >更 新</el-button
        >
      </span>
    </el-dialog>

    <!-- 字段管理 -->
    <el-dialog
      :title="fieldMap[fieldStatus]"
      :visible.sync="fieldShow"
      width="38%"
      top="8vh"
    >
      <el-form
        :model="fieldForm"
        :rules="fieldRules"
        ref="fieldForm"
        label-width="95px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="cname">
          <el-input
            v-model="fieldForm.cname"
            size="small"
            placeholder="请输入字段名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="name">
          <el-input
            v-model="fieldForm.name"
            size="small"
            placeholder="请输入字段名称英文标识"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select
            v-model="fieldForm.type"
            placeholder="请选择字段类型"
            style="width: 100%"
            size="small"
          >
            <el-option label="字符串" value="string"> </el-option>
            <el-option label="整型" value="int"> </el-option>
            <el-option label="布尔" value="boolean"> </el-option>
            <el-option label="JSON" value="json"> </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="必填">
              <el-checkbox v-model="fieldForm.required"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fieldShow = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitFieldForm('fieldForm')"
          >{{ fieldStatus == "create" ? "新建" : "更新" }}</el-button
        >

        <el-button
          type="danger"
          size="small"
          style="float: left"
          v-if="fieldStatus === 'update'"
          @click="deleteFieldHandle(fieldForm.id)"
          >删除</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getModelList,
  getModelDetails,
  updateModel,
  deleteModel,
  createField,
  updateField,
  delField
} from "@/api/cmdb";

export default {
  data() {
    return {
      model: "",
      modelShow: false,
      modelForm: {},
      modelGroup: "",
      //字段
      fieldShow: false,
      fieldForm: {},
      fieldStatus: "create",
      fieldMap: {
        create: "添加字段",
        update: "更新字段"
      },

      fieldRules: {
        name: [
          { required: true, message: "请输入字段英文标识", trigger: "blur" }
        ],
        cname: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择字段类型", trigger: "blur" }]
      },
      modelRules: {
        name: [{ required: true, message: "请输入模型名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getModelData();
    this.getModelGroupList();
  },
  methods: {
    //获取模型分组列表
    getModelGroupList() {
      getModelList().then(res => {
        console.log(res.data);
        this.modelGroup = res.data.results;
      });
    },
    //获取服务模型详情
    getModelData() {
      getModelDetails(this.$route.query.id).then(response => {
        console.log(response.data);
        this.model = response.data;
      });
    },

    //编辑模型
    updateModelHandle() {
      this.modelForm = Object.assign({}, this.model);
      this.modelShow = true;
      this.$nextTick(() => {
        this.$refs["modelForm"].clearValidate();
      });
    },

    //  删除模型
    deleteModelHanle() {
      this.$confirm("确认删除该服务模型?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteModel(this.$route.query.id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //跳转列表页
            this.$router.push({ path: "/cmdb/model" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //添加字段
    createFieldHandle(id) {
      console.log(this.fieldForm);
      this.fieldForm = {
        required: false
      };
      this.fieldShow = true;
      this.fieldStatus = "create";
      this.$nextTick(() => {
        this.$refs["fieldForm"].clearValidate();
      });
    },

    //更新字段
    updateFieldHandle(form) {
      console.log(form);
      this.fieldForm = Object.assign({}, form);
      this.fieldShow = true;
      this.fieldStatus = "update";
      this.$nextTick(() => {
        this.$refs["fieldForm"].clearValidate();
      });
    },

    //删除字段
    deleteFieldHandle(id) {
      this.$confirm("确认删除该字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delField(id).then(res => {
            this.$message({
              type: "success",
              message: "字段删除成功!"
            });
            //跳转列表页
            this.fieldShow = false;
            this.getModelData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //字段表单提交
    submitFieldForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.fieldForm);
          this.fieldForm.model = this.$route.query.id;
          if (this.fieldStatus == "create") {
            createField(this.fieldForm).then(res => {
              this.getModelData();
              this.$refs.fieldForm.resetFields();
              this.fieldShow = false;
              this.$notify({
                type: "success",
                title: "成功",
                message: "添加字段成功"
              });
            });
          } else if (this.fieldStatus == "update") {
            updateField(this.fieldForm.id, this.fieldForm).then(res => {
              this.getModelData();
              this.fieldShow = false;
              this.$notify({
                type: "success",
                title: "成功",
                message: "更新字段成功"
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //模型编辑表单提交
    submitModelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateModel(this.$route.query.id, this.modelForm).then(res => {
            this.getModelData();
            this.modelShow = false;
            this.$notify({
              type: "success",
              title: "成功",
              message: "更新模型成功"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.model-info-title {
  color: #999;
}

.model {
  margin-top: 15px;
}

.field-group-list {
  font-size: 14px;
  color: #999;
  border-left: 2px solid #ccc;
  padding-left: 5px;
}

.field-group-list:hover i {
  display: inline;
}

.field-group-list > i {
  margin-left: 10px;
  cursor: pointer;
  display: none;
}

.field-list {
  margin-top: 5px;
}

.field-col {
  padding-left: 10px;
}

.field-col > .el-button {
  width: 100%;
  margin-top: 10px;
}
.filed-bottom {
  line-height: 16px;
  font-size: 12px;
  color: #bfc7d2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 1 15px;
}
</style>
