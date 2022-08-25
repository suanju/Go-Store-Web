const http = uni.$u.http

//微信登入
export const wxAuthorization = (params) => http.post('/login/wxAuthorization', params)
//注册
export const register = (params) => http.post('/login/register', params)
//邮箱验证码
export const sendEmailVerificationCode = (params) => http.post('/login/sendEmailVerificationCode', params)
//登入
export const getLogin = (params) => http.post('/login/login', params)
//忘记密码 邮箱验证码
export const sendEmailVerificationCodeByForget = (params) => http.post('login/sendEmailVerificationCodeByForget',params)
//忘记密码
export const forget = (params) => http.post('/login/forget', params)
