<template>
  <div id="box" @mousemove=onMouseMove($event) @mouseup=onMouseUp($event)>
    <!--<img src="test_img.jpg" id="img2" style="height: 1000px ; width: 667px" />-->
    <div id="main" @mousedown=mainOnmousedown($event) >
      <div class="Divmin" id="up-left" @mousedown=upLeftOnmousedown($event)></div>
      <div class="Divmin" id="up" @mousedown=upOnmousedown($event)></div>
      <div class="Divmin" id="up-right" @mousedown=upRightOnmousedown($event)></div>
      <div class="Divmin" id="right" @mousedown=rightOnmousedown($event)></div>
      <div class="Divmin" id="down-right" @mousedown=downRightLeftOnmousedown($event)></div>
      <div class="Divmin" id="down" @mousedown=downOnmousedown($event)></div>
      <div class="Divmin" id="down-left" @mousedown=downLeftLeftOnmousedown($event)></div>
      <div class="Divmin" id="left" @mousedown=leftOnmousedown($event)></div>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery';


    export default {
      name: 'cropp',
      props: {
        width: Number,
        height: Number,
        aspectratio: Number,
      },
      data() {
        return {
          isDraging: false,
          contact: '', // 表示被按下的触点
          delta_x: 0,
          delta_y: 0,
          croppHeight: 200,
          croppWidth: 200,
          croppX: 0,
          croppY: 0,
        };
      },
      computed: {
        boxDiv() {
          return document.getElementById('box');
        },
        mainDiv() {
          return document.getElementById('main');
        },
        // upDiv() {
        //   return document.getElementById('up');
        // },
        // rightDiv() {
        //   return document.getElementById('right');
        // },
        // downDiv() {
        //   return document.getElementById('down');
        // },
        // leftDiv() {
        //   return document.getElementById('left');
        // },
        // up_rightDiv() {
        //   return document.getElementById('up_right');
        // },
        // down_rightDiv() {
        //   return document.getElementById('down_right');
        // },
        // down_leftDiv() {
        //   return document.getElementById('down_left');
        // },
        // up_leftDiv() {
        //   return document.getElementById('up_left');
        // },
        // img2() {
        //   return document.getElementById('img2');
        // },
      },
      methods: {
        upLeftOnmousedown(e) {
          console.log(e);
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'up-left';
          this.setCroppPosition();
        },
        upOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'up';
          this.setCroppPosition();
        },
        upRightOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'up-right';
          this.setCroppPosition();
        },
        rightOnmousedown(e) {
          console.log(e);
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'right';
          this.setCroppPosition();
        },
        downRightLeftOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'down-right';
          this.setCroppPosition();
        },
        downOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'down';
          this.setCroppPosition();
        },
        downLeftLeftOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'down-left';
          this.setCroppPosition();
        },
        leftOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'left';
          this.setCroppPosition();
        },
        mainOnmousedown(e) {
          e.stopPropagation();
          this.isDraging = true;
          this.contact = 'main';
          this.delta_x = e.clientX - this.getPosition(this.mainDiv).left;
          this.delta_y = e.clientY - this.getPosition(this.mainDiv).top;
          this.setCroppPosition();
        },
        onMouseUp(e) {
          this.isDraging = false;
        },
        onMouseMove(e) {
          e = e || window.event;
          if (this.isDraging === true) {
            switch (this.contact) {
              case 'up' : this.upMove(e);break;
              case 'right' : this.rightMove(e);break;
              case 'down' : this.downMove(e);break;
              case 'left' : this.leftMove(e);break;
              case 'up-right' : this.upMove(e);this.rightMove(e);break;
              case 'down-right' : this.downMove(e);this.rightMove(e);break;
              case 'down-left' : this.downMove(e);this.leftMove(e);break;
              case 'up-left' : this.upMove(e);this.leftMove(e);break;
              case 'main' : this.mainMove(e);break;
            }
          }
          this.setChoice();
        },
        setCroppPosition() {
          this.croppX = this.getPosition(this.mainDiv).left - this.getPosition(this.boxDiv).left;
          this.croppY = this.getPosition(this.mainDiv).top - this.getPosition(this.boxDiv).top;
          this.croppWidth = this.mainDiv.offsetWidth - 2;
          this.croppHeight = this.mainDiv.offsetHeight - 2;
          this.$store.dispatch('setCroppX', this.croppX);
          this.$store.dispatch('setCroppY', this.croppY);
          this.$store.dispatch('setCroppWidth', this.croppWidth);
          this.$store.dispatch('setCroppHeight', this.croppHeight);
          console.log(this.$store.state.cropp);
        },
        getPosition(el) {
          let left = el.offsetLeft;
          let top = el.offsetTop;
          let parent = el.offsetParent;
          while (parent != null) {
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
          }
          return {
            left: left,
            top: top,
          };
        },
        mainMove(e) {
          const x = e.clientX;
          const y = e.clientY;
          this.mainDiv.style.left = x - this.delta_x - this.getPosition(this.boxDiv).left + 'px';
          this.mainDiv.style.top = y - this.delta_y - this.getPosition(this.boxDiv).top + 'px';// 左边的距离（相当于左边位置横坐标）等于选取框距父级元素的距离减去增加的宽度
          this.setCroppPosition();
        },
        upMove(e) {
          const y = e.clientY;//鼠标位置的纵坐标
          // console.log(e.clientX,e.clientY)
          const heightBefore = this.mainDiv.offsetHeight - 2;// 选取框变化前的高度
          const addHeight = this.getPosition(this.mainDiv).top - y;// 增加的高度
          this.croppHeight += addHeight;
          this.mainDiv.style.height = heightBefore + addHeight + 'px';// 选取框变化后的宽度
          this.mainDiv.style.top = this.mainDiv.offsetTop - addHeight + 'px';// 相当于变化后左上角的纵坐标，鼠标向上移纵坐标减小，下移增大
          this.setCroppPosition();
        },
        rightMove(e) {
          const x = e.clientX;// 鼠标位置的横坐标
          const widthBefore = this.mainDiv.offsetWidth - 2;// 选取框变化前的宽度
          const addWidth = x - this.getPosition(this.mainDiv).left - widthBefore;// 鼠标移动后选取框增加的宽度
          this.croppWidth = widthBefore + addWidth;
          this.mainDiv.style.width = widthBefore + addWidth + 'px';// 选取框变化后的宽度
          this.setCroppPosition();
        },
        downMove(e) {
          const heightBefore = this.mainDiv.offsetHeight - 2;
          const addHeight = e.clientY - this.getPosition(this.mainDiv).top - this.mainDiv.offsetHeight;
          this.croppHeight += addHeight;
          this.mainDiv.style.height = heightBefore+ addHeight + 'px';
          this.setCroppPosition();
        },
        leftMove(e) {
          const widthBefore = this.mainDiv.offsetWidth - 2;
          const addWidth = this.getPosition(this.mainDiv).left - e.clientX;// 增加的宽度等于距离屏幕左边的距离减去鼠标位置横坐标
          this.croppWidth += addWidth;
          this.mainDiv.style.width = widthBefore + addWidth + 'px';
          this.mainDiv.style.left = this.mainDiv.offsetLeft - addWidth + 'px';// 左边的距离（相当于左边位置横坐标）等于选取框距父级元素的距离减去增加的宽度
          this.setCroppPosition();
        },
        setChoice() {
          const top = this.mainDiv.offsetTop;
          const right = this.mainDiv.offsetLeft + this.mainDiv.offsetWidth;
          const bottom = this.mainDiv.offsetTop + this.mainDiv.offsetHeight;
          const left = this.mainDiv.offsetLeft;
          // this.img2.style.clip = 'rect("+top+"px,"+right+"px,"+bottom+"px,"+left+"px)';
        },
      },
      watch: {
        aspectratio(value) {
          $('#box').css('width', this.width);
          $('#box').css('height', this.height);
          if (this.width/this.height >= value) {
            $('#main').css('height', this.height);
            $('#main').css('width', this.height * value);
            // this.mainDiv.style.height = this.height;
            // this.mainDiv.style.width = this.height * value;
            $('#main').css('left', (this.width - this.mainDiv.offsetWidth + 2) / 2);
            $('#main').css('top', 0);
          } else {
            $('#main').css('width', this.width);
            $('#main').css('height', this.width / value);
            // this.mainDiv.style.width = this.width;
            // this.mainDiv.style.width = this.width / value;
            $('#main').css('left', 0);
            $('#main').css('top', (this.height - this.mainDiv.offsetHeight + 2) / 2);
          }
          this.setCroppPosition();
        },
      },
    };

