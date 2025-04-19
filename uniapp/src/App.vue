<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
:root {
  --primary-color: #165dff;
  --primary-color-light: #94bfff;
  --primary-color-dark: #0e3c9b;
}

page {
  background: #f8f8f8;
}
</style>
