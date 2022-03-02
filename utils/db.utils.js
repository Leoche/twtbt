const readline = require('readline');
const fs = require('fs');
const filename = 'followers.txt';

const hasFollowed = (username) => {
    try {
        const data = fs.readFileSync(filename, 'utf8')
        return data.split('\n').includes(username)
    } catch (err) {
        console.log(err);
        return true;
    }
};

const addFollow = (username) => {
    try {
        const data = fs.readFileSync(filename, 'utf8')
        fs.writeFileSync(filename, data + '\n' + username)
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

module.exports = {
    hasFollowed,
    addFollow
}