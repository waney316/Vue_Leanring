<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增图书</span>
      </div>
      <div class="text item">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >

          <el-form-item label="书名" prop="bookName">
            <el-input v-model="ruleForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author"></el-input>
          </el-form-item>
          <el-form-item label="出版社" prop="publisher">
            <el-input v-model="ruleForm.publisher"></el-input>
          </el-form-item>
          <el-form-item label="出版日期" prop="publish_date">
            <el-date-picker v-model="ruleForm.publish_date" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="发行状态" prop="publish_status">
            <el-radio-group v-model="ruleForm.publish_status">
              <el-radio label="已发行"></el-radio>
              <el-radio label="未发行"></el-radio>
            </el-radio-group>
          </el-form-item>
 
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        bookName: "",
        author: "",
        publisher: "",
        publish_date: "",
        publish_status: ""
      },
      rules: {
        bookName: [
          { required: true, message: "请输入图书名称", trigger: "blur" },
        ],
        author: [
          { required: true, message: "请输入作者", trigger: "change" },
        ],
        publish_date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        publisher: [{ required: true, message: "请输入出版社", trigger: "change" },],
        publish_status: [{ required: true, message: "请选择出版状态", trigger: "change" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.$refs[formName]);
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
