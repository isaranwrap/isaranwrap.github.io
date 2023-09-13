// window.alert(5);
const fs = require('fs');
// const filePath = 'strubg';
fs.readFile('../data/clicks.txt', 'utf8', (err, data) => {
    if(err) {
         console.error(err);
         return;
    }
    console.log(data);
    console.log(new Date());
});

const dateCurrent = new Date();
const date = "\n" + dateCurrent.toString()

fs.appendFile('../data/clicks.txt', date, err => {
    if(err){
        console.err;
        return;
    }
});

// window.alert(5);