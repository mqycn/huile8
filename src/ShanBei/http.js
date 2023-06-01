// @ts-nocheck
const axios = require('axios')
const { Config } = require('./config')
const { window } = require('vscode');


const service = axios.create({
    baseURL: "https://apiv3.shanbay.com",
    timeout: 3 * 1000
})
service.defaults.withCredentials = true;


service.interceptors.request.use(config => {
    let defaultConfig = Config.getInstance()
    if (defaultConfig.getToken()) {
        config.headers['Cookie'] = `auth_token=${defaultConfig.getToken().value}`
    }
    return config
})


service.interceptors.response.use((response) => {
    return response.data
}, error => {
    if (error.response.status === 401) {
        window.showInformationMessage(`扇贝英语登录过期，请重新登录！`);
    }
    return Promise.reject(error)
})

function getService() {
    return service
}

module.exports = {
    getService
}
