<template>
    <div class="upload-btn J-upload" title="选择本地图片" v-show=show>
      <div class="icon">
        <span class="upload-icon"></span>
      </div>
      <input @change="getFile" id="file" type="file" accept="image/svg,image/gif,image/png,image/jpeg,image/bmp,image/webp" class="sr-only">
    </div>
</template>

<script>

  export default {
    data() {
      return {
        show: true,
      };
    },
    computed: {
      sourceUrl() {
        return this.$store.state.sourceImgMsg.url;
      },
      uploaded() {
        return this.$store.state.uploaded;
      },
    },
    watch: {
      sourceUrl(url) {
        if(url){
          this.show = false;
        }
        else
          this.show = true;
      }
    },
    methods: {
      getFile(e) {
        const url = URL.createObjectURL(e.target.files[0]);
        const imageObject = new Image();
        imageObject.src = url;
        imageObject.onload = () => {
          const sourceWidth = +imageObject.width;
          const sourceHeight = +imageObject.height;
          this.$store.dispatch('setSourceImgMsg', {
            url,
            width: sourceWidth,
            height: sourceHeight,
          });
          // this.$store.dispatch('setSourceWidth', sourceWidth);
          // this.$store.dispatch('setSourceHeight', sourceHeight);
        };
        // this.$store.dispatch('setSourceUrl', url);
      },
      // getBase64Image(img) {
      //   const canvas = document.createElement('canvas');
      //   canvas.width = img.dataset.width;
      //   canvas.height = img.dataset.height;
      //   const ctx = canvas.getContext('2d');
      //   ctx.drawImage(img, 0, 0, img.dataset.width, img.dataset.height);
      //   const dataURL = canvas.toDataURL('image/jpeg');
      //   return dataURL;
      // },
      // read(file, callback = () => {}) {
      //   const imgReg = /^image\/\w+$/;
      //   const imgMaxSize = 3; // 上传图片最大体积，单位 mb
      //   const imgWarnSize = 0.8; // 上传图片警戒体积，单位 mb
      //   let reader = null;
      //
      //   if (file) {
      //     if (imgReg.test(file.type)) {
      //       // fileReader读取的文件体积单位为字节 b
      //       const imgSize = file.size / (1024 * 1024);
      //
      //       if (imgSize < imgMaxSize) {
      //         if (imgSize > imgWarnSize) {
      //           this.$notify({
      //             title: '提示',
      //             message: '图片体积过大 处理速度可能会下降',
      //             type: 'warning',
      //             duration: 4000,
      //             offset: 120,
      //           });
      //         }
      //
      //         reader = new FileReader(); // 实例化 Web Api FileReader
      //
      //         reader.onload = () => {
      //           // 上传区域置空
      //           this.$store.dispatch('setUpload');
      //           // store传递类型以及文件信息
      //           this.$store.dispatch('setImgMsg', {
      //             type: file.type,
      //             name: file.name,
      //             url: reader.result,
      //           });
      //
      //           callback();
      //         };
      //
      //         reader.readAsDataURL(file);
      //       } else {
      //         this.$message({
      //           message: '图片体积须低于3M 请重新选择',
      //           type: 'warning',
      //         });
      //         callback();
      //       }
      //     } else {
      //       this.$message({
      //         message: '请选择图片文件',
      //         type: 'warning',
      //       });
      //       callback();
      //     }
      //   } else {
      //     callback();
      //   }
      // },
      // change(e) {
      //   const target = e.target;
      //   const files = target.files;
      //
      //   this.read(files && files[0], () => {
      //     target.value = '';
      //   });
      // },
      // dragover(e) {
      //   e.preventDefault();
      // },
      // drop(e) {
      //   const files = e.dataTransfer.files;
      //   e.preventDefault();
      //   this.read(files && files[0]);
      // },
      // selectImg(e) {
      //   const target = e.target;
      //   const url = this.getBase64Image(target);
      //   const name = target.dataset.name;
      //
      //   // 上传区域置空
      //   this.$store.dispatch('setUpload');
      //   // store传递类型以及文件信息
      //   this.$store.dispatch('setImgMsg', {
      //     type: 'image/jpeg',
      //     name,
      //     url,
      //     width: target.dataset.width,
      //     height: target.dataset.height,
      //   });
      // },
      // getBase64Image(img) {
      //   const canvas = document.createElement('canvas');
      //   canvas.width = img.dataset.width;
      //   canvas.height = img.dataset.height;
      //   const ctx = canvas.getContext('2d');
      //   ctx.drawImage(img, 0, 0, img.dataset.width, img.dataset.height);
      //   const dataURL = canvas.toDataURL('image/jpeg');
      //   return dataURL;
      // },
    },
  };
</script>

<style scoped>
  .import-area .icon {
    display: inline-block;
    margin-top: 20px;
    width: 128px;
    height: 128px;
    background: url('../../static/sprites/upload.png') no-repeat;
  }

  .import-area .tip {
    margin: 0;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .import-area .tip .browse {
    color: #7D5CFF;
  }

  .import-area:hover .browse {
    text-decoration: underline;
  }

  .upload-btn {
    position: relative;
    margin-top: 35px;
    width: 100%;
    height: 200px;
    line-height: 108px;
    border-radius: 10px;
    box-sizing: border-box;
    border: 2px dashed #aaa;
    transition: 0.2s;
  }
  .upload-btn:hover {
    background: #eee;
  }
  .icon{
    line-height: 208px;
  }
  .upload-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url('../../static/sprites/plus.png') no-repeat;
  }
  .sr-only {
    cursor: pointer;
  }

  /*@media screen and (max-width: 1600px) {*/
    /*.primary-pic-ct {*/
      /*height: 300px;*/
    /*}*/

    /*.upload-btn{*/
      /*height: 200px;*/
      /*line-height: 208px;*/
    /*}*/
  /*}*/
</style>
