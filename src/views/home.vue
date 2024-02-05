<script setup>
import { ethers } from 'ethers';

import { ref } from 'vue';
import Header from '@/views/header.vue';
import Main from '@/views/main.vue';
import Left from '@/views/left.vue';


</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><Header /></el-header>
      <el-container>
        <el-aside width="200px">
          <Left></Left>
        </el-aside>
        <el-main>
            <!-- <Main /> -->
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>

</style>
