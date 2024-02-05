<!-- AlertComponent.vue -->
<template>
    <el-alert :title="title" :type="type" />
  </template>
  
  <script>
  export default {
    name: 'AlertComponent',
    props: {
      title: String,
      type: String
    }
  }
 
  </script>
  
  <style scoped>
    .el-alert {
      margin: 20px 0 0;
    }
    .el-alert:first-child {
      margin: 0;
    }
  </style>
  