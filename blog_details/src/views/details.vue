<template>
  <div>
    <el-container>
      <el-header>穆斯林的葬礼</el-header>
      <!-- 博客作者 -->
      <div class="blog_author">
        <span>作者:王者</span>
        <span style="margin-left: 15px;">阅读量:999</span>
        <span style="margin-left: 15px;">时间:2021-04-12 19:45:01</span>
      </div>
      <!-- 博客详情内容 -->
      <el-card class="box-card" shadow="hover">
        <div class="blog_details_content" v-html="content"></div>
      </el-card>
      <el-divider><i class="el-icon-mobile-phone"></i></el-divider>

      <div class="blog_details_comment">
        <el-card shadow="hover">
          <span style="font-size: 18px; font-weight: bold; color:#303133; display: block; margin-bottom: 5px">发表评论</span>
          <el-input
            type="textarea"
            :rows="2"

            placeholder="请输入内容"
            v-model="commitValue">
          </el-input>
          <el-button type="primary" style="margin-top: 5px" @click="addComment">提交</el-button>
        </el-card>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>

        <el-card class="box-card" style="background: #FFFFFF" shadow="hover">
          <span style="font-size: 18px; font-weight: bold; color:#303133; display: block; margin-bottom: 8px">目前评论</span>
          <el-timeline :reverse="reverse" style="">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '<h1>测试发表</h1><p>古都京华老字号玉器行“奇珍斋”的梁亦清，原是回族底层的琢玉艺人，他家有两个女儿，长女君璧和次女冰玉。长女君璧很善心计，次女冰玉温柔善良，却也是敢爱敢恨。本书主人公韩子奇父母双亡成为孤儿，被吐罗耶定遇到取名易卜拉欣 ,并一路带着他，准备带他一起去克尔白朝觐 。当他们来到北京时，又渴又饿，因秉承着“天下回回是一家”的想法，吐罗耶定带着少年易卜拉欣走进了梁亦平的奇珍斋。</p><p>奇珍斋主人梁亦清热情招待，同时也被吐罗耶定的真诚所打动。少年易卜拉欣在接过君璧递来的水时，一连喝了几大碗，才稍稍稳定下来表示感谢。他被琳琅满目的玉吸引，更是对着一只玉碗爱不释手，谁知一个不小心摔碎了梁亦清做的碗。万分惭愧之下，他决定留下当学徒，来做为摔破碗的补偿。</p>',
      commitValue: '',
      reverse: true,
      activities: []
    }
  },
  // 页面渲染前存在
  mounted () {
    this.activities.push({
      content: '页面渲染前数据测试',
      timestamp: '2021/04/12'
    })
  },

  // 添加评论
  methods: {
    addComment () {
      this.activities.push({
        content: this.commitValue,
        timestamp: new Date().toLocaleString()
      })
    }
  }
}
</script>

<style>

  .el-header, .el-footer {
    /* background-color: #F2F6FC;
    color: #333; */
    text-align: center;
    line-height: 60px;
    font-size: 20px;
    font-weight: bold;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /* text-align: center; */
    /* line-height: 160px; */
  }

  .blog_author{
    /* background-color: #EBEEF5; */
    color: #333;
    text-align: center;
    margin-bottom: 10px;
    /* line-height: 160px; */
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

</style>
