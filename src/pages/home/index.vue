<template>
  <view class="home-container">
    <!-- 搜索框 -->
    <!-- <search-bar placeholder="请输入课程的名称"></search-bar> -->
    <searchBar placeholder="搜索课程"></searchBar>
    <!-- 轮播图 -->
    <swiper indicator-dots circular autoplay indicator-active-color="#fff" :interval="3000">
      <navigator
        :url="'/pages/course-detail/index?id='+item.course_id"
        v-for="item in swipers"
        :key="item.id"
      >
        <swiper-item>
          <image :src="item.img_url" />
        </swiper-item>
      </navigator>
    </swiper>
    <!-- 推荐课程 -->
    <view>
      <view class="tips">
        <text>推荐课程</text>
        <image @click="goToCoursePage" src="/static/images/arrow@2x.png" alt />
      </view>
      <scroll-view scroll-x class="course-container">
        <navigator
          :url="'/pages/course-detail/index?id='+item.relation_id"
          class="course-item"
          v-for="item in courses"
          :key="item.id"
        >
          <image :src="item.icon" alt />
        </navigator>
      </scroll-view>
    </view>
    <!-- 热门视频 -->
    <view>
      <view class="tips">
        <text>热门视频</text>
        <image @click="goToCourseDetail(3)" src="/static/images/arrow@2x.png" alt />
      </view>
      <view class="hot-video">
        <navigator
          :url="'/pages/course-detail/index?id='+item.course_id"
          class="video-item"
          v-for="item in videos"
          :key="item.id"
        >
          <image :src="item.cover_photo_url" alt />
          <view>
            <text class="title">{{item.name}}</text>
          </view>
          <view>
            <text class="subtitle">{{item.view_count}}人已观看</text>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import searchBar from "@/components/search-bar/index";
import uniRequest from "../../utils/uniRequest";
export default {
  components: {
    searchBar
  },
  data() {
    return {
      swipers: [],
      courses: [],
      videos: []
    };
  },
  // onload监听页面加载事件。
  async onLoad() {
    // 1，获取首页轮播图
    let res = await uniRequest({
      url: "home/swipers"
    });
    // console.log(res);
    this.swipers = res.data.message;

    // 2，获取首页推荐课程
    let res1 = await uniRequest({
      url: "home/course"
    });
    this.courses = res1.data.message;

    // 3，获取热门视频
    let res2 = await uniRequest({
      url: "home/video"
    });
    this.videos = res2.data.message;
  }
};
</script>

<style lang="less" scoped>
.home-container {
  padding: 20rpx;
  background-color: #fff;
}
swiper {
  width: 100%;
  height: 342rpx;
  swiper-item {
    width: 100%;
    height: 100%;
  }
  image {
    width: 100%;
    height: 100%;
  }
}
.tips {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text {
    font-size: 36rpx;
    font-weight: 700;
    color: #212121;
  }
  image {
    width: 48rpx;
    height: 48rpx;
  }
}
.course-container {
  height: 170rpx;
  white-space: nowrap;
  .course-item {
    width: 296rpx;
    height: 168rpx;
    display: inline-block;
    margin-right: 32rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.hot-video {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item {
    width: 340prx;
    image {
      width: 340rpx;
      height: 210rpx;
      border-radius: 12rpx;
    }
    .title {
      margin-top: 15rpx;
      color: #262626;
      font-size: 26rpx;
    }
    .subtitle {
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      color: #959595;
      font-size: 18rpx;
    }
  }
}
</style>