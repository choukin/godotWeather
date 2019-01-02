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
    days: ['今天', '明天', '后天'],
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
    // 获取地址信息
    await this.getLocation()
    // 获取实时天气
    await this.getNowWeather()


    // 获取逐日天气
    await this.getDailyWeather()
    //获取逐小时太拿起信息
    await this.getHourlyWeather()
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
 getNowWeather () {
    return new Promise((resolve, reject) => {
      api.getNowWeather({
        location: this.data.location
      }).then((res)=>{
        let data = res.HeWeather6[0]
        this.formatNowWeather(data)
        resolve()
      })
      .catch(err=>{
        reject(err)
      })
    })
  },
  formatNowWeather (data) {
    this.setData({
      nowWeather:{
        parentCity: data.basic.parent_city,
        location: data.basic.location,
        tmp: data.now.tmp,
        condTxt: data.now.cond_txt,
        windDir: data.now.wind_dir,
        winSc: data.now.wind_sc,
        windSped: data.now.wind_spd,
        pres: data.now.pres,
        hum: data.now.hum,
        pcpn: data.now.pcpn,
        loc: data.update.loc.slice(5).replace(/-/, '/')
      }
    })
  },
  // 获取逐日天气信息
  getDailyWeather() {
    return new Promise((resolve,reject) => {
      api.getDailyWeather({
        location:this.data.location
      })
        .then(res=>{
          let data = res.HeWeather6[0].daily_forecast
          this.formatDailyWeather(data)
          resolve()
        })
        .catch(err=>{
          reject(err)
        })
    })
  },
  formatDailyWeather(data) {
    let dailyWeather = data.reduce((pre, cur) => {
      pre.push({
        date: cur.date.slice(5).replace(/-/, '/'),
        condDIconUrl: '',//`${COND_ICON_BASE_URL}/${cur.cond_code_d}.png`, //白天天气状况图标
        condNIconUrl:'', // `${COND_ICON_BASE_URL}/${cur.cond_code_n}.png`, //晚间天气状况图标
        condTxtD: cur.cond_txt_d, // 白天天气状况描述
        condTxtN: cur.cond_txt_n, // 晚间天气状况描述
        sr: cur.sr, // 日出时间
        ss: cur.ss, // 日落时间
        tmpMax: cur.tmp_max, // 最高温度
        tmpMin: cur.tmp_min, // 最低气温
        windDir: cur.wind_dir, // 风向
        windSc: cur.wind_sc, // 风力
        windSpd: cur.wind_spd, // 风速
        pres: cur.pres, // 大气压
        vis: cur.vis // 能见度
      })

      return pre
    }, [])
    this.setData({
      dailyWeather
    })
  },

  getHourlyWeather() {
    return new Promise((resolve,reject)=>{
      api.getHourlyWeather({
        location:this.data.location
      }).then((res)=>{
       let data = res.HeWeather6[0].hourly
       this.formatHourlyWeather(data)
       resolve()
      }).catch(err=>{
        console.log(err)
        reject(err)
      })
    })
  },

  formatHourlyWeather(data){
    let formatData = data.reduce((pre, cur)=>{
      pre.push({
        date: cur.time.split(' ')[1],
        // condIconUrl: `${COND_ICON_BASE_URL}/${cur.cond_code}.png`, // 天气图标
        condTxt: cur.cond_txt, // 天气状况描述
        tmp: cur.tmp, // 气温
        windDir: cur.wind_dir, // 风向
        windSc: cur.wind_sc, // 风力
        windSpd: cur.wind_spd, // 风速
        pres: cur.pres // 大气压
      })
      return pre
    },[])

    let gap = 4
    let trip = Math.ceil(formatData.length/gap) 
      // 对一个数进行上舍入。
      let hourlyWeather = []
      // 
      for(let i=0;i<trip;i++){
        hourlyWeather.push(formatHourlyWeather.slice(i*gape,(i+1)*gape))
      }
    this.setData({
      hourlyWeather
    })
  },
  onLoad() {
 
  }
})
