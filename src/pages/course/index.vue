<template>
  <!-- 使用课程列表公共组件 -->
  <course-list :courses="courses"></course-list>
</template>

<script>
import courseList from "@/components/course-list/index";
import uniRequest from "@/utils/uniRequest";
export default {
  components: {
    "course-list": courseList
  },
  data() {
    return {
      courses: []
    };
  },
  async onLoad() {
    let res = await uniRequest({
      url: "course/list"
    });
    this.courses = res.data.message;
  }
};
</script>

<style>
</style>