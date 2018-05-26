<template>
<div>
  <div class="tac custom-scrollbar" id="vpic_sidebar">
    <el-menu unique-opened class="el-menu-vertical-demo" theme="dark">
      <!--111111111-->
      <el-submenu index="1">
        <template slot="title"><i class="my-icon-edit my-icon"></i>颜色迁移</template>
        <el-menu-item-group>
          <el-menu-item data-name="target" index="1-1-1" style="height: 285px" v-show=tShow>
            <div class="val-tag clearfix">
              <span class="fl">目标图像</span>
              <div class="tar"
                   style="display: flex;
                          flex-flow: column;
                          justify-content: center;
                          align-items: center;"
              >
                <img :src="tarUrl"
                     width=100%
                     height=auto
                />
              </div>
            </div>
          </el-menu-item>
          <el-menu-item data-name="source" index="1-1-2" style="height: 285px" v-show=sShow>
            <div class="val-tag clearfix">
              <span class="fl">参考图像</span>
              <source-upload></source-upload>
              <div class="source"
                   style="display: flex;
                          flex-flow: column;
                          justify-content: center;
                          align-items: center;"
              >
                <img @click="dialogTableVisible = true"
                     :src="sourceUrl"
                     width=100%
                     height=auto
                />
                <el-dialog title="sourceImg" :visible.sync=dialogTableVisible>
                  <!--<img-->
                    <!--:src="sourceUrl"-->
                    <!--:width=sourceWidth-->
                    <!--:height=sourceHeight-->
                  <!--/>-->
                  <img
                    :src="sourceUrl"
                    width=100%
                    height=auto
                  />
                </el-dialog>
              </div>
            </div>
          </el-menu-item>
          <el-menu-item data-name="result" index="1-1-3" style="height: 285px" v-show=rShow>
            <div class="val-tag clearfix">
              <span class="fl">结果图像</span>
              <br/>
              <source-upload></source-upload>
              <div class="source">
                <img
                     :src="resultUrl"
                     :width=tarWidth
                     :height=tarHeight
                />
              </div>
            </div>
          </el-menu-item>
          <el-menu-item index="1-1-4" v-show=rShow>
            <el-button type="primary" @click="saveTransfer">确定</el-button>
            <el-button @click="cancelTransfer">取消</el-button>
          </el-menu-item>
          <el-menu-item index="1-1-5" v-show=sShow>
            <el-button type="primary" @click="startColorTansfer">开始迁移</el-button>
            <el-button @click="restColorTransfer">重置</el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--222222222222-->
      <el-submenu index="2">
        <template slot="title"><i class="my-icon-cut my-icon"></i>裁切</template>
          <el-menu-item-group>
            <el-menu-item v-for="cropItem in cropList" :index="cropItem.order" :data-aspectratio="cropItem.val" @click=setAspectRatio($event)>{{ cropItem.name }}</el-menu-item>
            <el-menu-item index="2-2-8" data-aspectratio="NaN" @click=setAspectRatio($event)>自由裁切</el-menu-item>
            <!--<el-menu-item index="1-1-6">-->
              <!--<el-button type="primary" @click="saveResult">确定</el-button>-->
              <!--<el-button @click="resetCropp">取消</el-button>-->
            <!--</el-menu-item>-->
          </el-menu-item-group>
      </el-submenu>
      <!--3333333333333-->
      <el-submenu index="3">
        <template slot="title"><i class="my-icon-edit my-icon"></i>旋转</template>
        <el-menu-item-group>
          <el-menu-item index="3-1-1">
            <div class="val-tag clearfix">
              <span class="fl">旋转</span>
              <span class="fr">{{ rotate }}</span>
            </div>
            <el-slider v-model="rotate" :min="-50" :max="50" :show-tooltip="false" @change="setRotate"></el-slider>
          </el-menu-item>
          <el-menu-item index="3-1-2">
            <el-button type="primary" @click="saveResult">确定</el-button>
            <el-button @click="resetRotate">重置</el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--4444444-->
      <el-submenu index="4">
        <template slot="title"><i class="my-icon-edit my-icon"></i>基础调整</template>
        <!--4-1-->
        <el-submenu index="4-1">
          <template slot="title">亮度 / 对比度</template>
          <el-menu-item-group>
            <el-menu-item index="4-1-1">
              <div class="val-tag clearfix">
                <span class="fl">亮度</span>
                <span class="fr">{{ brightness }}</span>
              </div>
              <el-slider v-model="brightness" :min="-50" :max="50" :show-tooltip="false" @change="setBrightness"></el-slider>
            </el-menu-item>
            <el-menu-item index="4-1-2">
              <div class="val-tag clearfix">
                <span class="fl">对比度</span>
                <span class="fr">{{ contrast }}</span>
              </div>
              <el-slider v-model="contrast" :min="-50" :max="50" :show-tooltip="false" @change="setContrast"></el-slider>
            </el-menu-item>
            <el-menu-item index="4-1-3">
              <el-button type="primary" @click="saveResult">确定</el-button>
              <el-button @click="resetBrightnessAndContrast">重置</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!--4-2-->
        <el-submenu index="4-2">
          <template slot="title">饱和度</template>
          <el-menu-item-group>
            <el-menu-item index="4-2-1">
              <div class="val-tag clearfix">
                <span class="fl">饱和度</span>
                <span class="fr">{{ saturation }}</span>
              </div>
              <el-slider v-model="saturation" :min="-50" :max="50" :show-tooltip="false" @change="setSaturation"></el-slider>
            </el-menu-item>
            <el-menu-item index="4-2-2">
              <el-button type="primary" @click="saveResult">确定</el-button>
              <el-button @click="resetSaturation">重置</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!--&lt;!&ndash;3-3&ndash;&gt;-->
        <!--<el-submenu index="3-3">-->
          <!--<template slot="title">灰度 / 反色</template>-->
          <!--<el-menu-item-group>-->
            <!--<el-menu-item index="3-3-1">-->
              <!--<div class="val-tag clearfix">-->
                <!--<span class="fl">灰度</span>-->
                <!--<span class="fr">{{ greyscale }}</span>-->
              <!--</div>-->
              <!--<el-switch v-model="greyscale" on-text="" off-text="" @change="setGreyscale" on-color="#7D5CFF"></el-switch>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-3-2">-->
              <!--<div class="val-tag clearfix">-->
                <!--<span class="fl">反色</span>-->
                <!--<span class="fr">{{ invert }}</span>-->
              <!--</div>-->
              <!--<el-switch v-model="invert" on-text="" off-text="" @change="setInvert" on-color="#7D5CFF"></el-switch>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-3-3">-->
              <!--<el-button type="primary" @click="saveResult">确定</el-button>-->
            <!--</el-menu-item>-->
          <!--</el-menu-item-group>-->
        <!--</el-submenu>-->
      </el-submenu>
      <!--5555555555-->
      <el-submenu index="5">
        <template slot="title"><i class="my-icon-edit my-icon"></i>曲线</template>
        <el-menu-item-group>
          <el-menu-item index="5-1-1" style="height: 285px">
            <canvas ref="curves" width="256" height="256" @mousedown=curveCanvasMouseDown($event)  @mousemove=curveCanvasMouseMove($event) @mouseup=curveCanvasMouseUp($event) ></canvas>
          </el-menu-item>
          <el-menu-item index="5-1-2">
            <el-button type="primary" @click="saveCurvesResult">确定</el-button>
            <el-button @click="resetCurves">重置</el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--66666666666-->
      <el-submenu index="6">
        <template slot="title"><i class="my-icon-edit my-icon"></i> HSL</template>
        <!--6-1-->
        <el-submenu index="6-1">
          <template slot="title">色相</template>
          <el-menu-item-group>
            <el-menu-item index="6-1-1">
              <div class="val-tag clearfix">
                <span class="fl">红</span>
                <span class="fr">{{ hueRed }}</span>
              </div>
              <el-slider v-model="hueRed" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueRed"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-2">
              <div class="val-tag clearfix">
                <span class="fl">橙</span>
                <span class="fr">{{ hueOrange }}</span>
              </div>
              <el-slider v-model="hueOrange" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueOrange"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-3">
              <div class="val-tag clearfix">
                <span class="fl">黄</span>
                <span class="fr">{{ hueYellow }}</span>
              </div>
              <el-slider v-model="hueYellow" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueYellow"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-4">
              <div class="val-tag clearfix">
                <span class="fl">绿</span>
                <span class="fr">{{ hueGreen }}</span>
              </div>
              <el-slider v-model="hueGreen" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueGreen"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-5">
              <div class="val-tag clearfix">
                <span class="fl">青</span>
                <span class="fr">{{ hueCyan }}</span>
              </div>
              <el-slider v-model="hueCyan" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueCyan"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-6">
              <div class="val-tag clearfix">
                <span class="fl">蓝</span>
                <span class="fr">{{ hueBlue }}</span>
              </div>
              <el-slider v-model="hueBlue" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHueBlue"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-7">
              <div class="val-tag clearfix">
                <span class="fl">紫</span>
                <span class="fr">{{ huePurple }}</span>
              </div>
              <el-slider v-model="huePurple" :min="-50" :max="50" :step="0.1" :show-tooltip="false" @change="setHuePurple"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-1-8">
              <el-button type="primary" @click="saveResult">确定</el-button>
              <el-button @click="resetHsl">重置</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!--6-2-->
        <el-submenu index="6-2">
          <template slot="title">饱和度</template>
          <el-menu-item-group>
            <el-menu-item index="6-2-1">
              <div class="val-tag clearfix">
                <span class="fl">红</span>
                <span class="fr">{{ saturationRed }}</span>
              </div>
              <el-slider v-model="saturationRed" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationRed"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-2">
              <div class="val-tag clearfix">
                <span class="fl">橙</span>
                <span class="fr">{{ saturationOrange }}</span>
              </div>
              <el-slider v-model="saturationOrange" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationOrange"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-3">
              <div class="val-tag clearfix">
                <span class="fl">黄</span>
                <span class="fr">{{ saturationYellow }}</span>
              </div>
              <el-slider v-model="saturationYellow" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationYellow"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-4">
              <div class="val-tag clearfix">
                <span class="fl">绿</span>
                <span class="fr">{{ saturationGreen }}</span>
              </div>
              <el-slider v-model="saturationGreen" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationGreen"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-5">
              <div class="val-tag clearfix">
                <span class="fl">青</span>
                <span class="fr">{{ saturationCyan }}</span>
              </div>
              <el-slider v-model="saturationCyan" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationCyan"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-6">
              <div class="val-tag clearfix">
                <span class="fl">蓝</span>
                <span class="fr">{{ saturationBlue }}</span>
              </div>
              <el-slider v-model="saturationBlue" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationBlue"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-7">
              <div class="val-tag clearfix">
                <span class="fl">紫</span>
                <span class="fr">{{ saturationPurple }}</span>
              </div>
              <el-slider v-model="saturationPurple" :min="-40" :max="40" :step="0.1" :show-tooltip="false" @change="setSaturationPurple"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-2-8">
              <el-button type="primary" @click="saveResult">确定</el-button>
              <el-button @click="resetHsl">重置</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!--6-3-->
        <el-submenu index="6-3">
          <template slot="title">明度</template>
          <el-menu-item-group>
            <el-menu-item index="6-3-1">
              <div class="val-tag clearfix">
                <span class="fl">红</span>
                <span class="fr">{{ lightnessRed }}</span>
              </div>
              <el-slider v-model="lightnessRed" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessRed"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-2">
              <div class="val-tag clearfix">
                <span class="fl">橙</span>
                <span class="fr">{{ lightnessOrange }}</span>
              </div>
              <el-slider v-model="lightnessOrange" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessOrange"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-3">
              <div class="val-tag clearfix">
                <span class="fl">黄</span>
                <span class="fr">{{ lightnessYellow }}</span>
              </div>
              <el-slider v-model="lightnessYellow" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessYellow"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-4">
              <div class="val-tag clearfix">
                <span class="fl">绿</span>
                <span class="fr">{{ lightnessGreen }}</span>
              </div>
              <el-slider v-model="lightnessGreen" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessGreen"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-5">
              <div class="val-tag clearfix">
                <span class="fl">青</span>
                <span class="fr">{{ lightnessCyan }}</span>
              </div>
              <el-slider v-model="lightnessCyan" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessCyan"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-6">
              <div class="val-tag clearfix">
                <span class="fl">蓝</span>
                <span class="fr">{{ lightnessBlue }}</span>
              </div>
              <el-slider v-model="lightnessBlue" :min="-15" :max="15" :step="0.1" :show-tooltip="false" @change="setLightnessBlue"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-7">
              <div class="val-tag clearfix">
                <span class="fl">紫</span>
                <span class="fr">{{ lightnessPurple }}</span>
              </div>
              <el-slider v-model="lightnessPurple" :min="-35" :max="35" :step="0.1" :show-tooltip="false" @change="setLightnessPurple"></el-slider>
            </el-menu-item>
            <el-menu-item index="6-3-8">
              <el-button type="primary" @click="saveResult">确定</el-button>
              <el-button @click="resetHsl">重置</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-submenu>
      <!--7777777777-->
      <el-submenu index="7">
        <template slot="title"><i class="my-icon-blur my-icon"></i>增强</template>
        <el-submenu index="7-1">
          <template slot="title">模糊</template>
          <el-menu-item index="7-1-1">
            <div class="val-tag clearfix">
              <span class="fl">半径</span>
              <span class="fr">{{ radius }}</span>
            </div>
            <el-slider v-model="radius" :min="0" :max="20" :show-tooltip="false" @change="setBlurRadius"></el-slider>
          </el-menu-item>
          <el-menu-item index="7-1-1">
            <div class="val-tag clearfix">
              <span class="fl">sigma</span>
              <span class="fr">{{ sigma }}</span>
            </div>
            <el-slider v-model="sigma" :min="0" :max="20" :show-tooltip="false" @change="setBlurSigma"></el-slider>
          </el-menu-item>
          <el-menu-item index="7-1-2">
            <el-button type="primary" @click="saveResult">确定</el-button>
            <el-button @click="resetBlur">重置</el-button>
          </el-menu-item>
        </el-submenu>
        <!--<el-submenu index="6-2">-->
          <!--<template slot="title">噪声</template>-->
          <!--<el-menu-item index="6-2-1">-->
            <!--<div class="val-tag clearfix">-->
              <!--<span class="fl">噪声</span>-->
              <!--<span class="fr">{{ noise }}</span>-->
            <!--</div>-->
            <!--<el-slider v-model="noise" :min="0" :max="50" :show-tooltip="false" @change="setNoise"></el-slider>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="6-2-2">-->
            <!--<el-button type="primary" @click="saveResult">确定</el-button>-->
            <!--<el-button @click="resetNoise">重置</el-button>-->
          <!--</el-menu-item>-->
        <!--</el-submenu>-->
        <el-submenu index="7-3">
          <template slot="title">锐化</template>
          <el-menu-item index="7-3-1">
            <div class="val-tag clearfix">
              <span class="fl">锐化</span>
              <span class="fr">{{ sharpen }}</span>
            </div>
            <el-slider v-model="sharpen" :min="0" :max="50" :show-tooltip="false" @change="setSharpen"></el-slider>
          </el-menu-item>
          <el-menu-item index="7-3-2">
            <el-button type="primary" @click="saveResult">确定</el-button>
            <el-button @click="resetSharpen">重置</el-button>
          </el-menu-item>
        </el-submenu>
      </el-submenu>
      <!--88888888-->
      <el-submenu index="8">
        <template slot="title"><i class="my-icon-edit my-icon"></i>暗角</template>
        <el-menu-item-group>
          <el-menu-item index="8-1-1">
            <div class="val-tag clearfix">
              <span class="fl">暗角</span>
              <span class="fr">{{ vignette }}</span>
            </div>
            <el-slider v-model="vignette" :min="0" :max="40" :show-tooltip="false" @change="setVignette"></el-slider>
          </el-menu-item>
          <el-menu-item index="8-1-2">
            <el-button type="primary" @click="saveVignette">确定</el-button>
            <el-button @click="resetVignette">重置</el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--999999999999-->
      <el-submenu index="9">
        <template slot="title"><i class="my-icon-edit my-icon"></i> 灰度 / 反色</template>
        <el-menu-item-group>
          <el-menu-item index="9-1-1">
            <div class="val-tag clearfix">
              <span class="fl">灰度</span>
              <span class="fr">{{ greyscale }}</span>
            </div>
            <el-switch v-model="greyscale" on-text="" off-text="" @change="setGreyscale" on-color="#7D5CFF"></el-switch>
          </el-menu-item>
          <el-menu-item index="9-1-2">
            <div class="val-tag clearfix">
              <span class="fl">反色</span>
              <span class="fr">{{ invert }}</span>
            </div>
            <el-switch v-model="invert" on-text="" off-text="" @change="setInvert" on-color="#7D5CFF"></el-switch>
          </el-menu-item>
          <el-menu-item index="9-1-3">
            <el-button type="primary" @click="saveResult">确定</el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--1010101010-->
      <el-submenu index="10">
        <template slot="title"><i class="my-icon-filter my-icon"></i>滤镜</template>
          <div>
            <el-row :gutter="5" class="filter-ct">
              <el-col :span="12" v-for="item in filterList">
                <div class="filter" :data-filter="item.name" :data-key="item.id" @click="setFilter" v-show="FilterListVisible">
                  <img class="filter-preview" :src="item.preview">
                  <p class="filter-name">{{ item.desc }}</p>
                </div>
              </el-col>
            </el-row>
            <div v-show="!FilterListVisible">
              <img class="filter-preview"
                   :src="filterList[filterId].preview">
              <el-menu-item index="10-1-1">
                <el-button type="primary" @click="saveFilter">确定</el-button>
                <el-button @click="restFilter">取消</el-button>
              </el-menu-item>
            </div>

          </div>
      </el-submenu>
    </el-menu>
  </div>
  <!--<div class="project-info">-->
    <!--<ul class="opensource">-->
      <!--<li class="item fl"><p class="title">Power by:</p></li>-->
      <!--<li class="item fl" v-for="item in opensource">-->
        <!--<a :href="item.link" target="_blank" class="clearfix">-->
          <!--<span class="icon fl" :style="item.logo"></span>-->
          <!--<p class="desc fl">{{ item.name }}</p>-->
        <!--</a>-->
      <!--</li>-->
    <!--</ul>-->
  <!--</div>-->
