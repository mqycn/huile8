// @ts-ignore
const puppeteer = require('puppeteer');
const { FileDB } = require('./fileDB');
const { window } = require('vscode');
const { Config } = require('./config');


function logRequest(interceptedRequest, callback) {
  if(interceptedRequest.url().indexOf('checkin') != -1){
    callback()
  }
}


async function getToken() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://web.shanbay.com/bayaccount/login');
  let loginStatus = false
  page.on('request', (interceptedRequest)=>logRequest(interceptedRequest, async ()=>{
    let cookie = await page.cookies()
    let token = cookie.find(item=>item.name === 'auth_token')
    if(token && !loginStatus){
      let fileDB = new FileDB("ShanBeiToken")
      fileDB.saveToFile(JSON.stringify(token))

      let config = Config.getInstance()
      config.setToken(token)
      
      loginStatus = true
      window.showInformationMessage('扇贝英语，登录成功');
      try {
        await page.close();
      } catch {
        
      }
      await browser.close();
    }
  }));
  await page.waitForTimeout(1 * 60 * 1000);
  try {
    await page.close();
  } catch {
    
  }
  try {
    await browser.close();
  } catch {
    
  }
}

function getShanBeiToken(){
  getToken()
}

module.exports = {
  getShanBeiToken
}
