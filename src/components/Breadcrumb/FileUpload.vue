<template>
  <el-form-item label="文件上传" prop="fileUpload">
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :disabled="!editStatus"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <!--      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
  </el-form-item>
</template>

<script>
export default {
  name: 'FileUpload'
}
</script>

<style scoped>

</style>
