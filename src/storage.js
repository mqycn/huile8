const fs = require("fs");
const path = require("path");

const dbFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "huile8-mastered-list.txt"
);

const masteredList = new Set();

const {
    checkGistExistence,
    createGist,
    editGist,
    getGistContent,
} = require("./gist");
const config = require("./config");
const des = "huile8";
const fileName = "huile8-mastered-list.txt";
let userName = config.gistId.value;
let token = config.gistToken.value;
config.gistToken.change(() => {
    userName = config.gistId.value;
    token = config.gistToken.value;
    initdata();
});
config.gistId.change(() => {
    userName = config.gistId.value;
    token = config.gistToken.value;
    initdata();
});
let gistId = false;
initdata();
// 读取记录
async function initdata() {
    if (fs.existsSync(dbFile)) {
        const json = fs.readFileSync(dbFile).toString();
        json.split("\n").forEach((word) => {
            if (word.trim()) {
                masteredList.add(word.trim());
            }
        });
    }
    await init();
    // console.log('tlf-gist', token, gistId, fileName)
    const content = await getGistContent(token, gistId, fileName);
    // console.log('tlf-gist', content)
    content.split("\n").forEach((word) => {
        if (word.trim()) {
            masteredList.add(word.trim());
        }
    });
}
async function init() {
    if (!gistId) {
        let id = await checkGistExistence(token, userName, fileName, des);
        if (id) {
            gistId = id;
        } else {
            await createGist(token, fileName, "init", des);
        }
        return;
    }
}

async function saveToGist() {
    const list = Array.from(masteredList).map((word) => {
        return word.trim();
    });
    const content = list.join("\n");
    console.log("tlf-gist-saveToGist", gistId);
    if (!gistId) {
        let id = await checkGistExistence(token, userName, fileName, des);
        if (id) {
            gistId = id;
        } else {
            await createGist(token, fileName, content, des);
        }
        return;
    }
    // console.log('tlf-gist-baocun', content)
    if (gistId) {
        await editGist(token, gistId, fileName, content);
    }
}
// 保存到硬盘
function saveToFile() {
    const list = Array.from(masteredList).map((word) => {
        return word;
    });
    fs.writeFileSync(dbFile, list.join("\n"));
}

// 是否包含单词
function hasMastered(item) {
    return masteredList.has(item);
}

// 添加单词记录
function addMastered(item) {
    masteredList.add(item);
    saveToFile();
    saveToGist();
}

// 删除单词记录
function removeMastered(item) {
    masteredList.delete(item);
    saveToFile();
    saveToGist();
}

module.exports = {
    hasMastered,
    addMastered,
    removeMastered,
};
