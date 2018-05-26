let HSBChannel = {
  createNew: function () {
      let channel = {};
      channel.hue = 0;
      channel.saturation = 0;
      channel.brightness = 0;
      channel.defined = false;
     // channels.setColorIndex(0);
      channel.colorIndex = 0;
      channel.left_left = 0;
      channel.left      = 0;
      channel.right     = 0;
      channel.right_right = 0;

      channel.setColorIndex = function (index) {
          var data = [
          // [   0,   0, 360, 360],
          [ 315, 345,   15, 23],//red
          [   15,  23,  37,  45],//orange
          [  37,  45,  75, 90],//yellow
          [  90, 105, 135, 150],//green
          [ 150, 165, 195, 210],//cyan
          [ 195, 225, 255, 285],//blue
          [ 255, 285, 315, 345] //purple
          ];

          if (index < 0 ) index = 0;
          if (index > 6 ) index = 6;

          this.colorIndex = index;
          this.left_left = data[index][0];
          this.left      = data[index][1];
          this.right     = data[index][2];
          this.right_right = data[index][3];
      }
      channel.calcDefined = function () {
          if ( this.hue != 0 || this.saturation != 0 || this.brightness != 0 ) {
              this.defined = true;
              return;
          }
          this.defined = false;
      };
      channel.match = function (hue) {
          if ( this.left < this.right ) {
              if ( hue >= this.left_left && hue <= this.right_right )
                  return true;
          } else {
              if ( hue >=this.left_left && hue <= 360 )
                  return true;
              if ( hue >=0 && hue <= this.right_right )
                  return true;
          }
          return false;
      };
      channel.adjust = function (h,delta_hsb) {
          if (this.colorIndex == 0 ) {
              delta_hsb[0] += this.hue;
              delta_hsb[1] += this.saturation;
              delta_hsb[2] += this.brightness;
              return;
          }

          if ( this.left < this.right ) {
              if ( h >= this.left_left && h <= this.right_right ) {
                  if ( h >=this.left && h <= this.right) {
                      delta_hsb[0] += this.hue;
                      delta_hsb[1] += this.saturation;
                      delta_hsb[2] += this.brightness;
                      return;
                  }
                  if ( h >=this.left_left && h <= this.left && this.left > this.left_left) {
                      delta_hsb[0] += this.hue * (h - this.left_left) / (this.left - this.left_left);
                      delta_hsb[1] += this.saturation * (h - this.left_left) / (this.left - this.left_left);
                      delta_hsb[2] += this.brightness * (h - this.left_left) / (this.left - this.left_left);
                      return;
                  }

                  if ( h >=this.right && h <= this.right_right && this.right_right > this.right) {
                      delta_hsb[0] += this.hue * (this.right_right - h) / (this.right_right - this.right);
                      delta_hsb[1] += this.saturation * (this.right_right - h) / (this.right_right - this.right);
                      delta_hsb[2] += this.brightness * (this.right_right - h) / (this.right_right - this.right);
                      return;
                  }
              }
          } else {

              if ( h >=this.left && h <= 360 ) {
                  delta_hsb[0] += this.hue;
                  delta_hsb[1] += this.saturation;
                  delta_hsb[2] += this.brightness;
                  return;
              }

              if ( h >=0 && h <= this.right ) {
                  delta_hsb[0] += this.hue;
                  delta_hsb[1] += this.saturation;
                  delta_hsb[2] += this.brightness;
                  return;
              }

              if ( h >=this.left_left && h <= this.left && this.left > this.left_left) {
                  delta_hsb[0] += this.hue * (h - this.left_left) / (this.left - this.left_left);
                  delta_hsb[1] += this.saturation * (h - this.left_left) / (this.left - this.left_left);
                  delta_hsb[2] += this.brightness * (h - this.left_left) / (this.left - this.left_left);
                  return;
              }

              if ( h >=this.right && h <= this.right_right && this.right_right > this.right) {
                  delta_hsb[0] += this.hue * (this.right_right - h) / (this.right_right - this.right);
                  delta_hsb[1] += this.saturation * (this.right_right - h) / (this.right_right - this.right);
                  delta_hsb[2] += this.brightness * (this.right_right - h) / (this.right_right - this.right);
                  return;
              }
          }
      }
      return channel;
  }
};


