

let Curve = {
  createNew :function () {
    let curve = {};
    curve.tolerance = 3;
    curve.is_mouse_down = false;
    curve.points = [{x:0 , y:0},{x:255 , y:255}];
    curve.current =  curve.points[1];
    curve.currentPre = function(){
      let preIndexof = 0 ;
      for (let i = 0; i < this.points.length; i++) {
        if (this.points[i].x === this.current.x && this.points[i].y === this.current.y)
          preIndexof = i-1;
      }
      return this.points[preIndexof];

    };
    curve.currentNext = function(){
      let nextIndexof = 0 ;
      for (let i = 0; i < this.points.length; i++) {
        if (this.points[i].x === this.current.x && this.points[i].y === this.current.y)
          nextIndexof = i+1;
      }
      return this.points[nextIndexof];
    };
    curve.find = function(x,y){
      for (let i = 0 ; i < this.points.length ; i++) {
        //是控制点
        if ( Math.abs(this.points[i].x - x ) <= this.tolerance && Math.abs(255 - this.points[i].y - y ) <= this.tolerance )
          return this.points[i];
        if(this.points[i].x === x)
          return 0;
      }
      //不是控制点的话
      return this.points[this.points.length-1];
    };
    curve.add = function(x,y){
      let it = this.find(x,y);
      let p = this.Point(x, y);
      let pInCurve = this.Point(x,255-y);
      console.log("it:",it)
      //插入控制点
      if ( it === this.points[this.points.length-1] ) {
        if(Math.abs(this.points[this.points.length-1].x - x ) <= this.tolerance && Math.abs(255 - this.points[this.points.length-1].y - y ) <= this.tolerance){
          return it;
        }
        for (let i = 0 ; i < this.points.length ; i++) {
          if ( this.points[i] === this.points[0] && this.points[i].x > p.x) {
            // DEBUG_PRINT("points insert at beginning");
            this.points.splice( i , 0 , pInCurve );
            return pInCurve;
          }
          // if ( this.points[i].x < x &&  this.points[i+1] !== this.points[this.points.length-1] &&   this.points[i+1].x > p.x) {
          if ( this.points[i].x < x && this.points[i+1].x > x) {
            // DEBUG_PRINT("points insert");
            this.points.splice( i+1 , 0 , pInCurve );
            return pInCurve;
          }
          if( this.points[i] === this.points[this.points.length-1] && this.points[i].x < p.x){
            this.points.push( pInCurve );
            return pInCurve
          }
        }
      }
      //返回控制点
      else {
        return it;
      }
    };
    curve.calcCurve = function (output_y) {
      //if count of control points is less than 2, return linear output
      if ( this.points.length < 2) {
        for (let i = 0; i < 256; i++ )
          output_y[i] = 255 - i;
        return 0;
      }

      //if count of control points is 2, return linear output
      if ( this.points.length === 2 ) {
        let point1 = this.points[0];
        let point2 = this.points[this.points.length-1];

        let delta_y = 0;
        if ( point2.x !== point1.x )
          delta_y  = (point2.y - point1.y) * 1.0 / (point2.x - point1.x);

        //create output
        for ( let i = 0; i < 256; i++ ){
          if ( i < point1.x ) {
            output_y[i] = point1.y;
          } else if ( i >= point1.x && i < point2.x ) {
            // z[i] = COLOR_RANGE( point1.y + delta_y * (i - point1.x) );
            output_y[i] = point1.y + delta_y * (i - point1.x) ;
            // console.log(output_y[i]);
          } else {
            output_y[i] = point2.y;
          }
        }
        return 0;
      }
      //the count of control points is greater than 2,  create spline line
      let n = this.points.length;  //count of points
      //create array of x-coordinate and y-coordinate of control points
      let x = [];
      let y = [];
      let start_point = this.points[this.points.length-1];
      let end_point = this.points[this.points.length-1];
      let k = 0;
      for (let i = 0 ; i < this.points.length ; i++ , k++ ) {
        if ( k === 0 ) start_point = this.points[i];
        x[k] = this.points[i].x - start_point.x;
        y[k] = this.points[i].y;
        end_point = this.points[i];
      }
      //if start_point or end_point is invalid
      // if (start_point === this.points[this.points.length-1] || end_point === this.points[this.points.length-1] || start_point === end_point) {
      //     for (var i = 0; i < 256; i++ )
      //         output_y[i] = i;
      //     return 1;
      // }
      // console.log("x:",x)
      //create array of x-coordinate of output points
      let m = end_point.x - start_point.x;
      // console.log("m:",m)
      let t = [];  //array of x-coordinate of output points
      let z = [];  //array of y-coordinate of output points
      //initialize array of x-coordinate
      for ( let i = 0; i < m; i++ ) {
        t[i] = i;
      }
      //perform spline, output y-coordinate is stored in array z
      this.spline(x, y, n, t, m, z);
      // console.log("z:",z)
      //create output
      for ( let i = 0; i < 256; i++ ) {
        if ( i < start_point.x ) {
          output_y[i] = start_point.y;
        } else if ( i >= start_point.x && i < end_point.x ) {
          // z[i] = CLIP_RANGE(z[i - start_point.x], 0, 255);
          output_y[i] = z[i - start_point.x];
        } else {
          output_y[i] = end_point.y;
        }
      }
      return 0;
    };
    curve.draw = function (curveCtx) {
      // let thinkness = 1;
      let n = 0;
      // let lastPoint = this.Point();
      curveCtx.beginPath()

      curveCtx.moveTo(0,0);
      curveCtx.lineTo(255,0);

      curveCtx.moveTo(0,255);
      curveCtx.lineTo(255,255);

      curveCtx.moveTo(255,0);
      curveCtx.lineTo(255,255);

      curveCtx.moveTo(0,255);
      curveCtx.lineTo(0,0);

      curveCtx.moveTo(63,0);
      curveCtx.lineTo(63,255);

      curveCtx.moveTo(127,0);
      curveCtx.lineTo(127,255);

      curveCtx.moveTo(191,0);
      curveCtx.lineTo(191,255);

      curveCtx.moveTo(0,255-63);
      curveCtx.lineTo(255,255-63);

      curveCtx.moveTo(0,255-127);
      curveCtx.lineTo(255,255-127);

      curveCtx.moveTo(0,255-191);
      curveCtx.lineTo(255,255-191);

      curveCtx.closePath();

      curveCtx.stroke();

      //create curve
      let z = new Array(256);
      this.calcCurve(z);
      for (let i = 0 ; i < 256 ; i++) {
        if(z[i] < 0)
          z[i] = 0;
        if(z[i] > 255)
          z[i] = 255;
      }
      for (let i = 1; i < 256; ++i ) {
        // line( mat, Point(i-1, 255 - z[i-1]), Point(i, 255 - z[i]), color, 1, 8 );
        curveCtx.beginPath()
        curveCtx.moveTo(i-1 , 255 - z[i-1]);
        curveCtx.lineTo(i , 255 - z[i]);
        curveCtx.closePath();
        curveCtx.stroke();
      }
      curveCtx.stroke();
      //draw control points
      for (let i = 0 ; i<this.points.length ; i++, n++ ) {
        // thinkness = (this.points[i] === this.current) ? -1 : 1;
        curveCtx.beginPath();
        curveCtx.rect(this.points[i].x - 3 , 255 - this.points[i].y - 3 , 6 , 6);
        curveCtx.closePath();
        curveCtx.stroke();
        // rectangle(mat, Point(this.points[i].x - 2, 255 - this.points[i].y + 2),
        // Point(this.points[i].x + 2, 255 - this.points[i].y - 2), color, thinkness, 8);
      }
    };
    curve.mouseDown = function (x,y) {
      this.current = this.add( x , y );
      this.current.x = x;
      this.current.y = 255-y;
      console.log("current:",this.current)
      console.log("points:",this.points)
      this.is_mouse_down = true;
    };
    curve.mouseMove = function (x,y) {
      y = 255 - y;
      // var pre = this.currentPre();
      // var prev_x = pre.x;
      // console.log(prev_x)
      // var next = this.currentNext();
      // var next_x = next.x;
      let pre,
          next,
          prev_x,
          next_x;
      if ( this.is_mouse_down ) {
        if( 0 <= y && y <= 255 ){
          if( this.currentPre() && this.currentNext() ){
            pre = this.currentPre();
            next = this.currentNext();
            prev_x = pre.x;
            next_x = next.x;
            if(prev_x + 6 < x && x < next_x - 6){
              this.current.x = x;
              this.current.y = y;
            }else
              this.current.y = y;
          }else if( this.currentPre() ){
            pre = this.currentPre();
            prev_x = pre.x;
            if( prev_x + 6 < x ){
              this.current.x = x;
              this.current.y = y;
            }else
              this.current.y = y;
          }else if ( this.currentNext() ){
            next = this.currentNext();
            next_x = next.x;
            if(next_x - 6 > x){
              this.current.x = x;
              this.current.y = y;
            }else
              this.current.y = y;
          }
        }
        else{
          // this.current.x = x;
          if( this.currentPre() && this.currentNext() ){
            pre = this.currentPre();
            next = this.currentNext();
            prev_x = pre.x;
            next_x = next.x;
            if(prev_x + 6 < x && x < next_x - 6){
              this.current.x = x;
            }
          }else if( this.currentPre() ){
            pre = this.currentPre();
            prev_x = pre.x;
            if( prev_x + 6 < x ) {
              this.current.x = x;
            }
          }else if ( this.currentNext() ){
            next = this.currentNext();
            next_x = next.x;
            if(next_x - 6 > x){
              this.current.x = x;
            }
          }
        }
        return true;
        // if (this.current !== this.points[this.points.length-1]) {
        let prev_x = 0;
        let next_x = 255;
        // if (this.current !== this.points[0]) {
        //     var pre = this.currentPre();
        //     var prev_y = pre.y;
        //     prev_x = pre.x;
        //
        //     //match the previous point
        //     if ( this.points.length > 2 && Math.abs(x - prev_x) <= this.tolerance && Math.abs(y - prev_y) <= this.tolerance ) {
        //         this.current = this.current.pre;
        //         // this.current = this.points.erase(current);
        //         // DEBUG_PRINT("erase previous");
        //         return true;
        //     }
        //
        //     //if x less than x of previou point
        //     if ( x <= prev_x) {
        //         //DEBUG_PRINT("less than prev_x");
        //         return true;
        //     }
        // }
        //
        // if ( this.points.next !== this.points[this.points.length-1]) {
        //     var next = this.currentNext();
        //     var next_y = next.y;
        //     next_x = next.x;
        //
        //     //match the next point
        //     if ( this.points.length > 2 && Math.abs(x - next_x) <= this.tolerance && Math.abs(y - next_y) <= this.tolerance ) {
        //         this.current = this.current.next;
        //         // DEBUG_PRINT("erase next");
        //         return true;
        //     }
        //
        //     //if x great than x of next point
        //     if ( x >= next_x) {
        //         //DEBUG_PRINT("large than next_x");
        //         return true;
        //     }
        // }
        // this.current.x = CLIP_RANGE(x, 0, 255);
        // this.current.y = CLIP_RANGE(y, 0, 255);
      }
      return false;
    };
    curve.mouseUp = function (x,y) {
      y = 255 - y;
      this.is_mouse_down = false;
    };
    curve.Point = function(x,y) {
      return {
        x : x,
        y : y
      }
    };
    curve.spline = function(x , y , n , t , m , z){
      // var dy = new Array[n];
      let dy = [];
      for( let i = 0 ; i < n ; i++){
        dy.push(0);
      }
      dy[0] = -0.5;
      let ddy = [];
      for( let i = 0 ; i < n ; i++){
        ddy.push(0);
      }
      ddy[0] = 0;
      let h1;
      let s = [];
      for( let i = 0 ; i < n ; i++){
        s.push(0);
      }
      let h0 = x[1] - x[0];
      s[0] = 3.0 * (y[1] - y[0]) / (2.0 * h0) - ddy[0] * h0 / 4.0;
      for( let j = 1; j <= n - 2; ++j ) {
        h1 = x[j + 1] - x[j];
        let alpha = h0 / (h0 + h1);
        let beta = (1.0 - alpha) * (y[j] - y[j - 1]) / h0;
        beta = 3.0 * (beta + alpha * ( y[j + 1] - y[j] ) / h1);
        dy[j] = -alpha / (2.0 + (1.0 - alpha) * dy[j - 1]);
        s[j] = (beta - (1.0 - alpha) * s[j - 1]);
        s[j] = s[j] / (2.0 + (1.0 - alpha) * dy[j - 1]);
        h0 = h1;
      }
      dy[n-1] = (3.0*(y[n-1] - y[n-2]) / h1 + ddy[n-1] * h1/2.0 - s[n-2]) / (2.0 + dy[n-2]);
      for( let j = n - 2; j >= 0; --j ) {
        dy[j] = dy[j] * dy[j + 1] + s[j];
      }
      for( let j = 0; j <= n - 2; ++j ) {
        s[j] = x[j + 1] - x[j];
      }
      for( let j = 0; j <= n - 2; ++j ) {
        h1 = s[j] * s[j];
        ddy[j] = 6.0 * (y[j+1] - y[j]) / h1 - 2.0 * (2.0 * dy[j] + dy[j+1]) / s[j];
      }
      h1 = s[n-2] * s[n-2];
      ddy[n-1] = 6.0 * (y[n-2] - y[n-1]) / h1 + 2.0 * (2.0 * dy[n-1] + dy[n-2]) / s[n-2];
      let g = 0.0;
      for(let i=0; i<=n-2; i++) {
        h1 = 0.5 * s[i] * (y[i] + y[i+1]);
        h1 = h1 - s[i] * s[i] * s[i] * (ddy[i] + ddy[i+1]) / 24.0;
        g = g + h1;
      }
      for(let j=0; j<=m-1; j++) {
        let i;
        if( t[j] >= x[n-1] ) {
          i = n - 2;
        } else {
          i = 0;
          while(t[j] > x[i+1]) {
            i = i + 1;
          }
        }
        h1 = (x[i+1] - t[j]) / s[i];
        h0 = h1 * h1;
        z[j] = (3.0 * h0 - 2.0 * h0 * h1) * y[i];
        z[j] = z[j] + s[i] * (h0 - h0 * h1) * dy[i];
        h1 = (t[j] - x[i]) / s[i];
        h0 = h1 * h1;
        z[j] = z[j] + (3.0 * h0 - 2.0 * h0 * h1) * y[i+1];
        z[j] = z[j] - s[i] * (h0 - h0 * h1) * dy[i+1];
      }
    };
    return curve;
  }
};

