<template>
  <div>
    <el-container>
      <el-header>王者的个人博客</el-header>
      <el-main>
        <!-- 博客作者 -->
        <div class="blog_author">
          <span>作者:王者</span>
          <span style="margin-left: 15px;">阅读量:999</span>
          <span style="margin-left: 15px;">时间:2021-04-12 19:45:01</span>
        </div>
        <!-- 博客详情内容 -->
        <div class="blog_details_content" v-html="content">

        </div>

        <!-- 评论查看 -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
        <!-- 博客评论 -->
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="commitValue">
        </el-input>
        <el-button type="primary" style="float: right">提交</el-button>

      </el-main>
      <!-- <el-footer>Footer</el-footer> -->

    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '<p>《穆斯林的葬礼》是霍达创作的一部长篇小说，该小说以回族手工匠人梁亦清的玉器作坊奇珍斋升沉起伏为主线，在历史的背景下描写了一个穆斯林的家族，六十年间的兴衰，三代人命运的沉浮，两个发生在不同时代、有着不同内容却又交错扭结的爱情悲剧。冰心如此评价它：看了《穆斯林的葬礼》这本书，就如同走进一个完全新奇的世界。我觉得它是现代中国百花齐放的文坛上的一朵异卉奇花，挺然独立。</p>',
      commitValue: '',
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    font-size: 20px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
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
