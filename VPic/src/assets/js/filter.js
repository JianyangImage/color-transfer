export  let Filter = {
  //反色
  inverseFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      // data[i] = 255- data[i];
      //data[i+1] = 255 - data[i+1];
      //data[i+2] = 255 - data[i+2];
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];
      data[i] = (255-r);
      data[i+1] = (255-g);
      data[i+2] = (255-b);
    }
    return data;
  },
  //灰色调
  grayFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = r*0.3+g*0.59+b*0.11;
      data[i+1] = r*0.3+g*0.59+b*0.11;
      data[i+2] = r*0.3+g*0.59+b*0.11;
    }
  },
  //黑白
  heibaiFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = ((r+g+b)/3 > 128) ? 255 : 0;
      data[i+1] = ((r+g+b)/3 > 128) ? 255 : 0;
      data[i+2] = ((r+g+b)/3 > 128) ? 255 : 0;
    }
    return data;
  },
  //反色黑白
  heibai2Fun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = 255 - r;
      data[i+1] = 255 - r;
      data[i+2] = 255 - r;
    }
    return data;
  },
  //浮雕
  rilievoFun : function(dataobj){
    var width = dataobj.width;
    var height = dataobj.height;
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        var pre = (i-1+j*width)*4;
        var ind = (i+j*width)*4;
        var next = (i+1+j*width)*4;

        dataobj.data[ind+0] = canvasData_old.data[next+0] - canvasData_old.data[pre+0] + 128;
        dataobj.data[ind+1] = canvasData_old.data[next+1] - canvasData_old.data[pre+1] + 128;
        dataobj.data[ind+2] = canvasData_old.data[next+2] - canvasData_old.data[pre+2] + 128;
        //dataobj.data[ind+3] = 255;
      }
    }
  },
  //对折1
  duizhe01Fun : function(dataobj){
    var width = dataobj.width;
    var height = dataobj.height;
    for (var i = 1; i <= width/2; i++) {
      for (var j = 1; j <= height; j++) {
        var chushi = ((j-1)*width+i)*4;
        var mubiao = ((j-1)*width+(width-i))*4;
        dataobj.data[mubiao+0] = dataobj.data[chushi+0];
        dataobj.data[mubiao+1] = dataobj.data[chushi+1];
        dataobj.data[mubiao+2] = dataobj.data[chushi+2];
        dataobj.data[mubiao+3] = dataobj.data[chushi+3];
      }
    }
  },
  //对折2
  duizhe02Fun : function(dataobj){
    var width = dataobj.width;
    var height = dataobj.height;
    for (var i = 1; i <= width/2; i++) {
      for (var j = 1; j <= height; j++) {
        var chushi = ((j-1)*width+i)*4;
        var mubiao = ((j-1)*width+(width-i))*4;

        dataobj.data[chushi+0] = dataobj.data[mubiao+0];
        dataobj.data[chushi+1] = dataobj.data[mubiao+1];
        dataobj.data[chushi+2] = dataobj.data[mubiao+2];
        dataobj.data[mubiao+3] = dataobj.data[chushi+3];

      }
    }
  },
  //镜像反转
  mirrorFun : function(dataobj){
    var width = dataobj.width;
    var height = dataobj.height;
    for (var i = 1; i <= width; i++) {
      for (var j = 1; j <= height; j++) {
        var chushi = ((j-1)*width+i)*4;
        var mubiao = ((j-1)*width+(width-i))*4;
        dataobj.data[mubiao+0] = canvasData_old.data[chushi+0];
        dataobj.data[mubiao+1] = canvasData_old.data[chushi+1];
        dataobj.data[mubiao+2] = canvasData_old.data[chushi+2];
        dataobj.data[mubiao+3] = canvasData_old.data[chushi+3];
      }
    }
  },
  //高对比度
  duibiduFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = r*1.25;
      data[i+1] = g*1.25;
      data[i+2] = b*1.25;
    }
  },
  //暖色调
  nuanseFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = r*1.05;
      data[i+1] = g*0.95;
      data[i+2] = b*0.9;
    }
  },
  //冷色调
  lengseFun : function(data){
    for (var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];

      data[i] = r*0.9;
      data[i+1] = g*0.95;
      data[i+2] = b*1.05;
    }
  },
  //模糊
  vagueFun : function(imgData,radius,sigma) {
    var pixes = imgData.data;
    var width = imgData.width;
    var height = imgData.height;
    var gaussMatrix = [],
      gaussSum = 0,
      x, y,
      r, g, b, a,
      i, j, k, len;


    radius = Math.floor(radius) || 3;
    sigma = sigma || radius / 3;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++){
      g = a * Math.exp(b * x * x);
      gaussMatrix[i] = g;
      gaussSum += g;

    }
    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for(j = -radius; j <= radius; j++){
          k = x + j;
          if(k >= 0 && k < width){//确保 k 没超出 x 的范围
            //r,g,b,a 四个一组
            i = (y * width + k) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
        // console.log(gaussSum)
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
        // pixes[i + 3] = a ;
      }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for(j = -radius; j <= radius; j++){
          k = y + j;
          if(k >= 0 && k < height){//确保 k 没超出 y 的范围
            i = (k * width + x) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
        // pixes[i] = r ;
        // pixes[i + 1] = g ;
        // pixes[i + 2] = b ;
        // pixes[i + 3] = a ;
      }
    }
  },
  //马赛克
  masaikeFun : function(dataobj,len){
    var width = dataobj.width;
    var height = dataobj.height;
    var data = dataobj.data;
    var arr = [];
    var r=0,g=0,b=0,a=0;
    for (var i = 0; i < width; i+=len) {
      for (var j = 0; j < height; j+=len) {
        r=0;
        g=0;
        b=0;
        arr = [];
        for (var x = 0; x < len; x++) {
          arr.push(data.slice((i+(j+x)*width)*4,(i+(j+x)*width+len)*4));
        }
        for (var x = 0; x < arr.length; x++) {
          for (var y = 0; y < arr[x].length; y++) {
            if((y-0) % 4 == 0){
              r += arr[x][y];
            }
            if((y-1) % 4 == 0){
              g += arr[x][y];
            }
            if((y-2) % 4 == 0){
              b += arr[x][y];
            }
          }
        }
        r = r/(len*len);
        g = g/(len*len);
        b = b/(len*len);
        for (var x = 0; x < len; x++) {
          for (var y = 0; y < len; y++) {
            data[(i+(j+x)*width+y)*4] = r;
            data[(i+(j+x)*width+y)*4+1] = g;
            data[(i+(j+x)*width+y)*4+2] = b;
          }
        }
      }
    }
  },
  //方格
  fanggeFun : function(dataobj){
    var width = dataobj.width;
    var height = dataobj.height;
    var data = dataobj.data;
    var arr = [];
    var len = (Math.round(width/100) > 4) ? Math.round(width/100) : 4;
    var r=0,g=0,b=0,a=0;
    for (var i = 0; i < width; i+=len) {
      for (var j = 0; j < height; j+=len) {
        r=0;
        g=0;
        b=0;
        arr = [];
        for (var x = 0; x < len; x++) {
          for (var y = 0; y < len; y++) {
            if(x == 0 || y == 0){
              data[(i+(j+x)*width+y)*4] = 200;
              data[(i+(j+x)*width+y)*4+1] = 200;
              data[(i+(j+x)*width+y)*4+2] = 200;
              data[(i+(j+x)*width+y)*4+3] = 255;
            }
            if((x==0&&y==0)||(x==0&&y==len-1)||(y==0&&x==len-1)||(y==len-1&&x==len-1)){
              data[(i+(j+x)*width+y)*4] = 0;
              data[(i+(j+x)*width+y)*4+1] = 0;
              data[(i+(j+x)*width+y)*4+2] = 0;
              data[(i+(j+x)*width+y)*4+3] = 255;
            }
          }
        }
      }
    }
  },
}
