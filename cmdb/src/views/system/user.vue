<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="updateUserPass"
          >修改密码</el-button
        >
      </div>
      <div class="text item">
        <el-row class="user-info">
          <el-col
            ><span class="user-item">用户昵称：</span>
            {{ $store.state.user.name }}</el-col
          >
          <el-col
            ><span class="user-item">邮箱地址：</span>
            {{ userInfo.email }}</el-col
          >
          <el-col
            ><span class="user-item">是否管理员：</span
            ><el-tag v-if="userInfo.is_superuser">是</el-tag
            ><el-tag v-else>否</el-tag></el-col
          >
          <el-col
            ><span class="user-item">上次登录时间：</span>
            {{ userInfo.last_login }}</el-col
          >
        </el-row>
      </div>
    </el-card>

    <el-dialog
      title="更新用户密码"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form :model="form" size="mini" ref="form" :rules="rules">
        <el-form-item label="新密码" label-width="120px" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitForm('form')" size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, updateUser } from "@/api/user";
export default {
  data() {
    return {
      userInfo: {},
      form: {},
      dialogFormVisible: false,
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      getInfo().then(res => {
        this.userInfo = res.data;
      });
    },

    //修改密码
    updateUserPass() {
      this.form = {};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          updateUser(this.form).then(res => {
            if (res.code == 0 && res.message === "success") {
              this.dialogFormVisible = false;
              this.$store.dispatch("user/logout");
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            } else {
              this.$message.error("更新用户密码失败");
            }
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
.user-info > .el-col {
  margin-top: 25px;
}
.user-item {
  color: #909399;
}
</style>
