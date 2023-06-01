const { FileDB, SBdb } = require("./fileDB");

class Config {
    constructor() {
        this.token = {};
        this.shanbeiWord = new SBdb('shanbei-word')
        this.init()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Config();
        }
        return this.instance;
    }

    setToken(token) {
        this.token = token
    }
    
    setTokenByFileDB() {
        let fileDB = new FileDB("shan-bei-token")
        if(fileDB.content){
            this.token = JSON.parse(fileDB.content)
        }
    }

    getToken() {
        return this.token
    }

    init(){
        this.setTokenByFileDB()
    }
}

module.exports = {
    Config
}