<template>
  <Layout>
    <div class="container">
      <PostDetail :id="id" />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import PostDetail from "@/components/PostDetail.vue";

const props = defineProps<{
  id: number;
}>();

const id = props.id;
</script>
