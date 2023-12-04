const https = require('https');
function checkGistExistence(accessToken, username, filename, description) {
    return new Promise((resolve, inject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/users/${username}/gists`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Your-User-Agent',
                'Authorization': `token ${accessToken}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
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
                    resolve(exists.id)
                } else {
                    // console.log('Gist does not exist.');
                    resolve(false)
                }
            });
        });

        req.on('error', (error) => {
            // inject(error)
        });

        req.end();
    })
}
function createGist(accessToken, filename, content, description) {
    return new Promise((resolve, inject) => {
        const data = {
            files: {
                [filename]: {
                    content: content
                }
            },
            description: description,
            public: true
        };

        const options = {
            hostname: 'api.github.com',
            path: '/gists',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Your-User-Agent',
                'Authorization': `token ${accessToken}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                // console.log(JSON.parse(data));
                const gist = JSON.parse(data)
                resolve(gist.id)
            });
        });

        req.on('error', (error) => {
            // console.error(error);
            // inject(error)  // 抛出错误，便于后续操作
        });

        req.write(JSON.stringify(data));
        req.end();
    })

}

function editGist(accessToken, gistId, filename, content) {
    return new Promise((resolve, inject) => {
        const data = {
            files: {
                [filename]: {
                    content: content
                }
            }
        };

        const options = {
            hostname: 'api.github.com',
            path: `/gists/${gistId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Your-User-Agent',
                'Authorization': `token ${accessToken}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                // console.log(JSON.parse(data));
                const gist = JSON.parse(data)
                resolve(gist.id)  // 返回修改后的gist数据，便于后续操作
            });
        });

        req.on('error', (error) => {
            console.error(error);
            // inject(error)  // 抛出错误，便于后续操作  // 抛出错误，便于后续操作)
        });

        req.write(JSON.stringify(data));
        req.end();
    })
}
function getGistContent(accessToken, gistId, fileName) {
    return new Promise((resolve, inject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/gists/${gistId}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Your-User-Agent',
                'Authorization': `token ${accessToken}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const gist = JSON.parse(data);
                let findFile = false
                for (const file in gist.files) {
                    if (file == fileName) {
                        findFile = gist.files[file]
                        break
                    }
                }
                if (findFile) {
                    // @ts-ignore
                    resolve(findFile.content)
                } else {
                    resolve('')
                }
            });
        });

        req.on('error', (error) => {
            // inject(error)  // 抛出错误，便于后续操作  // 抛出错误，便于后续操作)
        });

        req.end();
    })

}
async function test() {
    // 使用示例
    const accessToken = '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';
    let gistId = 'YOUR_GIST_ID';
    const filename = '学会的单词.md';
    // 使用示例
    // const accessToken = 'YOUR_ACCESS_TOKEN';
    // const filename = 'example.txt';
    const content = '测试';
    const content2 = 'app\nalias';
    const description = 'huile8已经学会的单词';

    const username = 'tlff';

    const e = await checkGistExistence(username, filename, description)
    console.log(e);
    if (!e) {
        gistId = e
        createGist(accessToken, filename, content, description);
    } else {
        // editGist(accessToken, e, filename, content2);
        let content = await getGistContent(accessToken, e, filename)
        console.log(content);
    }
}
test()
module.exports = {
    checkGistExistence,
    createGist,
    editGist,
    getGistContent
}
// createGist(accessToken, filename, content, description);


// const newContent = 'This is the new content of the Gist.';

// editGist(accessToken, gistId, filename, newContent);
