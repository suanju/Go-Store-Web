const http = uni.$u.http

// post请求，获取home轮播图
export const getBannerList = () => http.post('/home/getBannerList') 
// post请求，获取home会场信息
export const getSpecialList = () => http.post('/home/getSpecialList') 
// post请求，获取tabs
export const getTabs = () => http.post('/good/getTabs')
// post请求，获取tabs商品
export const getTabsGoods = () => http.post('/good/getTabsGoods') 