</script>

<style scoped>
  #img2{
    position: absolute;
    top: 0;
    left: 0;
  }
  /*#box{*/
    /*width: 500px;*/
    /*height: 380px;*/
    /*position: absolute;*/
    /*margin: 0 auto;*/
    /*top: 100px;*/
    /*left: 200px;*/
    /*box-shadow: 10px 10px 5px #888888;*/
  /*}*/
  #box {
    width: 1200px;
    height: 675px;
    overflow: hidden;
    /*position: absolute;*/
  }
  #main{
    position: absolute;/*第三层需用绝对定位浮在上面*/
    width: 200px;
    height: 200px;
    left: 0px;
    top: 0px;
    border: 1px solid #fff;
  }
  .Divmin{
    position: absolute;
    width: 8px;
    height: 8px;
    background: #fff;
  }
  #up-left{
    margin-top: -4px;
    margin-left: -4px;
    cursor: nwse-resize;

  }
  #up{
    left: 50%;/*父元素盒子main宽度的一半，注意要有绝对定位*/
    margin-left:-4px;
    top: -4px;
    cursor: ns-resize;
  }
  #up-right{
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
  }
  #right{
    top: 50%;
    margin-top: -4px;
    right: -4px;
    cursor: ew-resize;
  }
  #down-right{
    right: -4px;
    bottom: -4px;
    cursor: nwse-resize;
  }
  #down{
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
    cursor: ns-resize;
  }
  #down-left{
    left: -4px;
    bottom: -4px;
    cursor: nesw-resize;
  }
  #left{
    left: -4px;
    top: 50%;
    margin-top: -4px;
    cursor: ew-resize;
  }
</style>
