import axios from 'axios';
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

exports.genLabelImage = function(key, text) {
  const dir = './imageLabel'
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  const canvas = createCanvas(200, 200, 'png');
  var ctx = canvas.getContext("2d");
  ctx.font = '30px Impact';
  // Resize image according to text length
  const label = ctx.measureText(text)
  ctx.canvas.height = 35;
  ctx.canvas.width = label.width + 20;
  // Draw background
  ctx.fillStyle = "#2196F3"; // blue[500] from Material UI
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw Text
  ctx.fillStyle = "white";
  ctx.fillText(text, 10, 30);
  var buf = canvas.toBuffer();
  fs.writeFileSync(`${dir}/${key}.png`, buf);
};

exports.genCircularLabelImage = function(key, text) {
  const dir = './imageLabel'
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  const canvas = createCanvas(200, 200, 'png');
  var ctx = canvas.getContext("2d");
  ctx.font = '30px Impact';
  // Resize image according to text length (Resize to square)
  const label = ctx.measureText(text)
  ctx.canvas.height = label.width + 20;
  ctx.canvas.width = label.width + 20;
  // Draw background
  ctx.fillStyle = "#9C27B0"; // purple[500] from Material UI
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw Text
  ctx.fillStyle = "white";
  ctx.fillText(text, 10, (label.width + 30) / 2 + 10);
  var buf = canvas.toBuffer();
  fs.writeFileSync(`${dir}/${key}.png`, buf);
};
