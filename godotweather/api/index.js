const config = require('../utils/config.js')
const QQMAPWX = require('../lib/qqmap-wx-jssdk.js')


/**
 * 腾讯地图实例
 */
const qqMapWX = new QQMAPWX({
  key: config.qqMapKey
})

/**
 * 天气接口公共参数
 */
const commonParam = {
  key: config.key,
  lang: 'cn',
  location: 'beijing',
  unit: 'm' // 单位选择，公制（m）或英制（i）
}

/**
 * 获取地理位置信息
 */
const getLocation = ()=> {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: '',
      altitude: true,
      success: function (res) { 
        resolve(res)
      },
      fail: function (res) {
        reject(res)
       },
      complete: function (res) { },
    })
  })
}

/**
 * 将城市按照字母表顺序进行排序
 */
const sortCityList = (data) => {
  if (!Array.isArray(data)) {
    return []
  }
  // 组合
  let d = data.reduce((pre, current) => {
    let {pinyin, ...attr}  = current
    pre.push({
      inital: pinyin.join('').toUpperCase(),
      ...attr
    })
    return pre
  },[])
 // 排序
  d.sort((a, b) => {
    return (a.inital > b.inital)?1:-1
  })

  return d
}

const getCityList = () => {
  // 从缓存中取
  let CITY_LIST = wx.getStorageSync('CITY_LISTY')
  if (CITY_LIST) {
    return Promise.resolve(CITY_LIST)
  }

  // 从接口获取
  return new Promise((resolve, reject) => {
    // 调用接口
    qqMapWX.getCityList({
      success: function (res) {
        if (res.status === 0) {
          CITY_LIST = sortCityList(res.result[1]||[])
          wx.setStorage({key:'CITY_LIST', data:CITY_LIST})
          resolve(CITY_LIST)
        } else {
          reject(res)
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        console.log(res);
      }
    });
  })
}
/**
 *  用于获取输入关键字的补完与提示，帮助用户快速输入
 * */
const getSuggestion= (options)=>{
  return new Promise((resolve, reject) => {
    qqMapWX.getSuggestion({
      ...options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        console.log(res);
      }
    });
  })
}

module.exports = {
  getLocation,
  getCityList,
  getSuggestion
}