const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', 'resources', 'mastered-list.json');

const masteredList = new Set();

// 读取记录
if (fs.existsSync(dbFile)) {
    const json = fs.readFileSync(dbFile).toString();
    JSON.parse(json).forEach(word => {
        masteredList.add(word);
    });
}

// 保存到硬盘
function saveToFile() {
    const list = Array.from(masteredList).map(word => {
        return word;
    });
    fs.writeFileSync(dbFile, JSON.stringify(list));
}

// 是否包含单词
function hasMastered(item) {
    return masteredList.has(item);
}

// 添加单词记录
function addMastered(item) {
    masteredList.add(item);
    saveToFile();
}

// 删除单词记录
function removeMastered(item) {
    masteredList.delete(item);
    saveToFile();
}

module.exports = {
    hasMastered,
    addMastered,
    removeMastered
};