let Curves = {
  createNew :function () {
    let curves = {};
    curves.RGBChannel = Curve.createNew();
    curves.RedChannel = Curve.createNew();
    curves.GreenChannel = Curve.createNew();
    curves.BlueChannel = Curve.createNew();
    curves.CurrentChannel = curves.RGBChannel;
    curves.draw = function () {
      if(this.CurrentChannel) {
        this.CurrentChannel.draw();
      }
    };
    curves.mouseDown = function (x,y) {
      if(this.CurrentChannel){
        this.CurrentChannel.mouseDown(x,y);
      }
    };
    curves.mouseMove = function (x,y) {
      if (this.CurrentChannel)
        return this.CurrentChannel.mouseMove(x, y);
      return false;
    };
    curves.mouseUp = function (x,y) {
      if(this.CurrentChannel){
        this.CurrentChannel.mouseUp(x,y);
      }
    };
    curves.createColorTables = function(){
      let colorTables = new Array(3);
      for(let i = 0;i < colorTables.length; i++){
        colorTables[i] = new Array(256);    //每行有16列
      }

      let z =  new Array(16);   //表格有16行
      for(let i = 0;i < z.length; i++){
        z[i] = new Array(16);    //每行有16列
      }

      this.BlueChannel.calcCurve(z);
      for (let i = 0; i < 256; ++i ) {
        colorTables[2][i] = z[i];
      }

      this.GreenChannel.calcCurve(z);
      for (let i = 0; i < 256; ++i )
        colorTables[1][i] = z[i];

      this.RedChannel.calcCurve(z);
      for (let i = 0; i < 256; ++i ) {
        colorTables[0][i] = z[i];
      }

      let value;
      this.RGBChannel.calcCurve(z);
      for (let i = 0; i < 256; ++i ) {
        for (let c = 0; c < 3; c++ ) {
          value = Math.round(colorTables[c][i]);
          colorTables[c][i] = z[value];
        }
      }
      return colorTables;
    };
    curves.adjust = function( srcPixelsData , height , width ){
      let dstPixelsData = []
      let channels = 3;
      // var colorTables = new Array(3);
      // for(var i = 0;i < colorTables.length; i++){
      //     colorTables[i] = new Array(256);    //每行有16列
      // }

      //create color tables
      let colorTables = this.createColorTables( );
      // adjust each pixel
      for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
          let index = y * height + x;
          dstPixelsData[4*index+0] = Math.round(colorTables[0][ srcPixelsData[4*index+0] ]);
          dstPixelsData[4*index+1] = Math.round(colorTables[1][ srcPixelsData[4*index+1] ]);
          dstPixelsData[4*index+2] = Math.round(colorTables[2][ srcPixelsData[4*index+2] ]);
          dstPixelsData[4*index+3] = 0;
        }
      }
      return dstPixelsData;
    };
    return curves;
  }
};