function drawImgByHSL (inPixelsData,channels) {
  // console.log("H_VALUE:",H_VALUE)
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixelsData = imgData.data;
  var hsb =[];
  var delta_hsb = [];
  var channel_index = -1;

  // channels_7[3].hue = +H_VALUE;
  // channels_7[3].saturation= 0;
  // channels_7[3].brightness = 0;

  // channels_7[1].hue = + h_red_value;
  // channels_7[1].saturation = +H_VALUE;
  // channels_7[1].brightness = +H_VALUE;


  //calculate defined
  for (var i = 0; i < 7; i++)
    channels[i].calcDefined();

  for (var i = 0; i < 7; i++) {
    if (channels[i].defined === true)
      channel_index = i;
  }

  // for (var i = 0; i < 7; i++) {
  //     if (channels_7[i].defined === true)
  //         channels_7[i].adjust(hsb[0], delta_hsb);
  // }
  //scan pixels of image
  for (var i = 0; i < inPixelsData.length ; i += 4) {
    //RGB to HSL conversion
    hsb = RGB2HSL(inPixelsData[i],inPixelsData[i+1],inPixelsData[i+2]);
    // debugger;


    // console.log("hsb[0]:",hsb[0])
    //adjust each channel
    delta_hsb[0] = delta_hsb[1] = delta_hsb[2] = 0;


    // channels_7[channel_index].adjust(hsb[0], delta_hsb);
    channels[0].adjust(hsb[0], delta_hsb);
    channels[1].adjust(hsb[0], delta_hsb);
    channels[2].adjust(hsb[0], delta_hsb);
    channels[3].adjust(hsb[0], delta_hsb);
    channels[4].adjust(hsb[0], delta_hsb);
    channels[5].adjust(hsb[0], delta_hsb);
    channels[6].adjust(hsb[0], delta_hsb);
    // console.log("delta_hsb:",delta_hsb);

    //adjust hue
    hsb[0] = Math.round(hsb[0] + delta_hsb[0]) % 360;
    if ( hsb[0] <  0 )
      hsb[0] += 360;

    // //adjust saturation
    // delta_hsb[1] = CLIP_RANGE(delta_hsb[1], -100, 100);
    if ( delta_hsb[1] < 0) {
      hsb[1] = hsb[1] * (1 + delta_hsb[1] / 100.0);
    } else {
      hsb[1] = hsb[1] + ( 1 - hsb[1] ) * delta_hsb[1] / 100.0; //saturation increase
      hsb[2] = hsb[2] + ( 1 - hsb[2] ) * delta_hsb[1] / 100.0; //brightness increase
    }
    //
    // //adjust brightness
    // delta_hsb[2] = CLIP_RANGE(delta_hsb[2], -100, 100);
    if ( delta_hsb[2] < 0) {
      hsb[2] = hsb[2] * (1 + delta_hsb[2] / 100.0);
    } else {
      hsb[2] = hsb[2] + ( 1 - hsb[2] ) * delta_hsb[2] / 100.0; //brightness increase
      hsb[1] = hsb[1] - hsb[1]  * delta_hsb[2] / 100.0; //saturation decrease
    }

    // console.log("hsb[0]:",hsb[0])

    var rgb = HSL2RGB(hsb[0],hsb[1],hsb[2]);
    pixelsData[i + 0] = rgb[0];
    pixelsData[i + 1] = rgb[1];
    pixelsData[i + 2] = rgb[2];
  }
  ctx.putImageData(imgData, 0, 0);
  histogram();
}

function HslCancel() {
  var past_imgData = HistoricalAdjustments[HistoricalAdjustments.length-1].resultImgData;
  ctx.putImageData(past_imgData, 0, 0);


  slider_hsl_h_red.value = 0.0;
  slider_hsl_h_orange.value = 0.0;
  slider_hsl_h_yellow.value = 0.0;
  slider_hsl_h_green.value = 0.0;
  slider_hsl_h_cyan.value = 0.0;
  slider_hsl_h_blue.value = 0.0;
  slider_hsl_h_purple.value = 0.0;

  slider_hsl_s_red.value = 0.0;
  slider_hsl_s_orange.value = 0.0;
  slider_hsl_s_yellow.value = 0.0;
  slider_hsl_s_green.value = 0.0;
  slider_hsl_s_cyan.value = 0.0;
  slider_hsl_s_blue.value = 0.0;
  slider_hsl_s_purple.value = 0.0;

  slider_hsl_l_red.value = 0.0;
  slider_hsl_l_orange.value = 0.0;
  slider_hsl_l_yellow.value = 0.0;
  slider_hsl_l_green.value = 0.0;
  slider_hsl_l_cyan.value = 0.0;
  slider_hsl_l_blue.value = 0.0;
  slider_hsl_l_purple.value = 0.0;

  // channels_7.splice(0,channels_7.length)
  //     // for (var i = 0 ; i < 7; i++){
  //     //     var channel = HSBChannel.createNew();
  //     //     channel.setColorIndex(i);
  //     //     channels_7[i] = channel;
  //     // }

  for (var i = 0 ; i < 7; i++){
    channels_7[i].hue = 0.0;
    channels_7[i].saturation = 0.0;
    channels_7[i].brightness = 0.0;
    channels_7[i].defined = false;
  }
}
// 深拷贝
function deepCopy(obj) {
  var newObj = Array.isArray(obj) ? [] : {};
  for(var p in obj){
    if(typeof obj[p] === 'object') {
      newObj[p] = deepCopy(obj[p]);// 递归
    }else{
      newObj[p] = obj[p];
    }
  }
  return newObj;
}
export default{
  HSBChannel,
};
