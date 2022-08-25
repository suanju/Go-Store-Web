const http = uni.$u.http
// post请求，获取分类列表
export const getGoodsCategory = () => http.post('/good/getGoodsCategory') 
// post请求，根据分类获取列表
export const getClassifyByLevel = (params) => http.post('/good/getClassifyByLevel',params) 
// post请求，获取商品详情
export const getGoodInfo = (params) => http.post('/good/getGoodInfo',params) 
// post请求，收藏商品 
export const getCollection = (params) => http.post('/good/collection',params) 
// post请求，商品添加购物车 
export const addShoppingCart = (params) => http.post('/good/addShoppingCart',params) 
// post请求，获取购物车列表 
export const getShoppingCart = (params) => http.post('/good/getShoppingCart',params) 
// post请求，删除购物车数据
export const delShoppingCart = (params) => http.post('/good/delShoppingCart',params) 
// post请求，修改购物车购买数量
export const modifyInventory = (params) => http.post('/good/modifyInventory',params) 