function drawImgByCurves(inPixelsData , colorTables ) {
  curveCtx.clearRect(0,0,curveCanvas.width,curveCanvas.height);
  this.curves.draw();

  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixelsData = imgData.data;

  // var colorTables = new Array(3);
  // for(var i = 0;i < colorTables.length; i++){
  //     colorTables[i] = new Array(256);    //每行有16列
  // }
  // var colorTables = curves.createColorTables();

  for(let i = 0 ; i < imgData.height * imgData.width ; i++) {
    pixelsData[4 * i + 0] = colorTables[0][inPixelsData[4 * i + 0]];
    pixelsData[4 * i + 1] = colorTables[1][inPixelsData[4 * i + 1]];
    pixelsData[4 * i + 2] = colorTables[2][inPixelsData[4 * i + 2]];
    pixelsData[4 * i + 3] = 255;
  }
  ctx.putImageData(imgData,0,0);
  histogram();
}
// function CurvesCancel() {
//   var past_imgData = HistoricalAdjustments[HistoricalAdjustments.length-1].resultImgData;
//   ctx.putImageData(past_imgData, 0, 0);
// }
// function CurvesOk() {
//   var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   var colorTables = this.curves.createColorTables();
//   var curves_adjustment = Adjustment.creatNew();
//   curves_adjustment.name = "curves";
//   curves_adjustment.curvesColorTables = colorTables;
//   curves_adjustment.resultImgData = imgData;
//   curves_adjustment.resultPixelsData = imgData.data;
//
//   HistoricalAdjustments.push(curves_adjustment);
//
//   current_imgData = imgData;
//   current_pixelsData = imgData.data;
//
//   rotate_ctx.putImageData(imgData, 0, 0);
//
//   curves = Curves.createNew();
//   curveCtx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
//   this.curves.draw();
//
//   console.log(HistoricalAdjustments);
// }

export default{
  Curves,
};