</div>
</template>

<script>
  import $ from 'jquery';
  import HSBChannel from '../assets/js/HSBChannel.js';
  import Curve from '../assets/js/curve2.js'
  import SourceUpload from '../components/sourceUpload';

  export default {
    data() {
      return {
        // 预选图片弹窗状态
        dialogTableVisible: false,
        tShow: true,
        sShow: true,
        rShow: false,
        originalUrl: '',
        cropList: [
          {
            order: '2-1-1',
            val: '16/9',
            name: '16:9',
          },
          {
            order: '2-1-2',
            val: '9/16',
            name: '9:16',
          },
          {
            order: '2-1-3',
            val: '4/3',
            name: '4:3',
          },
          {
            order: '2-1-4',
            val: '3/4',
            name: '3:4',
          },
          {
            order: '2-1-5',
            val: '3/2',
            name: '3:2',
          },
          {
            order: '2-1-6',
            val: '2/3',
            name: '2:3',
          },
          {
            order: '2-1-7',
            val: '1/1',
            name: '1:1',
          },
        ],
        curves: {},
        brightness: 0,
        contrast: 0,
        rotate: 0,
        hue: 0,
        saturation: 0,
        radius: 0,
        sigma: 0,
        isHsl: 0,
        curvesChgTimes: 0,
        // hue
        hueRed: 0,
        hueOrange: 0,
        hueYellow: 0,
        hueGreen: 0,
        hueCyan: 0,
        hueBlue: 0,
        huePurple: 0,
        // saturation
        saturationRed: 0,
        saturationOrange: 0,
        saturationYellow: 0,
        saturationGreen: 0,
        saturationCyan: 0,
        saturationBlue: 0,
        saturationPurple: 0,
        // lightness
        lightnessRed: 0,
        lightnessOrange: 0,
        lightnessYellow: 0,
        lightnessGreen: 0,
        lightnessCyan: 0,
        lightnessBlue: 0,
        lightnessPurple: 0,
        greyscale: false,
        invert: false,
        blur: 0,
        noise: 0,
        sharpen: 0,
        vignette: 0,
        sunrise: false,
        FilterListVisible: true,
        filterId: 0,
        filterList: [
          {
            id: 0,
            name: 'sunrise',
            preview: './static/image/filter-sunrise.jpg',
            desc: '日出辉映',
          },
          {
            id: 1,
            name: 'lomo',
            preview: './static/image/filter-lomo.jpg',
            desc: '经典Lomo',
          },
          {
            id: 2,
            name: 'clarity',
            preview: './static/image/filter-clarity.jpg',
            desc: '这一刻 更清晰',
          },
          {
            id: 3,
            name: 'hazyDays',
            preview: './static/image/filter-hazyDays.jpg',
            desc: '这一刻 更朦胧',
          },
          {
            id: 4,
            name: 'crossProcess',
            preview: './static/image/filter-crossProcess.jpg',
            desc: '怀旧电影',
          },
          {
            id: 5,
            name: 'concentrate',
            preview: './static/image/filter-concentrate.jpg',
            desc: '美式咖啡',
          },
          {
            id: 6,
            name: 'jarques',
            preview: './static/image/filter-jarques.jpg',
            desc: '抑郁深蓝',
          },
          {
            id: 7,
            name: 'nostalgia',
            preview: './static/image/filter-nostalgia.jpg',
            desc: '泛黄记忆',
          },
          {
            id: 8,
            name: 'pinhole',
            preview: './static/image/filter-pinhole.jpg',
            desc: '黑白胶片',
          },
          {
            id: 9,
            name: 'sinCity',
            preview: './static/image/filter-sinCity.jpg',
            desc: '水墨印染',
          },
        ],
        opensource: [
          {
            link: 'https://vuejs.org/',
            logo: 'background: url(./static/sprites/vue.png);',
            name: 'Vue.js',
          },
          {
            link: 'https://webpack.js.org/',
            logo: 'background: url(./static/sprites/webpack.png);',
            name: 'Webpack',
          },
          {
            link: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
            logo: 'background: url(./static/sprites/canvas.png);',
            name: 'Canvas',
          },
        ],
      };
    },
    components: {
      SourceUpload,
    },
    mounted() {
      this.curves = Curve.Curves.createNew();
      this.drawCurve();
    },
    computed: {
      isRemoveAll() {
        return this.$store.state.removing;
      },
      channels_7() {
        let channels = [];
        for (let i = 0 ; i < 7; i++){
          var channel = HSBChannel.HSBChannel.createNew();
          channel.setColorIndex(i);
          channels[i] = channel;
        }
        return channels;
      },
      tarUrl() {
        return this.$store.state.imgMsg.url;
      },
      sourceUrl() {
        return this.$store.state.sourceImgMsg.url;
      },
      resultUrl() {
        return this.$store.state.resultUrl;
      },
      tarWidth() {
        return this.$store.state.imgMsg.width/5;
      },
      tarHeight() {
        return this.$store.state.imgMsg.height/5;
      },
      sourceWidth() {
        return this.$store.state.sourceImgMsg.url;
      },
      sourceHeight() {
        return this.$store.state.sourceImgMsg.url;
      },
    },
    watch: {
      isRemoveAll(bool) {
        if (bool) {
          this.reset();
        }
      },
    },
    methods: {
      setAspectRatio(e) {
        const ratioMap = {
          '16/9': 16 / 9,
          '9/16': 9 / 16,
          '4/3': 4 / 3,
          '3/4': 3 / 4,
          '1/1': 1 / 1,
          '2/3': 2 / 3,
          '3/2': 3 / 2,
          NaN,
        };
        this.$store.dispatch('setCropping');
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setAspectRatio', ratioMap[e.$el.dataset.aspectratio]);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
        }
      },
      drawCurve() {
        let n = 0;
        const curveCanvas = this.$refs.curves;
        const curveCtx = curveCanvas.getContext('2d');
        curveCtx.beginPath();

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
        let z = new Array(256);
        this.curves.CurrentChannel.calcCurve(z);
        for (let i = 0 ; i < 256 ; i++) {
          if(z[i] < 0)
            z[i] = 0;
          if(z[i] > 255)
            z[i] = 255;
        }
        for (let i = 1; i < 256; ++i ) {
          curveCtx.beginPath()
          curveCtx.moveTo(i-1 , 255 - z[i-1]);
          curveCtx.lineTo(i , 255 - z[i]);
          curveCtx.closePath();
          curveCtx.stroke();
        }
        // draw control points
        for (let i = 0 ; i < this.curves.CurrentChannel.points.length ; i++, n++ ) {
          curveCtx.beginPath();
          curveCtx.rect(this.curves.CurrentChannel.points[i].x - 3 , 255 - this.curves.CurrentChannel.points[i].y - 3 , 6 , 6);
          curveCtx.closePath();
          curveCtx.stroke();
        }
      },
      curveCanvasMouseDown(e) {
        const curveCanvas = this.$refs.curves;
        const curveCtx = curveCanvas.getContext('2d');
        this.curves.mouseDown(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY - curveCanvas.getBoundingClientRect().top);
        curveCtx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
        this.drawCurve();
        this.curvesChgTimes += 0.01;
        this.$store.dispatch('setIsCurvesChg', this.curvesChgTimes);
        this.$store.dispatch('setColorTables', this.curves.createColorTables());
      },
      curveCanvasMouseMove(e) {
        const curveCanvas = this.$refs.curves;
        const curveCtx = curveCanvas.getContext('2d');
        if (this.curves.mouseMove(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY - curveCanvas.getBoundingClientRect().top))
        curveCtx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
        this.drawCurve();
        this.curvesChgTimes += 0.01;
        this.$store.dispatch('setIsCurvesChg', this.curvesChgTimes);
        this.$store.dispatch('setColorTables', this.curves.createColorTables());
      },
      curveCanvasMouseUp(e) {
        const curveCanvas = this.$refs.curves;
        const curveCtx = curveCanvas.getContext('2d');
        this.curves.mouseUp(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY - curveCanvas.getBoundingClientRect().top);
        //   // drawImgByCurves(current_pixelsData , curves.createColorTables());
        //   // e.preventDefault()
        curveCtx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
        this.drawCurve();
        this.curvesChgTimes += 0.01;
        this.$store.dispatch('setIsCurvesChg', this.curvesChgTimes);
        this.$store.dispatch('setColorTables', this.curves.createColorTables());
      },
      // clickCurves() {
      //   const curveCanvas = this.$refs.curves;
      //   const curveCtx = curveCanvas.getContext('2d');
      //   curveCanvas.mousedown = function (e) {
      //     console.log(2);
      //     this.curves.mouseDown(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY - curveCanvas.getBoundingClientRect().top);
      //     // drawImgByCurves(current_pixelsData , this.curves.createColorTables());
      //     curveCtx.clearRect(0,0,curveCanvas.width,curveCanvas.height);
      //     // console.log(this.curves.RGBChannel.points);
      //     this.curves.draw(curveCtx);
      //   };
      //   curveCanvas.mousemove = function (e) {
      //     if (this.curves.mouseMove(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY -  curveCanvas.getBoundingClientRect().top))
      //       // drawImgByCurves(current_pixelsData , curves.createColorTables());
      //     // e.preventDefault()
      //     curveCtx.clearRect(0,0,curveCanvas.width,curveCanvas.height);
      //     this.curves.draw();
      //   };
      //   curveCanvas.mouseup = function (e) {
      //     this.curves.mouseUp(e.clientX - curveCanvas.getBoundingClientRect().left, e.clientY -  curveCanvas.getBoundingClientRect().top);
      //     // drawImgByCurves(current_pixelsData , curves.createColorTables());
      //     // e.preventDefault()
      //     curveCtx.clearRect(0,0,curveCanvas.width,curveCanvas.height);
      //     this.curves.draw();
      //   };
      // },
      setBrightness() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setBrightness', this.brightness);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      setContrast() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setContrast', this.contrast);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.contrast = 0;
        }
      },
      setRotate() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setRotate', this.rotate);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      setHue() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setHue', this.hue);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      setSaturation() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setSaturation', this.saturation);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      setBlurRadius() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setBlurRadius', this.radius);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      setBlurSigma() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('setBlurSigma', this.sigma);
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
          this.brightness = 0;
        }
      },
      // 色相
      setHueRed() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueRed', this.hueRed);
        this.channels_7[1].hue = this.hueRed;
        this.$store.dispatch('setChannels', this.channels_7);
        // console.log(this.$store.state.imgArguments.channels_7);
      },
      setHueOrange() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueOrange', this.hueOrange);
        this.channels_7[1].hue = this.hueOrange;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setHueYellow() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueYellow', this.hueYellow);
        this.channels_7[2].hue = this.hueYellow;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setHueGreen() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueGreen', this.hueGreen);
        this.channels_7[3].hue = this.hueGreen;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setHueCyan() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueCyan', this.hueCyan);
        this.channels_7[4].hue = this.hueCyan;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setHueBlue() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHueBlue', this.hueBlue);
        this.channels_7[5].hue = this.hueBlue;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setHuePurple() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setHuePurple', this.huePurple);
        this.channels_7[6].hue = this.huePurple;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      // 饱和度
      setSaturationRed() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationRed', this.saturationRed);
        this.channels_7[1].saturation = this.saturationRed;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationOrange() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationOrange', this.saturationOrange);
        this.channels_7[1].saturation = this.saturationOrange;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationYellow() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationYellow', this.saturationYellow);
        this.channels_7[2].saturation = this.saturationYellow;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationGreen() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationGreen', this.saturationGreen);
        this.channels_7[3].saturation = this.saturationGreen;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationCyan() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationCyan', this.saturationCyan);
        this.channels_7[4].saturation = this.saturationCyan;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationBlue() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationBlue', this.saturationBlue);
        this.channels_7[5].saturation = this.saturationBlue;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setSaturationPurple() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setSaturationPurple', this.saturationPurple);
        this.channels_7[6].saturation = this.saturationPurple;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      // lightness
      setLightnessRed() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessRed', this.lightnessRed);
        this.channels_7[1].brightness = this.lightnessRed;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessOrange() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessOrange', this.lightnessOrange);
        this.channels_7[1].brightness = this.lightnessOrange;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessYellow() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessYellow', this.lightnessYellow);
        this.channels_7[2].brightness = this.lightnessYellow;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessGreen() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessGreen', this.lightnessGreen);
        this.channels_7[3].brightness = this.lightnessGreen;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessCyan() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessCyan', this.lightnessCyan);
        this.channels_7[4].brightness = this.lightnessCyan;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessBlue() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessBlue', this.lightnessBlue);
        this.channels_7[5].brightness = this.lightnessBlue;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setLightnessPurple() {
        this.isHsl += 1;
        this.$store.dispatch('setIsHsl', this.isHsl);
        // this.$store.dispatch('setLightnessPurple', this.lightnessPurple);
        this.channels_7[6].brightness = this.lightnessPurple;
        this.$store.dispatch('setChannels', this.channels_7);
      },
      setGreyscale() {
        this.$store.dispatch('setGreyscale', this.greyscale);
      },
      setInvert() {
        this.$store.dispatch('setInvert', this.invert);
      },
      setBlur() {
        this.$store.dispatch('setBlur', this.blur);
      },
      setNoise() {
        this.$store.dispatch('setNoise', this.noise);
      },
      setSharpen() {
        this.$store.dispatch('setSharpen', this.sharpen);
      },
      setVignette() {
        this.$store.dispatch('setVignette', this.vignette);
      },
      setFilter(e) {
        this.FilterListVisible = false;
        const $target = $(e.currentTarget);
        const filterType = $target.data('filter');
        this.filterId = $target.data('key');
        console.log(this.filterId);
        this.$store.dispatch('setFilter', filterType);
      },
      saveFilter() {
        this.FilterListVisible = true;
        this.$store.dispatch('setSaveFiltering', true);
        this.$store.dispatch('setFilter', '');
        this.$notify({
          title: '提示',
          message: '参数调整完成 可点击下载',
          type: 'success',
          duration: 1200,
        });
      },
      saveVignette() {
        this.$store.dispatch('setVignetteing', true);
        // this.$store.dispatch('setFilter', '');
        this.$notify({
          title: '提示',
          message: '参数调整完成 可点击下载',
          type: 'success',
          duration: 1200,
        });
        // this.vignette = 0;
      },
      saveResult() {
        this.FilterListVisible = true;
        const imgUrl = this.$store.state.storeUrl;
        this.$store.dispatch('setImgUrl', imgUrl);
        this.$store.dispatch('storeResult', '');
        this.$notify({
          title: '提示',
          message: '参数调整完成 可点击下载',
          type: 'success',
          duration: 1200,
        });
        this.brightness = 0;
        this.contrast = 0;
        this.saturation = 0;
        this.radius = 0;
        this.sigma = 0;
        this.isHsl = 0;
        this.greyscale = false;
        this.invert = false;
        this.sharpen = 0;
        this.rotate = 0;
        this.vignette = 0;
        // hue
        this.hueRed = 0;
        this.hueOrange = 0;
        this.hueYellow = 0;
        this.hueGreen = 0;
        this.hueCyan = 0;
        this.hueBlue = 0;
        this.huePurple = 0;
        // saturation
        this.saturationRed = 0;
        this.saturationOrange = 0;
        this.saturationYellow = 0;
        this.saturationGreen = 0;
        this.saturationCyan = 0;
        this.saturationBlue = 0;
        this.saturationPurple = 0;
        // lightness
        this.lightnessRed = 0;
        this.lightnessOrange = 0;
        this.lightnessYellow = 0;
        this.lightnessGreen = 0;
        this.lightnessCyan = 0;
        this.lightnessBlue = 0;
        this.lightnessPurple = 0;
        this.$store.dispatch('setIsHsl', 0);
      },
      startColorTansfer() {
        if (this.$store.state.uploaded) {
          this.originalUrl = this.$store.state.imgMsg.url;
          this.$store.dispatch('startColorTansfer');
          // this.$store.dispatch('setImgUrl', this.$store.state.resultUrl);
          this.tShow = false;
          this.sShow = false;
          this.rShow = true;
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
        }
      },
      restColorTransfer() {
        if (this.$store.state.uploaded) {
          this.$store.dispatch('cancelColorTansfer');
          this.$store.dispatch('setSourceImgMsg', {
            url: '',
            width: 0,
            height: 0,
          });
        } else {
          this.$message({
            message: '请先导入图片哦',
            type: 'warning',
          });
        }
      },
      saveTransfer() {
        const resultUrl = this.$store.state.resultUrl;
        this.$store.dispatch('setImgUrl', resultUrl);
        this.$store.dispatch('setSourceImgMsg', {
          url: '',
          width: 0,
          height: 0,
        });
        this.tShow = true;
        this.sShow = true;
        this.rShow = false;
      },
      cancelTransfer() {
        this.$store.dispatch('setImgUrl', this.originalUrl);
        this.$store.dispatch('storeResult', '');
        this.$store.dispatch('setSourceImgMsg', {
          url: '',
          width: 0,
          height: 0,
        });
        this.tShow = true;
        this.sShow = true;
        this.rShow = false;
      },
      saveCurvesResult() {
        const imgUrl = this.$store.state.storeUrl;
        this.$store.dispatch('setImgUrl', imgUrl);
        this.$store.dispatch('storeResult', '');
        this.$notify({
          title: '提示',
          message: '参数调整完成 可点击下载',
          type: 'success',
          duration: 1200,
        });
        this.resetCurves();
      },
      reset() {
        this.resetBrightnessAndContrast();
        this.resetHsl();
        this.resetCurves();
        this.resetBlur();
        this.resetVignette();
        this.resetRotate();
        this.resetSaturation();
        this.resetGrayscale();
        this.resetNoise();
        this.resetSharpen();
        this.restFilter();
      },
      restFilter() {
        this.FilterListVisible = true;
        this.$store.dispatch('setRestFiltering', true);
      },
      resetBrightnessAndContrast() {
        this.brightness = 0;
        this.contrast = 0;
      },
      resetHsl() {
        this.isHsl = 0;
        // hue
        this.hueRed = 0;
        this.hueOrange = 0;
        this.hueYellow = 0;
        this.hueGreen = 0;
        this.hueCyan = 0;
        this.hueBlue = 0;
        this.huePurple = 0;
        // saturation
        this.saturationRed = 0;
        this.saturationOrange = 0;
        this.saturationYellow = 0;
        this.saturationGreen = 0;
        this.saturationCyan = 0;
        this.saturationBlue = 0;
        this.saturationPurple = 0;
        // lightness
        this.lightnessRed = 0;
        this.lightnessOrange = 0;
        this.lightnessYellow = 0;
        this.lightnessGreen = 0;
        this.lightnessCyan = 0;
        this.lightnessBlue = 0;
        this.lightnessPurple = 0;
        this.$store.dispatch('setIsHsl', 0);
      },
      resetCropp() {
        this.$store.dispatch('cancelCropping');
      },
      resetCurves() {
        const curveCanvas = this.$refs.curves;
        const curveCtx = curveCanvas.getContext('2d');
        this.curves = Curve.Curves.createNew();
        curveCtx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);
        this.drawCurve();
        this.$store.dispatch('setColorTables', this.curves.createColorTables());
        this.curvesChgTimes = 0;
        this.$store.dispatch('setIsCurvesChg', this.curvesChgTimes);
      },
      resetBlur() {
        this.radius = 0;
        this.sigma = 0;
      },
      resetVignette() {
        this.vignette = 0;
      },
      resetRotate(){
        this.rotate = 0;
      },
      resetSaturation() {
        this.saturation = 0;
      },
      resetGrayscale() {
        this.greyscale = false;
        this.invert = false;
      },
      resetColor() {
        this.hue = 0;
        this.saturation = 0;
      },
      resetNoise() {
        this.noise = 0;
      },
      resetSharpen() {
        this.sharpen = 0;
      },
      read(file, callback = () => {}) {
        const imgReg = /^image\/\w+$/;
        const imgMaxSize = 3; // 上传图片最大体积，单位 mb
        const imgWarnSize = 0.8; // 上传图片警戒体积，单位 mb
        let reader = null;

        if (file) {
          if (imgReg.test(file.type)) {
            // fileReader读取的文件体积单位为字节 b
            const imgSize = file.size / (1024 * 1024);

            if (imgSize < imgMaxSize) {
              if (imgSize > imgWarnSize) {
                this.$notify({
                  title: '提示',
                  message: '图片体积过大 处理速度可能会下降',
                  type: 'warning',
                  duration: 4000,
                  offset: 120,
                });
              }
              reader = new FileReader(); // 实例化 Web Api FileReader
              reader.onload = () => {
                // 上传区域置空
                this.$store.dispatch('setUpload');
                // store传递类型以及文件信息
                this.$store.dispatch('setImgMsg', {
                  type: file.type,
                  name: file.name,
                  url: reader.result,
                });
                callback();
              };
              reader.readAsDataURL(file);
            } else {
              this.$message({
                message: '图片体积须低于3M 请重新选择',
                type: 'warning',
              });
              callback();
            }
          } else {
            this.$message({
              message: '请选择图片文件',
              type: 'warning',
            });
            callback();
          }
        } else {
          callback();
        }
      },
    },
  };
