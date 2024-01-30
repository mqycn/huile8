const request = require("request");
const config = require("./config");
export async function getBaiduAccessKey() {
    return new Promise((resolve, reject) => {
        const apiKey = config.baiduApiKey.value;
        const secretKey = config.baiduSecretKey.value;
        var options = {
            method: "POST",
            url: `https://aip.baidubce.com/oauth/2.0/token?client_id=${apiKey}&client_secret=${secretKey}&grant_type=client_credentials`,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        request(options, function (error, response) {
            if (error) reject(error);
            console.log(response.body);
        });
    });
}
