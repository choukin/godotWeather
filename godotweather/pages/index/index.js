//index.js
//获取应用实例
const app = getApp()
const config = app.globalData.config
const api = app.globalData.api
const loading = app.globalData.loading
const util = app.globalData.util
// 支持 async await
const regeneratorRuntime = require('../../lib/regenerator')
Page({
  data: {
    grettings: '', // 问候语
    bgImgUrl: '', // 背景图片
    location: '', // 地理坐标
    geoDes: '定位中...', // 地理位置描述
    nowWeather: { // 实时天气数据
      tmp: 'N/A', // 温度
      condTxt: '', // 天气实况
      winDir: '', // 风向
      winSpd: '', // 风速
      pres: '', // 大气压
      hum: '', // 湿度
      pcpn: '', // 降雨量
      condIconUrl: '', // 天气图片
      loc: '' // 当地时间
    },
    days: ['','',''],
    dailyWeather: [],
    hourlyWeather: [],
    lifestyle: []// 生活指数

  },
  ...loading,
  onShow() {
    this.init()
  },
  init() {
    this.loading({ flag: true })
    this.initGreetings()
    this.initWeatherInfo()
    this.loading({ flag: false })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toSearchGeo: function() {
    wx.navigateTo({
      url: '../searchGeo/searchGeo',
    })
  },

  onPullDownRefresh() {
    this.init()
    wx.stopPullDownRefresh()
  },

  initGreetings(){
    this.setData({
      grettings: util.greetings()
    })
  },
  async initWeatherInfo() {
    await this.getLocation()
  },
  async getLocation() {
    let position = wx.getStorageSync('POSITION')
    position = position?JSON.parse(position):position
    if (position) {
      this.setData({
        location: `${position.longitude},${position.latitude}`,
        geoDes: position.title
      })
      return
    }

    await api.getLocation()
    .then(res=>{
      let {longitude, latitude} = res
      this.setData({
        location: `${longitude},${latitude}`
      })
      this.getGeoDes({ longitude,latitude})
    }).catch(err=>{
      console.log(err)
    })
  },
  getGeoDes (options) {
    api.reverseGeocoder(options)
      .then(res=>{
        let addressComponent = res.address_component // 地址部件，address不满足需求时可自行拼接
        let geoDes = `${addressComponent.city}${addressComponent.district}${addressComponent.street_number}`
        this.setData({
          geoDes
        })
      })
  },
  onLoad() {
   
  }
})
