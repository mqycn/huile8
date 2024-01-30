const https = require("https");
function checkGistExistence(accessToken, username, filename, description) {
    return new Promise((resolve, inject) => {
        if (!accessToken || !username) {
            return resolve(false);
        }
        const options = {
            hostname: "api.github.com",
            path: `/users/${username}/gists`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Your-User-Agent",
                Authorization: `token ${accessToken}`,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                const gists = JSON.parse(data);
                // console.log(gists);
                const exists = gists.find((gist) => {
                    let hasFile = Object.keys(gist.files).some((file) => {
                        return file === filename;
                    });
                    let hasDescription = gist.description === description;
                    return hasFile && hasDescription;
                });
                if (exists) {
                    // console.log('Gist exists.');
                    resolve(exists.id);
                } else {
                    // console.log('Gist does not exist.');
                    resolve(false);
                }
            });
        });

        req.on("error", (error) => {
            // inject(error)
        });

        req.end();
    });
}
function createGist(accessToken, filename, content, description) {
    return new Promise((resolve, inject) => {
        if (!accessToken) {
            return resolve(false);
        }
        const data = {
            files: {
                [filename]: {
                    content: content,
                },
            },
            description: description,
            public: false,
        };

        const options = {
            hostname: "api.github.com",
            path: "/gists",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Your-User-Agent",
                Authorization: `token ${accessToken}`,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                // console.log(JSON.parse(data));
                const gist = JSON.parse(data);
                resolve(gist.id);
            });
        });

        req.on("error", (error) => {
            // console.error(error);
            // inject(error)  // 抛出错误，便于后续操作
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

function editGist(accessToken, gistId, filename, content) {
    return new Promise((resolve, inject) => {
        if (!accessToken) {
            return resolve(false);
        }
        const data = {
            files: {
                [filename]: {
                    content: content,
                },
            },
        };

        const options = {
            hostname: "api.github.com",
            path: `/gists/${gistId}`,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Your-User-Agent",
                Authorization: `token ${accessToken}`,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                // console.log(JSON.parse(data));
                const gist = JSON.parse(data);
                resolve(gist.id); // 返回修改后的gist数据，便于后续操作
            });
        });

        req.on("error", (error) => {
            console.error(error);
            // inject(error)  // 抛出错误，便于后续操作  // 抛出错误，便于后续操作)
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}
function getGistContent(accessToken, gistId, fileName) {
    return new Promise((resolve, inject) => {
        if (!accessToken) {
            return resolve(false);
        }
        const options = {
            hostname: "api.github.com",
            path: `/gists/${gistId}`,
            method: "GET",
            headers: {
                "User-Agent": "Your-User-Agent",
                Authorization: `token ${accessToken}`,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                const gist = JSON.parse(data);
                let findFile = false;
                for (const file in gist.files) {
                    if (file == fileName) {
                        findFile = gist.files[file];
                        break;
                    }
                }
                if (findFile) {
                    // @ts-ignore
                    resolve(findFile.content);
                } else {
                    resolve("");
                }
            });
        });

        req.on("error", (error) => {
            // inject(error)  // 抛出错误，便于后续操作  // 抛出错误，便于后续操作)
        });

        req.end();
    });
}
module.exports = {
    checkGistExistence,
    createGist,
    editGist,
    getGistContent,
};
