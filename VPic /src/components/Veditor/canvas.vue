<template>
  <div class="canvas" v-show="editable">
    <div @dblclick="dblclick" class="editor" v-loading="loading" element-loading-text="滤镜计算中 ···">
      <!--<div style="position:relative width: 600px height:400px;">-->
      <div style="position: absolute"
           :width=width
           :height=height
      >
        <cropp v-show="croppable"
               :aspectratio=aspectratio
               :width=width
               :height=height>
        </cropp>
      </div>
      <!--<img v-if='width >= height'-->
           <!--:src="imgURL"-->
           <!--:width=canvasWidth-->
           <!--:height=canvasHeight-->
           <!--ref="img"-->
      <!--/>-->
      <!--<img v-if='width < height'-->
           <!--:src="imgURL"-->
           <!--:width=canvasWidth-->
           <!--:height=canvasHeight-->
           <!--ref="img"-->
      <!--/>-->
      <!--</div>-->
      <canvas ref="canvas"
              class="control__canvas">
      </canvas>
        <!--<template v-if="url"><img :src="url" :alt="name" @load="load"></template>-->
    </div>
    <!--<canvas id="test"></canvas>-->


  </div>
</template>

<script>
  import Cropp from './cropp';
  import $ from 'jquery';
  import { RgbToLab, LabToRgb, RgbToGray, FCM, FCMCluster, DistanceLab } from '../../assets/js/colorTransfer';

  const caman = window.Caman;

  export default {
    data() {
      return {
        width: 0,
        height: 0,
        canvasWidth: 0,
        canvasHeight: 0,
        n: 2,
        q: 1,
        canvas: '',
        context: {},
        imgData: {},
        pixelsData: [],
        rotateCanvas: '',
        sourcePixelsData: [],
        rotate_ctx: {},
        curImgData: {},
        curPixelsData: [],
        cropper: false,
        data: null,
        canvasData: null,
        cropBoxData: null,
        image: null,
        type: '',
        name: '',
        // url: '',
        originalUrl: '',
        loading: false,
        cropping: false,
        uploaded: false,
        // URL: '',
      };
    },
    components: {
      Cropp,
    },
    // watch: {
    //   range() {
    //     this.drawImgByBrightness();
    //   },
    //   file(newValue) {
    //     if (newValue) {
    //       this.buildCanvas();
    //     }
    //   },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('keydown', this.keydown, false);
      });
    },
    beforeDestory() {
      window.removeEventListener('keydown', this.keydown, false);
    },
    computed: {
      imgURL() {
        return this.$store.state.imgMsg.url;
      },
      editable() {
        return this.$store.state.uploaded;
      },
      croppable() {
        return this.$store.state.cropping;
      },
      transfering() {
        return this.$store.state.transfering;
      },
      aspectratio() {
        return this.$store.state.cropp.aspectratio;
      },
      // width() {
      //   return +this.$store.state.imgMsg.width;
      // },
      // height() {
      //   return +this.$store.state.imgMsg.height;
      // },
      brightness() {
        return this.$store.state.imgArguments.brightness;
      },
      contrast() {
        return this.$store.state.imgArguments.contrast;
      },
      saturation() {
        return this.$store.state.imgArguments.saturation;
      },
      rotate() {
        return this.$store.state.imgArguments.rotate;
      },
      isHsl() {
        return this.$store.state.imgArguments.isHsl;
      },
      greyscale() {
        return this.$store.state.imgArguments.greyscale;
      },
      invert() {
        return this.$store.state.imgArguments.invert;
      },
      isCurvesChg() {
        return this.$store.state.imgArguments.isCurvesChg;
      },
      colorTables() {
        return this.$store.state.imgArguments.colorTables;
      },
      radius() {
        return this.$store.state.imgArguments.radius;
      },
      sigma() {
        return this.$store.state.imgArguments.sigma;
      },
      noise() {
        return this.$store.state.imgArguments.noise;
      },
      sharpen() {
        return this.$store.state.imgArguments.sharpen;
      },
      vignette() {
        return this.$store.state.imgArguments.vignette;
      },
      lisenActionType() {
        return this.$store.state.actionType;
      },
    },
    watch: {
      editable(show) {
        this.uploaded = show;
        if (!show) return;
      },
      // croppable(show) {
      //   this.cropping = show;
      //   if (!show) return;
      // },
      imgURL(url) {
        if (this.$store.state.uploaded) {
          // this.calCanvasWidthAndHeight();
          this.width = this.$store.state.imgMsg.width;
          this.height = this.$store.state.imgMsg.height;
          // console.log(this.width)
          this.canvas = this.$refs.canvas;
          this.canvas.width = this.$store.state.imgMsg.width;
          this.canvas.height = this.$store.state.imgMsg.height;
          this.context = this.canvas.getContext('2d');
          const imageObject = new Image();
          const vm = this;
          imageObject.src = url;
          // Wait until the image loads
          imageObject.onload = () => {
            vm.context.drawImage(imageObject, 0, 0, this.canvas.width, this.canvas.height);
            // this.imgData = vm.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            // this.pixelsData = this.imgData.data;
            this.curImgData = vm.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.curPixelsData = this.curImgData.data;
          };
        }
      },
      transfering(bool) {
        if (this.uploaded && bool) {
          this.drawImgByColorTransfer();
          this.$store.dispatch('cancelColorTansfer');
        }
      },
      brightness(value) {
        if (this.uploaded) {
          this.drawImgByBrightness(this.curPixelsData, value, this.contrast);
        }
      },
      contrast(value) {
        if (this.uploaded) {
          this.drawImgByBrightness(this.curPixelsData, this.brightness, value);
        }
      },
      saturation(value) {
        if (this.uploaded) {
          this.drawImgBySaturation(this.curPixelsData, value);
        }
      },
      rotate(value) {
        if (this.uploaded) {
          this.drawImgByRotate(value);
        }
      },
      isHsl(value) {
        if (this.uploaded) {
          this.drawImgByHSL(this.curPixelsData, this.$store.state.imgArguments.channels_7);
        }
      },
      isCurvesChg() {
        if (this.uploaded) {
          this.drawImgByCurves(this.curPixelsData, this.colorTables);
        }
      },
      greyscale(bool) {
        if (this.uploaded) {
          this.drawImgByColorToGrey(this.curPixelsData, bool);
        }
      },
      invert(bool) {
        if (this.uploaded) {
          this.drawImgByInvert(this.curPixelsData, bool);
        }
      },
      radius(value) {
        if (this.uploaded) {
          this.drawImgByBlur(this.curPixelsData, value, this.sigma);
        }
      },
      sigma(value) {
        if (this.uploaded) {
          this.drawImgByBlur(this.curPixelsData, this.radius, value);
        }
      },
      noise(value) {
        if (this.uploaded) {
          this.drawImgByBrightness(this.curPixelsData, value);
        }
      },
      sharpen(value) {
        if (this.uploaded) {
          this.drawImgBySharpen(this.curPixelsData, value);
        }
      },
      vignette(value) {
        if (this.uploaded) {
          this.drawImgByBrightness(this.curPixelsData, value);
        }
      },
      lisenActionType(type) {
        if (type) {
          const actionType = type.actionType;
          console.log(actionType)
          const actionMap = {
            remove: this.remove,
            clear: this.clear,
            crop: this.crop,
            cropModel: this.changeModel,
            moveModel: this.changeModel,
            'rotate-right': this.changeModel,
            'rotate-left': this.changeModel,
            'flip-vertical': this.changeModel,
            'flip-horizontal': this.changeModel,
          };
          actionMap[actionType](actionType);
        }
      },
      // vGrayscale(grayscale) {
      //   if (this.uploaded) {
      //     this.setArgument(grayscale);
      //   }
      // },
      // vColor(color) {
      //   if (this.uploaded) {
      //     this.setArgument(color);
      //   }
      // },
      // vInvert(invert) {
      //   if (this.uploaded) {
      //     this.setInvert(invert);
      //   }
      // },
      // vBlur(blur) {
      //   if (this.uploaded) {
      //     this.setBlur(blur);
      //   }
      // },
      // vNoise(noise) {
      //   if (this.uploaded) {
      //     this.setNoise(noise);
      //   }
      // },
      // vSharpen(sharpen) {
      //   if (this.uploaded) {
      //     this.setSharpen(sharpen);
      //   }
      // },
      // vFilter(filter) {
      //   if (this.uploaded) {
      //     this.setFilter(filter);
      //   }
      // },
    },
    methods: {
      // calCanvasWidthAndHeight() {
      //   const canvasMaxWidth = (document.body.clientWidth - 300) * 0.7;
      //   const canvasMaxHeight = (document.body.clientHeight - 60) * 0.7;
      //   this.n = this.width / this.height;
      //   this.width = this.$store.state.imgMsg.width;
      //   this.height = this.$store.state.imgMsg.height;
      //   if (this.width >= this.height) {
      //     // if(this.width >= canvasMaxWidth){
      //     this.q = this.width / canvasMaxWidth;
      //     this.canvasWidth = Math.round(canvasMaxWidth);
      //     this.canvasHeight = Math.round(this.height / this.q);
      //     // }
      //   } else {
      //     this.q = this.height / canvasMaxHeight;
      //     this.canvasWidth = Math.round(this.width / this.q);
      //     this.canvasHeight = Math.round(canvasMaxHeight);
      //   }
      // },
      calCanvasWidthAndHeight(imgWidth, imgHeight) {
        const maxWidth = Math.round((document.body.clientWidth - 300) * 0.75);
        const maxHeight = Math.round((document.body.clientHeight - 60) * 0.75);
        let canvasWidth = 0;
        let canvasHeight = 0;
        if (imgWidth >= imgHeight) {
          const n = imgWidth / maxWidth;
          canvasWidth = Math.round(imgWidth / n);
          canvasHeight = Math.round(imgHeight / n);
        } else {
          const n = imgHeight / maxHeight;
          canvasWidth = Math.round(imgWidth / n);
          canvasHeight = Math.round(imgHeight / n);
        }
        return {
          canvasWidth,
          canvasHeight,
        };
      },
      drawImgByColorTransfer() {
        const imageObject = new Image();
        imageObject.src = this.$store.state.sourceImgMsg.url;
        // const sourceWidth = imageObject.width;
        // const sourceHeight = imageObject.height;
        // console.log('sourceWidth:', sourceWidth);
        // console.log('sourceHeight:', sourceHeight);
        // console.log('tarWidth:', this.width);
        // console.log('tarHeight:', this.height);
        //result canvas
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        //source canvas
        let sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = this.$store.state.sourceImgMsg.width;
        sourceCanvas.height = this.$store.state.sourceImgMsg.height;
        let sourceCtx = sourceCanvas.getContext('2d');
        sourceCtx.drawImage(imageObject, 0, 0, sourceCanvas.width, sourceCanvas.height);
        let sourceImgData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        let sourcePixelsData = sourceImgData.data;
        // FCM
        let resultPixelsData = FCM(this.curPixelsData, this.width, this.height, sourcePixelsData, sourceCanvas.width, sourceCanvas.height);
        for (let i = 0; i < pixelsData.length; i += 4) {
          pixelsData[i] = resultPixelsData[i];
          pixelsData[i + 1] = resultPixelsData[i + 1];
          pixelsData[i + 2] = resultPixelsData[i + 2];
        }
        ctx.putImageData(imgData, 0, 0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('setResultUrl', URL);
        this.$store.dispatch('setImgUrl', URL);
        this.$notify({
          title: '提示',
          message: '参数调整完成 可点击下载',
          type: 'success',
          duration: 1500,
        });
      },
      drawImgByBrightness(curPixelsData, brightnessValue, contrastValue) {
        // const vm = this;
        const b = brightnessValue / 100;
        const c = contrastValue / 100;
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        const K = Math.floor(Math.tan(((45 + (44 * c)) / 180) * Math.PI) * 100) / 100;
        for (let i = 0; i < pixelsData.length; i += 4) {
          pixelsData[i + 0] = ((curPixelsData[i + 0] - (128 * (1 - b))) * K) + (128 * (b + 1));
          pixelsData[i + 1] = ((curPixelsData[i + 1] - (128 * (1 - b))) * K) + (128 * (b + 1));
          pixelsData[i + 2] = ((curPixelsData[i + 2] - (128 * (1 - b))) * K) + (128 * (b + 1));
        }
        ctx.putImageData(imgData, 0, 0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgBySaturation(curPixelsData, saturation) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        for (let i = 0; i < pixelsData.length; i += 4) {
          const max = Math.max(curPixelsData[i + 0], curPixelsData[i + 1], curPixelsData[i + 2]);
          pixelsData[i + 0] = max !== curPixelsData[i + 0] ? ((max - curPixelsData[i + 0])
            * (-saturation / 100)) + curPixelsData[i + 0] : curPixelsData[i + 0];
          pixelsData[i + 1] = max !== curPixelsData[i + 1] ? ((max - curPixelsData[i + 1])
            * (-saturation / 100)) + curPixelsData[i + 1] : curPixelsData[i + 1];
          pixelsData[i + 2] = max !== curPixelsData[i + 2] ? ((max - curPixelsData[i + 2])
            * (-saturation / 100)) + curPixelsData[i + 2] : curPixelsData[i + 2];
        }
        ctx.putImageData(imgData, 0, 0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgByHSL(curPixelsData, channels) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        let hsb =[];
        let delta_hsb = [];
        let channel_index = -1;
        for (let i = 0; i < 7; i++)
          channels[i].calcDefined();
        for (var i = 0; i < 7; i++) {
          if (channels[i].defined === true)
            channel_index = i;
        }
        for (let i = 0; i < curPixelsData.length ; i += 4) {
          // RGB to HSL conversion
          hsb = this.RGB2HSL (curPixelsData[i], curPixelsData[i + 1], curPixelsData[i + 2]);
          // adjust each channel
          delta_hsb[0] = delta_hsb[1] = delta_hsb[2] = 0;
          // channels_7[channel_index].adjust(hsb[0], delta_hsb);
          channels[0].adjust(hsb[0], delta_hsb);
          channels[1].adjust(hsb[0], delta_hsb);
          channels[2].adjust(hsb[0], delta_hsb);
          channels[3].adjust(hsb[0], delta_hsb);
          channels[4].adjust(hsb[0], delta_hsb);
          channels[5].adjust(hsb[0], delta_hsb);
          channels[6].adjust(hsb[0], delta_hsb);
          // adjust hue
          hsb[0] = Math.round(hsb[0] + delta_hsb[0]) % 360;
          if ( hsb[0] <  0 )
            hsb[0] += 360;
          // //adjust saturation
          if (delta_hsb[1] < 0) {
            hsb[1] = hsb[1] * (1 + delta_hsb[1] / 100.0);
          } else {
            hsb[1] = hsb[1] + ( 1 - hsb[1] ) * delta_hsb[1] / 100.0; // saturation increase
            hsb[2] = hsb[2] + ( 1 - hsb[2] ) * delta_hsb[1] / 100.0; // brightness increase
          }
          //
          // //adjust brightness
          // delta_hsb[2] = CLIP_RANGE(delta_hsb[2], -100, 100);
          if ( delta_hsb[2] < 0) {
            hsb[2] = hsb[2] * (1 + delta_hsb[2] / 100.0);
          } else {
            hsb[2] = hsb[2] + ( 1 - hsb[2] ) * delta_hsb[2] / 100.0; // brightness increase
            hsb[1] = hsb[1] - hsb[1] * delta_hsb[2] / 100.0; // saturation decrease
          }
          var rgb = this.HSL2RGB(hsb[0],hsb[1],hsb[2]);
          pixelsData[i + 0] = rgb[0];
          pixelsData[i + 1] = rgb[1];
          pixelsData[i + 2] = rgb[2];
        }
        ctx.putImageData(imgData, 0, 0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgByBlur(curPixelsData, radius, sigma){
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        const width = imgData.width;
        const height = imgData.height;
        let gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;
        for (let i = 0 ; i < curPixelsData.length ; i++){
          pixelsData[i * 4 + 0] = curPixelsData[i * 4 + 0];
          pixelsData[i * 4 + 1] = curPixelsData[i * 4 + 1];
          pixelsData[i * 4 + 2] = curPixelsData[i * 4 + 2];
        }
        if (radius === 0 || sigma === 0){
          ctx.putImageData(imgData , 0 , 0);
        } else{
          a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
          b = -1 / (2 * sigma * sigma);
          // 生成高斯矩阵
          for (i = 0, x = -radius; x <= radius; x++, i++){
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;
          }
          // 归一化, 保证高斯矩阵的值在[0,1]之间
          for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
          }
          // x 方向一维高斯运算
          for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
              r = g = b = a = 0;
              gaussSum = 0;
              for(j = -radius; j <= radius; j++){
                k = x + j;
                if(k >= 0 && k < width){// 确保 k 没超出 x 的范围
                  // r,g,b,a 四个一组
                  i = (y * width + k) * 4;
                  r += pixelsData[i] * gaussMatrix[j + radius];
                  g += pixelsData[i + 1] * gaussMatrix[j + radius];
                  b += pixelsData[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
                }
              }
              i = (y * width + x) * 4;
              // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
              // console.log(gaussSum)
              pixelsData[i] = r / gaussSum;
              pixelsData[i + 1] = g / gaussSum;
              pixelsData[i + 2] = b / gaussSum;
              // pixes[i + 3] = a ;
            }
          }
          // y 方向一维高斯运算
          for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
              r = g = b = a = 0;
              gaussSum = 0;
              for(j = -radius; j <= radius; j++){
                k = y + j;
                if(k >= 0 && k < height){// 确保 k 没超出 y 的范围
                  i = (k * width + x) * 4;
                  r += pixelsData[i] * gaussMatrix[j + radius];
                  g += pixelsData[i + 1] * gaussMatrix[j + radius];
                  b += pixelsData[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
                }
              }
              i = (y * width + x) * 4;
              pixelsData[i] = r / gaussSum;
              pixelsData[i + 1] = g / gaussSum;
              pixelsData[i + 2] = b / gaussSum;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          const URL = canvas.toDataURL('image/jpeg');
          this.$store.dispatch('storeResult', URL);
        }
      },
      drawImgByColorToGrey(curPixelsData, bool) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        if (bool) {
          for (let i = 0 ; i < pixelsData.length ; i += 4) {
            const gray = Math.round(curPixelsData[i] * 0.3 + curPixelsData[i + 1] * 0.59 + curPixelsData[i + 2] * 0.11);
            pixelsData[i + 0] = gray;
            pixelsData[i + 1] = gray;
            pixelsData[i + 2] = gray;
          }
          ctx.putImageData(imgData, 0 , 0);
        }
        else {
          ctx.putImageData(this.curImgData, 0 , 0);
        }
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgByInvert(curPixelsData, bool) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        if (bool) {
          for (let i = 0; i < pixelsData.length; i += 4) {
            pixelsData[i + 0] = 255 - curPixelsData[i];
            pixelsData[i + 1] = 255 - curPixelsData[i + 1];
            pixelsData[i + 2] = 255 - curPixelsData[i + 2];
          }
          ctx.putImageData(imgData, 0, 0);
        }
        else {
          ctx.putImageData(this.curImgData, 0, 0);
        }
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgBySharpen(curPixelsData, sharpen) {
        const sharpenValue = sharpen / 100;
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        let Laplacian = [ -1, -1, -1, -1, 8, -1, -1, -1, -1 ];// 拉普拉斯锐化模板
        // var Laplacian = [ 0, -1, 0, -1, 4, -1, 0, -1, 0 ];// 拉普拉斯锐化模板
        for (let y = 1; y < imgData.height - 1 ; y++) {
          for (let x = 1; x < imgData.width - 1 ; x++) {
            let r = 0, g = 0, b = 0;
            let n = 0;
            let Index = 0;
            for (let row = -1; row <= 1; row++) {
              for (let col = -1; col <= 1; col++) {
                n = (y + row) * imgData.width + x + col;
                r += curPixelsData[4 * n + 0] * Laplacian[Index];
                g += curPixelsData[4 * n + 1] * Laplacian[Index];
                b += curPixelsData[4 * n + 2] * Laplacian[Index];
                Index += 1;
              }
            }
            r = r > 255 ? 255 : r;
            r = r < 0 ? 0 : r;
            g = g > 255 ? 255 : g;
            g = g < 0 ? 0 : g;
            b = b > 255 ? 255 : b;
            b = b < 0 ? 0 : b;

            n = y * imgData.width + x;
            pixelsData[4 * n + 0] = r * sharpenValue + curPixelsData[4 * n + 0];
            pixelsData[4 * n + 1] = g * sharpenValue + curPixelsData[4 * n + 1];
            pixelsData[4 * n + 2] = b * sharpenValue + curPixelsData[4 * n + 2];
          }
        }
        ctx.putImageData(imgData, 0 , 0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgByRotate(rotateValue) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        // rotateCanvas
        let rotateCanvas = document.createElement('canvas');
        let rotate_ctx = rotateCanvas.getContext('2d');
        rotateCanvas.width = canvas.width;
        rotateCanvas.height = canvas.height;
        rotate_ctx.putImageData(this.curImgData, 0, 0);
        let s =  Math.round(Math.sin(Math.abs(rotateValue)/180 * Math.PI) * 1000) / 1000;
        let c =  Math.round(Math.cos(Math.abs(rotateValue)/180 * Math.PI) * 1000) / 1000;
        let scale_value = 0;
        if (canvas.width <= canvas.height)
          scale_value = (canvas.width * c + canvas.height * s) / canvas.width;
        else
          scale_value = (canvas.width * s + canvas.height * c) / canvas.height;
        ctx.save();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.translate(canvas.width/2 , canvas.height/2);
        ctx.scale(scale_value,scale_value);
        ctx.rotate(rotateValue/180 * Math.PI);
        ctx.translate(-canvas.width/2 , -canvas.height/2);
        ctx.drawImage(rotateCanvas, 0 , 0 , canvas.width,canvas.height);
        ctx.restore();
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      drawImgByCurves(curPixelsData, colorTables) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let pixelsData = imgData.data;
        for (let i = 0 ; i < pixelsData.length ; i += 4) {
          pixelsData[i + 0] = colorTables[0][curPixelsData[i + 0]];
          pixelsData[i + 1] = colorTables[1][curPixelsData[i + 1]];
          pixelsData[i + 2] = colorTables[2][curPixelsData[i + 2]];
          pixelsData[i + 3] = 255;
        }
        ctx.putImageData(imgData,0,0);
        const URL = canvas.toDataURL('image/jpeg');
        this.$store.dispatch('storeResult', URL);
      },
      // setArgument(val) {
      //   // const self = this;
      //   let imgUrl = '';
      //
      //   this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
      //     this.imgPaper.revert(false);
      //     $.map(val, (v, k) => {
      //       this.imgPaper[k](v);
      //     });
      //     this.imgPaper.render(() => {
      //       // render后回调，存储处理后的图像
      //       imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
      //       this.$store.dispatch('storeResult', imgUrl);
      //     });
      //   });
      //   // this.imgPaper.revert(false);
      //   // $.map(val, (v, k) => {
      //   //   this.imgPaper[k](v);
      //   // });
      //   // this.imgPaper.render(() => {
      //   //   // render后回调，存储处理后的图像
      //   //   imgUrl = self.imgPaper.toBase64(self.$store.state.imgMsg.type);
      //   //   // self.$store.dispatch('setImgUrl', imgUrl);
      //   //   self.$store.dispatch('storeResult', imgUrl);
      //   // });
      // },
      // setInvert(invert) {
      //   let imgUrl = '';
      //
      //   this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
      //     this.imgPaper.revert(false);
      //     $.map(invert, (v, k) => {
      //       if (v) {
      //         this.imgPaper[k]();
      //       }
      //     });
      //     this.imgPaper.render(() => {
      //       // render后回调，存储处理后的图像
      //       imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
      //       this.$store.dispatch('storeResult', imgUrl);
      //     });
      //   });
      // },
      // setBlur(blur) {
      //   let imgUrl = '';
      //
      //   this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
      //     this.imgPaper.revert(false);
      //     this.imgPaper.stackBlur(blur);
      //     this.imgPaper.render(() => {
      //       imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
      //       this.$store.dispatch('storeResult', imgUrl);
      //     });
      //   });
      // },
      // setNoise(noise) {
      //   let imgUrl = '';
      //
      //   this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
      //     this.imgPaper.revert(false);
      //     this.imgPaper.noise(noise);
      //     this.imgPaper.render(() => {
      //       imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
      //       this.$store.dispatch('storeResult', imgUrl);
      //     });
      //   });
      // },
      // setSharpen(sharpen) {
      //   let imgUrl = '';
      //
      //   this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
      //     this.imgPaper.revert(false);
      //     this.imgPaper.sharpen(sharpen);
      //     this.imgPaper.render(() => {
      //       imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
      //       this.$store.dispatch('storeResult', imgUrl);
      //     });
      //   });
      // },
      BGR2HSL(bgr, hsl) {
        let r1, g1, b1, cmax, cmin, delta;
        r1 = bgr[2] / 255.0;
        g1 = bgr[1] / 255.0;
        b1 = bgr[0] / 255.0;
        cmax = Math.max(r1, g1, b1);
        cmin = Math.min(r1, g1, b1);
        delta = cmax - cmin;
        hsl[2] = (cmax + cmin) / 2;
        if ( delta === 0 ) {
          hsl[1] = 0;
          hsl[0] = 0;
        } else {
          if ( hsl[2] <= 0.5 )
            hsl[1] = delta /(cmax + cmin);
          else
            hsl[1] = delta / (2 - (cmax + cmin));

          if (cmax === r1) {
            if ( g1 >= b1 )
            // hsl[0] = int( 60 * (g1 - b1) / delta + 0.5);
              hsl[0] = Math.round( 60 * (g1 - b1) / delta + 0.5);
            else
            // hsl[0] = int( 60 * (g1 - b1) / delta + 360 + 0.5);
              hsl[0] = Math.round( 60 * (g1 - b1) / delta + 360 + 0.5);
          } else if (cmax === g1) {
            // hsl[0] = int( 60 * (b1 - r1) / delta + 120 + 0.5);
            hsl[0] = Math.round( 60 * (b1 - r1) / delta + 120 + 0.5);
          } else { // cmax == b1
            // hsl[0] = int( 60 * (r1 - g1) / delta + 240 + 0.5);
            hsl[0] = Math.round( 60 * (r1 - g1) / delta + 240 + 0.5);
          }
        }
        return hsl;
      },
      RGB2HSL (R, G , B) {
        let hsl = [];
        let bgr = [];
        bgr[0] = B;
        bgr[1] = G;
        bgr[2] = R;
        hsl = this.BGR2HSL(bgr, hsl);
        // H = hsl[0];
        // S = hsl[1];
        // L = hsl[2];
        return hsl
      },
      HSL2BGR(hsl, bgr) {
        let r1, g1, b1;
        let h = hsl[0] / 360.0;
        if ( hsl[1] === 0 ) {
          r1 = g1 = b1 = hsl[2]; // gray
        } else {
          let q = hsl[2] < 0.5 ? hsl[2] * (1 + hsl[1]) : hsl[2] + hsl[1] - hsl[2] * hsl[1];
          let p = 2 * hsl[2] - q;
          r1 = this.hueToRgb(p, q, h + 1.0 / 3.0);
          g1 = this.hueToRgb(p, q, h);
          b1 = this.hueToRgb(p, q, h - 1.0 / 3.0);
        }
        bgr[0] = Math.round(b1 * 255);
        bgr[1] = Math.round(g1 * 255);
        bgr[2] = Math.round(r1 * 255);
        return bgr;
      },
      HSL2RGB( H, S , L ) {
        let hsl = [];
        let bgr = [];
        let rgb = [];
        hsl[0] = H;
        hsl[1] = S;
        hsl[2] = L;
        bgr = this.HSL2BGR (hsl, bgr);
        rgb[0] = bgr[2];
        rgb[1] = bgr[1];
        rgb[2] = bgr[0];
        return rgb;
      },
      hueToRgb( p , q , t){
        if (t < 0.0 )
          t += 1.0 ;
        if (t > 1.0 )
          t -= 1.0;
        if (t < 1.0 / 6.0 )
          return p + (q - p) * 6.0 * t;
        if (t < 1.0 / 2.0 )
          return q;
        if (t < 2.0 /3.0 )
          return p + (q - p) * (2.0/3.0 - t) * 6.0;
        return p;
      },
      setFilter(filter) {
        let imgUrl = '';
        this.loading = true;

        this.imgPaper = caman('.cropper-canvas .canvas-img', () => {
          this.imgPaper.revert(true);
          this.imgPaper[filter]();
          this.imgPaper.render(() => {
            imgUrl = this.imgPaper.toBase64(this.$store.state.imgMsg.type);
            this.$store.dispatch('setImgUrl', imgUrl);
            this.loading = false;
          });
        });
      },
      // initPaper() {
      //   const imgMsg = this.$store.state.imgMsg;
      //   this.type = imgMsg.type;
      //   this.name = imgMsg.name;
      //   this.url = imgMsg.url;
      // },
      // load(e) {
      //   if (!this.image) {
      //     this.image = e.target;
      //     this.start();
      //   }
      // },
      // // 剪切和移动模式切换
      // changeModel(actionType) {
      //   const cropper = this.$store.state.cropper;
      //   const type = this.type;
      //   let imgUrl = '';
      //
      //   if (!cropper) {
      //     return;
      //   }
      //
      //   switch (actionType) {
      //     case 'moveModel':
      //       cropper.setDragMode('move');
      //       break;
      //
      //     case 'cropModel':
      //       cropper.setDragMode('crop');
      //       break;
      //
      //     // case 'zoom-in':
      //     //   cropper.zoom(0.1);
      //     //   break;
      //
      //     // case 'zoom-out':
      //     //   cropper.zoom(-0.1);
      //     //   break;
      //
      //     case 'rotate-left':
      //       cropper.rotate(-90);
      //       break;
      //
      //     case 'rotate-right':
      //       cropper.rotate(90);
      //       break;
      //
      //     case 'flip-horizontal':
      //       cropper.scaleX(-this.$store.state.cropper.getData().scaleX || -1);
      //       break;
      //
      //     case 'flip-vertical':
      //       cropper.scaleY(-this.$store.state.cropper.getData().scaleY || -1);
      //       break;
      //
      //     default:
      //       break;
      //   }
      //
      //   this.data = cropper.getData();
      //   this.canvasData = cropper.getCanvasData();
      //   this.cropBoxData = cropper.getCropBoxData();
      //   this.url = cropper.getCroppedCanvas(type === 'image/png' ? null : {
      //     fillColor: '#fff',
      //   }).toDataURL(type);
      //   imgUrl = this.url;
      //
      //   this.$store.dispatch('setImgUrl', imgUrl);
      // },
      // 快捷键
      // keydown(e) {
      //   const cropper = this.$store.state.cropper;
      //   const key = e.key || e.keyCode || e.which || e.charCode;

      //   switch (key) {

      //     // Undo crop (Key: Ctrl + Z)
      //     case 90:
      //       if (e.ctrlKey) {
      //         e.preventDefault();
      //         this.restore(true);
      //       }

      //       break;

      //         // Delete the image (Key: Delete)
      //     case 46:
      //       this.remove(true);
      //       break;

      //     default:
      //       break;
      //   }

      //   if (!cropper) {
      //     return;
      //   }

      //   switch (key) {
      //     // Crop the image (Key: Enter)
      //     case 13:
      //       this.crop(true);
      //       break;

      //         // Clear crop area (Key: Esc)
      //     case 27:
      //       this.clear(true);
      //       break;

      //         // Move to the left (Key: ←)
      //     case 37:
      //       e.preventDefault();
      //       cropper.move(-1, 0);
      //       break;

      //         // Move to the top (Key: ↑)
      //     case 38:
      //       e.preventDefault();
      //       cropper.move(0, -1);
      //       break;

      //         // Move to the right (Key: →)
      //     case 39:
      //       e.preventDefault();
      //       cropper.move(1, 0);
      //       break;

      //         // Move to the bottom (Key: ↓)
      //     case 40:
      //       e.preventDefault();
      //       cropper.move(0, 1);
      //       break;

      //         // Enter crop mode (Key: C)
      //     case 67:
      //       cropper.setDragMode('crop');
      //       break;

      //         // Enter move mode (Key: M)
      //     case 77:
      //       cropper.setDragMode('move');
      //       break;

      //         // Zoom in (Key: I)
      //     case 73:
      //       cropper.zoom(0.1);
      //       break;

      //         // Zoom out (Key: O)
      //     case 79:
      //       cropper.zoom(-0.1);
      //       break;

      //         // Rotate left (Key: L)
      //     case 76:
      //       cropper.rotate(-90);
      //       break;

      //         // Rotate right (Key: R)
      //     case 82:
      //       cropper.rotate(90);
      //       break;

      //         // Flip horizontal (Key: H)
      //     case 72:
      //       cropper.scaleX(-this.$store.state.cropper.getData().scaleX || -1);
      //       break;

      //         // Flip vertical (Key: V)
      //     case 86:
      //       cropper.scaleY(-this.$store.state.cropper.getData().scaleY || -1);
      //       break;

      //     default:
      //       break;
      //   }
      // },

      // 鼠标双击事件切换
      dblclick(e) {
        if (e.target.className.indexOf('cropper-face') >= 0) {
          e.preventDefault();
          e.stopPropagation();
          this.crop(true);
        }
      },
      start() {
        const self = this;

        if (this.$store.state.cropper) {
          return;
        }

        // 新建裁切类的实例
        const cropper = new Cropper(this.image, {
          autoCrop: false,
          dragMode: 'move',
          background: false,
          built() {
            if (self.data) {
              this.$store.state.cropper
                .crop()
                .setData(self.data)
                .setCanvasData(self.canvasData)
                .setCropBoxData(self.cropBoxData);
              self.data = null;
              self.canvasData = null;
              self.cropBoxData = null;
            }
          },
          crop(data) {
            if (data.detail.width > 0 && data.detail.height > 0 && !self.$store.state.cropping) {
              self.$store.dispatch('setCropping');
            }
          },
        });
        this.$store.dispatch('setCropper', cropper);
      },
      stop() {
        if (this.$store.state.cropper) {
          // 销毁cropper对象
          this.$store.state.cropper.destroy();
          this.$store.state.cropper = null;
          this.$store.dispatch('cancelCropping');
        }
      },
      // nextCrop() {
      //   this.$store.state.cropper.replace(this.url);
      //   this.$store.dispatch('cancelCropping');
      // },
      crop() {
        // const cropper = this.$store.state.cropper;
        // const type = this.type;
        if (this.$store.state.cropping) {
          this.$store.dispatch('cancelCropping');
          const croppX = this.$store.state.cropp.croppX;
          const croppY = this.$store.state.cropp.croppY;
          const croppWidth = this.$store.state.cropp.croppWidth;
          const croppHeight = this.$store.state.cropp.croppHeight;
          // this.originalUrl = this.url;
          // this.data = cropper.getData();
          // this.canvasData = cropper.getCanvasData();
          // this.cropBoxData = cropper.getCropBoxData();
          // // 非png格式图像空白处填充白色
          // this.url = cropper.getCroppedCanvas(type === 'image/png' ? null : {
          //   fillColor: '#fff',
          // }).toDataURL(type);
          let canvas = this.$refs.canvas;
          const canvasWidhtHeight = this.calCanvasWidthAndHeight(croppWidth, croppHeight);
          console.log(canvasWidhtHeight);
          this.width = canvasWidhtHeight.canvasWidth;
          this.height = canvasWidhtHeight.canvasHeight;
          // canvas.attr('width', canvasWidhtHeight.canvasWidth);
          // canvas.attr('height', canvasWidhtHeight.canvasWidth);
          canvas.width = canvasWidhtHeight.canvasWidth;
          canvas.height = canvasWidhtHeight.canvasHeight;
          let ctx = canvas.getContext('2d');
          console.log('canvas:', canvas);
          console.log('ctx',ctx);
          const imageObject = new Image();
          imageObject.src = this.$store.state.imgMsg.url;
          imageObject.onload = () => {
            ctx.drawImage(imageObject, croppX, croppY, croppWidth, croppHeight, 0, 0,  canvas.width, canvas.height);
            // console.log(ctx);
            const URL = canvas.toDataURL('image/jpeg');
            this.$store.dispatch('setImgMsg', {
              type: '',
              name: '',
              url: URL,
              width: canvas.width,
              height: canvas.height,
            });
          };
          this.$store.dispatch('storeResult', '');
          this.$notify({
            title: '提示',
            message: '图片剪裁成功',
            type: 'success',
            duration: 1500,
          });
          // this.nextCrop();
          // this.$store.dispatch('cropImgMsg', {
          //   url: this.url,
          //   name: this.name,
          // });
        }
      },
      clear() {
        if (this.$store.state.cropping) {
          this.$store.dispatch('cancelCropping');
        }
      },
      restore(dispatch) {
        if (!this.$store.state.cropper) {
          this.image = null;
          this.url = this.originalUrl;
          this.originalUrl = '';

          if (dispatch) {
            this.$dispatch('broadcast', 'restored');
          }
        }
      },
      remove() {
        // Disallow to delete image when cropping
        if (!this.$store.state.cropping) {
          this.stop();
          this.$store.dispatch('setRemoving');
          this.$store.dispatch('setRemoveAll');
          // this.data = null;
          // this.image = null;
          // this.$store.dispatch('setImgMsg', {
          //   type: '',
          //   name: '',
          //   url: '',
          //   width: 0,
          //   height: 0,
          // });
          // this.$store.dispatch('setSourceImgMsg', {
          //   url: '',
          //   width: 0,
          //   height: 0,
          // });
          // this.$store.dispatch('cancelColorTansfer');
          // // this.originalUrl = '';
          this.$notify({
            title: '提示',
            message: '清空画布成功 可导入新的图片',
            type: 'success',
            duration: 3500,
          });
          // this.$store.dispatch('cancelRemoving');
          // this.$store.dispatch('cancelUpload');
        }
      },
    },
  };
</script>

<style lang="css">
  .canvas {
    width: 100%;
    height: 100%;
  }
  .canvas .editor {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    /*position: relative;*/
  }
  .canvas .editor > img {
    display: block;
    max-width: 75%;
    max-height: 75%;
    margin: auto;
    vertical-align: middle;
  }
  .control__canvas {
    /*position: relative;*/
    /*line-height: 300px;*/
    /*display: flex;*/
    /*margin: 0 auto;*/
  }
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