</script>

<style>
  .tar {
    overflow: hidden;
    margin-top: 35px;
    width: 100%;
    height: 200px;
  }
  .source {
    overflow: hidden;
    width: 100%;
    height: 235px;
  }
  .upload {
    width: 100%;
    height: 100%;
  }
  .source-upload-btn {
    /*position: relative;*/
    margin-top: 40px;
    width: 100%;
    height: 100%;
    /*line-height: 108px;*/
    border-radius: 10px;
    box-sizing: border-box;
    border: 2px dashed #ccc;
    transition: 0.2s;
  }
  .source-upload-btn:hover {
    background: #eee;
  }
  .source-upload-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url('../../static/sprites/plus.png') no-repeat;
  }
  .source-sr-only {
    cursor: pointer;
  }
  @media screen and (max-width: 1600px) {
    .primary-pic-ct {
      height: 300px;
    }

    .source-upload-btn{
      height: 200px;
      line-height: 208px;
    }
  }
  .fl { float: left; }
  .fr { float: right; }
  .clearfix:after { display: block; content: ''; clear: both; }
  .el-menu { border-radius: 0; }
  .el-menu-item-group__title { padding: 0; }
  .el-submenu .el-menu-item { position: relative; padding: 12px 30px !important; border-bottom: 1px solid #3c3f43; border-top: 1px solid #3c3f43; height: 80px; }
  .el-submenu .el-menu-item .val-tag { display: inline;  margin: 0; padding: 0; line-height: 1; font-size: 14px; color: #828890; }
  /*.el-menu */
  .el-submenu__title { padding-left: 80px !important; height: 60px; text-align: left; font-size: 18px; }
  .el-submenu__icon-arrow { right: 30px; }

  .el-slider__runway { margin: 18px 0; }
  .el-slider__runway, .el-slider__bar { height: 3px; }
  .el-slider__button-wrapper { line-height: 36px; }
  .el-slider__button { width: 11px; height: 11px; }

  .v-submenu { font-size: 14px; }
  .my-icon { display: inline-block; vertical-align: sub; margin-right: 10px; width: 24px; height: 24px; }
  .my-icon-cut { background: url('../../static/sprites/cut.png'); background-size: 24px 24px; }
  .my-icon-edit { background: url('../../static/sprites/editor.png'); background-size: 24px 24px; }
  .my-icon-blur { background: url('../../static/sprites/blur.png'); background-size: 24px 24px; }
  .my-icon-fun { background: url('../../static/sprites/fun.png'); background-size: 24px 24px; }
  .my-icon-filter { background: url('../../static/sprites/filter.png'); background-size: 24px 24px; }

  .opensource,
  .opensource .item,
  .opensource a{
    height: 100%;
  }
  .opensource {
    line-height: 30px;
  }

  .opensource .title {
    margin: 0;
    padding-left: 3px;
    font-size: 12px;
    color: #ddd;
  }

  .opensource .item {
    margin: 0 3px;
  }

  .opensource a {
    position: relative;
    display: inline-block;
    padding: 0 5px;
  }

  .opensource .icon {
    position: relative;
    top: 6px;
    width: 16px;
    height: 16px;
  }

  .opensource .desc {
    padding-left: 5px;
    margin: 0;
    font-size: 12px;
    color: #fff;
  }

  .filter-preview, .filter-ct {
    width: 100%;
  }
  .filter-ct {
    margin-bottom: 15px;
  }

  .filter-preview {
    display: block;
  }

  .filter {
    position: relative;
    right: -8px;
    margin-top: 15px;
    width: 90%;
    border: 2px solid #fff;
  }
  .filter:hover {
    box-shadow: 0 4px 8px 0 rgba(151, 168, 190, 0.6);
  }
  .filter-name {
    display: block;
    margin: 0;
    padding: 5px 0;
    font-size: 14px;
    background: #fff;
    color: #333;
  }
</style>
