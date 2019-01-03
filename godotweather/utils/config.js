
const HEWEATHER_API = 'https://free-api.heweather.net/s6/weather'
// 生活指数图片基地址
const LIFESTYLE_BASE_URL = 'https://6465-demo-57510e-1257978613.tcb.qcloud.la/miniWeather/images/lifestyle'
const config = {
  // 和风天气个人开发key
  weatherKey: '69b0f6ef875f4337a22a342d125e0d28',
  // 腾讯地图开发key
  qqMapKey: 'JFPBZ-LQFKW-SX2RD-ODRB7-Z2R55-5LBK4',
  // 实时天气接口地址
  nowWeatherUrl: `${HEWEATHER_API}/now`,
  // 逐日天气
  dailyWeatherUrl: `${HEWEATHER_API}/forecast`,
  // 逐小时预报
  hourlyWeatherUrl: `${HEWEATHER_API}/hourly`, 
  //生活指数接口
  lifestyleUrl: `${HEWEATHER_API}/lifestyle`,
  


  // 右侧索引条
  indexBar: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
}

module.exports = config