const http = uni.$u.http

//获取地址
export const getAddressTable = (params) => http.post('/user/getAddressTable', params)  
//设置地址
export const setAddress = (params) => http.post('/user/setAddress', params)  
//获取地址列表
export const getAddressList = () => http.post('/user/getAddressList')  