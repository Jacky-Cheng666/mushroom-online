<template>
  <div class="study-container">
    <div class="study-item" v-for="item in studyProgresses" :key="item.sid">
      <img :src="item.icon" alt />
      <div class="meta">
        <p class="title">{{item.title}}</p>
        <p class="progress">已学习{{item.study_hour}}课时/{{item.total_hour || 0}}课时</p>
      </div>
      <div class="circle">
        <!-- 进度条模块 -->
        <circle
          ref="circleRef"
          :canvasId="item.sid"
          :progress="item.study_progress"
          :width="55"
          :height="55"
        ></circle>
      </div>
    </div>
    <div v-if="isEmpty">
      <p class="no-study-tip">您还没有任何学习记录哦，赶快去学习吧~</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import circle from "@/components/circle/index.vue";
import uniRequest from "@/utils/uniRequest";
export default {
  components: {
    circle
  },
  data() {
    return {
      studyProgresses: []
    };
  },
  async onShow() {
    let res = await uniRequest({
      url: "study/progress"
    });
    console.log(res);
    this.studyProgresses = res.data.message;

    // 绘制进度条
    Vue.nextTick(() => {
      if (this.$refs.circleRef) {
        this.$refs.circleRef.forEach(node => {
          node.drawProgress();
        });
      }
    });

    // ------------------
  }
};
</script>

<style lang="less" scoped>
.study-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 32rpx;
  align-items: center;
  position: relative;
}
.study-item {
  margin-top: 32rpx;
  background-color: #fff;
  border-radius: 12rpx;
  width: 686rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  img {
    width: 108rpx;
    height: 108rpx;
    margin-left: 50rpx;
  }
  .meta {
    flex: 1;
    margin-left: 50rpx;
    .title {
      font-size: 30rpx;
      color: #333333;
    }
    .progress {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #a8a8a8;
    }
  }
  .circle {
    width: 109rpx;
    height: 109rpx;
    margin-right: 56rpx;
  }
}
.no-study-tip {
  margin-top: 500rpx;
  font-size: 15px;
}
</style>