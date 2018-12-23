// 封装加载框
/**
 * 显示隐藏加载框
 */
const loading = ({flag = true, message=''}) =>  {
  flag ? showLoading(message): hideLoading()
}

/**
 * 显示加载框
 */
const showLoading = (message)=> {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: message || '拼命加载中...',
      success() {
        resolve()
      },
      fail(e) {
        reject(e.message)
      }
    })
  })
}

/**
 * 隐藏加载框
 */
const hideLoading = () => {
  return new Promise((resolve, reject) => {
    wx.hideLoading()
    resolve()
  })
}

module.exports = {
  loading,
  showLoading,
  hideLoading
}