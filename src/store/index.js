/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    removing: 0,
    uploaded: false,
    cropping: false,
    transfering: false,
    resultUrl: '',
    sourceWidth: 0,
    sourceHeight: 0,
    actionType: '',
    // 上传的图片信息
    imgMsg: {
      type: '',
      name: '',
      url: '',
      width: 0,
      height: 0,
    },
    sourceImgMsg: {
      url: '',
      width: 0,
      height: 0,
    },
    cropper: null,
    cropp: {
      aspectratio: 1,
      croppX: 0,
      croppY: 0,
      croppWidth: 0,
      croppHeight: 0,
    },
    // 图像参数调整
    imgArguments: {
      isCurvesChg: 0,
      brightness: 0,
      contrast: 0,
      rotate: 0,
      hue: 0,
      saturation: 0,
      radius: 0,
      sigma: 0,
      colorTables: [],
      // hue
      hueRed: 0,
      hueOrange: 0,
      hueYellow: 0,
      hueGreen: 0,
      hueCyan: 0,
      hueBlue: 0,
      huePurple: 0,
      channels_7: [],
      isHsl: 0,
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
    },
    imgFilter: '',
    storeUrl: '',
    sourceurl: '',
  },
  getters: {

  },
  mutations: {
    setRemoving(state) {
      state.removing += 1;
    },
    cancelRemoving(state) {
      state.removing = false;
    },
    setRemoveAll(state) {
      state.uploaded = false;
      state.uploaded = false;
      state.cropping = false;
      state.transfering = false;
      state.actionType = '';
      // 上传的图片信息
      state.imgMsg= {
        type: '',
        name: '',
        url: '',
        width: 0,
        height: 0,
      };
      state.sourceImgMsg = {
        url: '',
        width: 0,
        height: 0,
      };
      state.cropper = null;
      state.cropp = {
        aspectratio: 1,
        croppX: 0,
        croppY: 0,
        croppWidth: 0,
        croppHeight: 0,
      };
      // 图像参数调整
      state.imgArguments = {
        isCurvesChg: 0,
        brightness: 0,
        contrast: 0,
        rotate: 0,
        hue: 0,
        saturation: 0,
        radius: 0,
        sigma: 0,
        colorTables: [],
        // hue
        hueRed: 0,
        hueOrange: 0,
        hueYellow: 0,
        hueGreen: 0,
        hueCyan: 0,
        hueBlue: 0,
        huePurple: 0,
        channels_7: [],
        isHsl: 0,
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
      };
      state.imgFilter = '';
      state.storeUrl = '';
      state.sourceurl = '';
    },
    storeResult(state, url) {
      state.storeUrl = url;
    },
    setImgMsg(state, imgMsg) {
      state.imgMsg = imgMsg;
    },
    setSourceImgMsg(state, imgMsg) {
      state.sourceImgMsg = imgMsg;
    },
    setImgUrl(state, url) {
      state.imgMsg.url = url;
    },
    cropImgMsg(state, cropMsg) {
      state.imgMsg.url = cropMsg.url;
      state.imgMsg.name = cropMsg.name;
    },
    setUpload(state) {
      state.uploaded = true;
    },
    cancelUpload(state) {
      state.uploaded = false;
    },
    setCropping(state) {
      state.cropping = true;
    },
    cancelCropping(state) {
      state.cropping = false;
    },
    setActionType(state, type) {
      state.actionType = type;
    },
    setCropper(state, cropper) {
      state.cropper = cropper;
    },
    setBrightness(state, val) {
      state.imgArguments.brightness = val;
    },
    setContrast(state, val) {
      state.imgArguments.contrast = val;
    },
    setRotate(state, val) {
      state.imgArguments.rotate = val;
    },
    setHue(state, val) {
      state.imgArguments.hue = val;
    },
    setSaturation(state, val) {
      state.imgArguments.saturation = val;
    },
    setBlurRadius(state, val) {
      state.imgArguments.radius = val;
    },
    setBlurSigma(state, val) {
      state.imgArguments.sigma = val;
    },
    setChannels(state, val) {
      state.imgArguments.channels_7 = val;
    },
    setIsHsl(state, val) {
      state.imgArguments.isHsl = val;
    },
    setIsCurvesChg(state, val) {
      state.imgArguments.isCurvesChg = val;
    },
    setColorTables(state, val) {
      state.imgArguments.colorTables = val;
    },
    setGreyscale(state, val) {
      state.imgArguments.greyscale = val;
    },
    setInvert(state, val) {
      state.imgArguments.invert = val;
    },
    setBlur(state, val) {
      state.imgArguments.blur = val;
    },
    setNoise(state, val) {
      state.imgArguments.noise = val;
    },
    setSharpen(state, val) {
      state.imgArguments.sharpen = val;
    },
    setVignette(state, val) {
      state.imgArguments.vignette = val;
    },
    setFilter(state, val) {
      state.imgFilter = val;
    },
    setAspectRatio(state, val) {
      state.cropp.aspectratio = val;
    },
    setCroppX(state, val) {
      state.cropp.croppX = val;
    },
    setCroppY(state, val) {
      state.cropp.croppY = val;
    },
    setCroppWidth(state, val) {
      state.cropp.croppWidth = val;
    },
    setCroppHeight(state, val) {
      state.cropp.croppHeight = val;
    },
    setSourceUrl(state, val) {
      state.sourceurl = val;
    },
    startColorTansfer(state) {
      state.transfering = true;
    },
    cancelColorTansfer(state) {
      state.transfering = false;
    },
    setSourceWidth(state, val) {
      state.sourceWidth = val;
    },
    setSourceHeight(state, val) {
      state.sourceHeight = val;
    },
    setResultUrl(state, val) {
      state.resultUrl = val;
    },
  },
  actions: {
    setRemoving({ commit }) {
      commit('setRemoving');
    },
    cancelRemoving({ commit }) {
      commit('cancelRemoving');
    },
    setRemoveAll({ commit }) {
      commit('setRemoveAll');
    },
    storeResult({ commit }, url) {
      commit('storeResult', url);
    },
    setImgMsg({ commit }, imgMsg) {
      commit('setImgMsg', imgMsg);
    },
    setSourceImgMsg({ commit }, imgMsg) {
      commit('setSourceImgMsg', imgMsg);
    },
    setImgUrl({ commit }, url) {
      commit('setImgUrl', url);
    },
    cropImgMsg({ commit }, cropMsg) {
      commit('cropImgMsg', cropMsg);
    },
    setUpload({ commit }) {
      commit('setUpload');
    },
    setCropping({ commit }) {
      commit('setCropping');
    },
    cancelUpload({ commit }) {
      commit('cancelUpload');
    },
    cancelCropping({ commit }) {
      commit('cancelCropping');
    },
    setActionType({ commit }, actionType) {
      commit('setActionType', actionType);
    },
    setCropper({ commit }, cropper) {
      commit('setCropper', cropper);
    },
    setBrightness({ commit }, val) {
      commit('setBrightness', val);
    },
    setContrast({ commit }, val) {
      commit('setContrast', val);
    },
    setRotate({ commit }, val) {
      commit('setRotate', val);
    },
    setHue({ commit }, val) {
      commit('setHue', val);
    },
    setSaturation({ commit }, val) {
      commit('setSaturation', val);
    },
    setBlurRadius({ commit }, val) {
      commit('setBlurRadius', val);
    },
    setBlurSigma({ commit }, val) {
      commit('setBlurSigma', val);
    },
    setChannels({ commit }, val) {
      commit('setChannels', val);
    },
    setIsHsl({ commit }, val) {
      commit('setIsHsl', val);
    },
    setIsCurvesChg({ commit }, val) {
      commit('setIsCurvesChg', val);
    },
    setColorTables({ commit }, val) {
      commit('setColorTables', val);
    },
    setGreyscale({ commit }, val) {
      commit('setGreyscale', val);
    },
    setInvert({ commit }, val) {
      commit('setInvert', val);
    },
    setBlur({ commit }, val) {
      commit('setBlur', val);
    },
    setNoise({ commit }, val) {
      commit('setNoise', val);
    },
    setSharpen({ commit }, val) {
      commit('setSharpen', val);
    },
    setVignette({ commit }, val) {
      commit('setVignette', val);
    },
    testFilter({ commit }, val) {
      commit('testFilter', val);
    },
    setFilter({ commit }, val) {
      commit('setFilter', val);
    },
    setAspectRatio({ commit }, val) {
      commit('setAspectRatio', val);
    },
    setCroppX({ commit }, val) {
      commit('setCroppX', val);
    },
    setCroppY({ commit }, val) {
      commit('setCroppY', val);
    },
    setCroppWidth({ commit }, val) {
      commit('setCroppWidth', val);
    },
    setCroppHeight({ commit }, val) {
      commit('setCroppHeight', val);
    },
    setSourceUrl({ commit }, val) {
      commit('setSourceUrl', val);
    },
    startColorTansfer({ commit }) {
      commit('startColorTansfer');
    },
    cancelColorTansfer({ commit }) {
      commit('cancelColorTansfer');
    },
    setSourceWidth({ commit }, val) {
      commit('setSourceWidth', val);
    },
    setSourceHeight({ commit }, val) {
      commit('setSourceHeight', val);
    },
    setResultUrl({ commit }, val) {
      commit('setResultUrl', val);
    },
  },
});
