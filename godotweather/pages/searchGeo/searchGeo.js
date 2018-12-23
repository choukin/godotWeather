// pages/searchGeo/searchGeo.js
const app = getApp()
const config = app.globalData.config
const api = app.globalData.api
const util = app.globalData.util
const loading = app.globalData.loading
const indexBar = config.indexBar
const regeneratorRuntime = require('../../lib/regenerator')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initValue:'', //搜索框初始值
    cityList:[], // 城市列表
    filterCities:[], // 可能查找的城市
    indexList: indexBar, // 拼音索引
    scrollIntoViewId: 'title_0', // 滚动到可视区索引标题id
    suggList:[], // 搜索提示数据
    isShowSugg: false, // 是否显示搜索提示浮层
    searchCls:'no-sugg', // 没有提示样式
    barIndex: 0, // 右边索引条索引值
    title: null

  },
  ...loading,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
      this.init()
  },

  async init () {
    await this.loading({ flag:true})
    await this.getCityList()
    await this.filterGuess()
    await this.hideLoading()
  },

  // 获取城市列表
  getCityList() {
    return new Promise((resolve, reject) => {
      api.getCityList().then((res) => {
        this.setData({
          cityList: res
        })
        console.log(this.data.cityList)
        resolve()
      })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  filterGuess () {
    return new Promise((resolve, reject) => {
      const filterName = ['北京市', '上海市', '广州市', '深圳市', '武汉市']
      const cityName = ['东城区', '黄浦区', '广州市', '深圳市', '武汉市']
      let filterCities = []
      let num = 0
      this.data.cityList.forEach((item) => {
        if (cityName.includes(item.fullname)) {
          let c = { ...item, fullname: filterName[num]}
          filterCities.push(c)
          num++
        }
      })
      this.setData({
        filterCities
      })
      resolve()
    })

  },
  // 城市列表滚动
  scroll: util.throttle(function () {
    wx.createSelectorQuery().selectAll('.city-list-title')
      .boundingClientRect((rects) => {
        let index = rects.findIndex((item) => {
          return item.top >= 0
        })
        if (index === -1) {
          index = rects.length
        }
        this.setIndex(index - 1)
      }).exec()
  }, 20),


  setIndex (index) {
   if (this.data.barIndex === index) {
     return false
   } else {
     this.setData({
       barIndex: index
     })
   }
  },

/**
 * 点击索引方法
 */
  tapIndexItem (event) {
    let id = event.currentTarget.dataset.item
    this.setData({
      scrollIntoViewId: `title_${id=='#'?0:id}`
    })

    setTimeout(()=>{
      this.setData({
        barIndex: this.data.indexList.findIndex(item=>{
          return item===id
        })
      })
    },500)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})