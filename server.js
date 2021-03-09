const express = require('express')
const fs = require('fs')
const pako = require('pako')

let app = express();

app.use(express.urlencoded({'extended': false}));
app.use(express.json());
app.set('view engine', 'ejs')

app.use(express.static('views'));

const image = "photo.bmp"
const text = "Dazai_Osamu_No_longer_human.txt"

function compressImage() {
    let originalImage = new Uint8Array(fs.readFileSync(`images/${image}`, null))
    let output = pako.deflate(originalImage)
    fs.writeFile(`images/${image}.pako`, Buffer.from(output), function (err) {});
}

function compressText() {
    let originalText = new Uint8Array(fs.readFileSync(`texts/${text}`, null))
    let output = pako.deflate(originalText)
    fs.writeFile(`texts/${text}.pako`, Buffer.from(output), function (err) {});
}

compressImage()
compressText()

app.get('/scripts/pako.min.js', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/scripts/pako.min.js');
});

app.get('/', function(req, res) {
    res.render('compression.ejs');
});

app.post('/originalText', function(req, res) {
    res.contentType("text")
    res.sendFile(__dirname + `/texts/${text}`)
});
app.post('/compressedText', function(req, res) {
    res.contentType("text")
    res.sendFile(__dirname + `/texts/${text}.pako`)
});

app.post('/compressedImage', function(req, res) {
    res.contentType("application/octet-stream")
    res.sendFile(__dirname + `/images/${image}.pako`)
});

app.post('/originalImage', function(req, res) {
    res.contentType("application/octet-stream")
    res.sendFile(__dirname + `/images/${image}`)
});

app.listen(8080)