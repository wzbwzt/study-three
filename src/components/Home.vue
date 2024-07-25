<template>
  <h1>home</h1>
  <div v-for="item of routers">
    <router-link :to="item.path">{{ item.path }}</router-link>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const routers = router.getRoutes();
</script>
<style scoped lang="scss"></style>
