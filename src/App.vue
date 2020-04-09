<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mpType: "app",
  onLaunch() {
    // if (uni.getStorageSync("my_token")) {
    //   uni.reLaunch({
    //     url: "/pages/home/index"
    //   });
    // }
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  }
});
</script>

<style>
/*每个页面公共css */
page {
  background-color: #f8f8f8;
}
</style>
