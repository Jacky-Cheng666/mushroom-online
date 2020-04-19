<template>
  <view class="play-container" v-if="course_detail">
    <!-- 1.0 封面图 -->
    <view class="cover_image">
      <video id="myVideo" :src="playingUrl" controls></video>
    </view>
    <!-- 2.0 简介 -->
    <view class="introduction">
      <view class="title-and-info">
        <text class="title">{{course_detail.course.title}}</text>
        <text class="info">
          <text>{{course_detail.course.study_count}}人学过</text>
          <text>难度:{{course_detail?course_detail.course.level:'' | formatLevel}}</text>
          <text>时长:{{course_detail.course.course_duration}}</text>
        </text>
      </view>
      <view class="comment">
        <image @click="evaluate" src="/static/images/evaluate@2x.png" alt />
      </view>
      <!-- <Modal @postComment="postComment" :visible="isShowCommentModal" @close="closeModal">
        <view class="comment-content">
          <textarea v-model="content" placeholder="请输入评论内容哦~" rows="5"></textarea>
        </view>
        <view style="margin-top:10rpx;">
          <text>评分：</text>
          <view style="float:right;margin-right:300rpx;margin-top:-5rpx;">
            <Star @changeScore="getChangeSocre" :readonly="false" />
          </view>
        </view>
      </Modal>-->
    </view>
    <!-- 3.0 课程进度 -->
    <view class="course-progress">
      <view class="title">课程进度</view>
      <view class="catelog-container">
        <view
          @click="playOneVideo(item,index)"
          v-for="(item,index) in course_detail.videos"
          :key="item.id"
          class="course-item"
        >
          <text :class="{'active' : index === playIndex}">{{index+1}}.{{item.name}}</text>
          <text v-if="item.is_study == 1" class="studied">已学习</text>
          <text v-else :class="['time',index === playIndex ? 'active' : '']">{{item.duration}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniRequest from "@/utils/uniRequest";
export default {
  data() {
    return {
      // 课程id
      id: null,
      //课程信息，以及课程下面视频数据
      course_detail: null,
      playingUrl: "", //正在播放的视频url
      // 默认选中哪个课程
      playIndex: 0,
      play_status: 0
    };
  },
  filters: {
    formatLevel(val) {
      if (val == 1) {
        return "初级";
      } else if (val == 2) {
        return "中级";
      } else if (val == 3) {
        return "高级";
      }
    }
  },
  onLoad(option) {
    this.id = option.id;
    this.getPlayInfo();
    // 查询订单支付状态
  },
  methods: {
    // 1，获取播放详情
    async getPlayInfo() {
      let res = await uniRequest({
        url: `course/play/${this.id}`,
        method: "GET"
      });
      console.log(res);
      if (res.data.status == 0) {
        this.course_detail = res.data.message;
        // 第一次加载。默认播放第一个视频。
        this.playingUrl = res.data.message.videos[0].video_url;
        this.play_status = res.data.message.course.status;
      }
    },
    // 2，获取订单支付状态
    queryPayStatus() {
      return new Promise(async (resolve, reject) => {
        let res = await uniRequest({
          url: "order/paystatus",
          data: {
            course_id: this.id
          }
        });
        // console.log("订单支付状态", res);
        if (res.data.pay_status == 1) {
          // 已支付
          // console.log("已支付");
          resolve(true);
        } else {
          // 未支付
          resolve(false);
        }
      });
    },
    // 3，点击播放每一个课程事件
    async playOneVideo(item, index) {
      this.playIndex = index;
      // 判断播放鉴权
      const payStatus = await this.queryPayStatus();
      // console.log(payStatus);
      if (payStatus) {
        // 已经支付过
        this.playingUrl = item.video_url;
        const videoContext = uni.createVideoContext("myVideo");
        // videoContext获取可能需要一点时间，加一个定时器，延迟播放。
        this.$nextTick(() => {
          //就是相当于延时函数
          videoContext.play();
        });
        // 记录学习进度
        let result = await uniRequest({
          url: "study/video",
          method: "POST",
          data: {
            course_id: this.id,
            video_id: item.id
          }
        });
        if (result.data.status == 0) {
          // console.log(item);
          item.is_study = 1;
        }
      } else {
        uni.showModal({
          title: "温馨提示",
          content: "您还没有购买课程，请先购买",
          confirmText: "去支付",
          confirmColor: "#fd8d4c",
          success: res => {
            if (res.confirm) {
              // 跳转到支付页面
              const {
                title,
                cover_image_url,
                price
              } = this.course_detail.course;
              uni.navigateTo({
                url: `/pages/pay/index?id=${this.id}&title=${title}&price=${price}&cover_image_url=${cover_image_url}`
              });
            } else if (res.cancel) {
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.play-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 750rpx;
      height: 434rpx;
    }
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: -10rpx;
    border-radius: 16px 16px 0px 0px;
    border-bottom: 1px solid #f5f5f5;
    left: 0;
    right: 0;
    height: 192rpx;
    background-color: #ffffff;
    padding: 38rpx 32rpx;
    display: flex;
    align-items: center;
    .title-and-info {
      flex: 1;
      .title {
        color: #343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-top: 12rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #818181;
        font-size: 12px;
        display: block;
        text {
          padding-right: 15rpx;
        }
        text:nth-child(2),
        text:nth-child(3) {
          padding-left: 15rpx;
        }
        text:nth-child(2) {
          position: relative;
          &::before {
            position: absolute;
            content: "";
            background-color: #ebebeb;
            left: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
          &::after {
            position: absolute;
            content: "";
            background-color: #ebebeb;
            right: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
        }
      }
    }
    .comment {
      margin-top: 32rpx;
      image {
        width: 198rpx;
        height: 80rpx;
      }
    }
  }
  .course-progress {
    margin-top: 222rpx;
    padding: 44rpx 32rpx;
    background-color: #fff;
    .title {
      color: #343434;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 800;
    }
    .catelog-container {
      .course-item {
        display: flex;
        justify-content: space-between;
      }
      text {
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
      }
      .studied {
        float: right;
        margin-top: 16rpx;
        font-size: 10px;
        text-align: center;
        color: #aaaaaa;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        width: 98rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
      .time {
        float: right;
      }
      .active {
        color: #ff5e00;
      }
    }
  }
}
.comment-content {
  label {
    width: 100rpx;
  }
  textarea {
    width: 100%;
    height: 200rpx;
  }
}
</style>