const imgFile = document.getElementById('img_file');
const previewImg = document.getElementById('img_preview');
const croppedImg = document.getElementById('img_cropped');
const x_pos = document.getElementById('x');
const y_pos = document.getElementById('y');
const width_crop = document.getElementById('width');
const height_crop = document.getElementById('height');
const saveFileName = document.getElementById('save_file');

// 创建canvas对象
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
let cropSize = { x: 0, y: 0, width: 0, height: 0 };

imgFile.addEventListener('change', () => {
  const reader = new FileReader();
  reader.readAsDataURL(imgFile.files[0]);
  reader.onloadend = function (e) {
    previewImg.src = e.target.result;
    // 在img 对象的src 属性是空字符串(“”)的时候，
    // 浏览器认为这是一个缺省值，值的内容为当前网页的路径。
    // 浏览器会用当前路径进行再一次载入，并把其内容作为图像的二进制内容并试图显示。
    // croppedImg.src = ''; 这是不对的
    croppedImg.removeAttribute('src');
  };
});

const handleClickCrop = () => {
  const x_val = x_pos.value;
  const y_val = y_pos.value;
  const width_val = width_crop.value;
  const height_val = height_crop.value;
  if (x_val && y_val && width_val && height_val) {
    cropSize = { ...cropSize, x: x_val, y: y_val, width: width_val, height: height_val };
    getImage(previewImg.src);
  } else {
    alert('Please fill in the parameters(x、y、width、height)');
  }
}

const handleClickSave = () => {
  if (croppedImg.src) {
    // 获取图片地址
    const url = croppedImg.src;
    // 创建一个a节点插入的document
    const a = document.createElement('a');
    // 模拟鼠标click点击事件
    const event = new MouseEvent('click');
    // 设置a节点的download属性值
    a.download = saveFileName.value || 'croppedImg';
    // 将图片的src赋值给a节点的href
    a.href = url;
    a.dispatchEvent(event);
  }
}

const getImage = function (base64) {
  // 创建图片对象
  const image = new Image();
  image.src = `${base64}`;
  image.onload = function () {
    // 获取原图宽高
    const height = this.height;
    const width = this.width;
    //设置canvas大小与原图宽高一致
    canvas.height = height;
    canvas.width = width;
    // 在canvas绘制图片
    ctx.drawImage(this, 0, 0, width, height);
    // 截图：
    drawRect();
  }
}

//创建新的空白canvas画布将矩阵渲染截图
const createNewCanvas = function (content, width, height) {
  const newCanvas = document.createElement('canvas');
  const newCtx = newCanvas.getContext('2d');
  newCanvas.width = width;
  newCanvas.height = height;
  // 将画布上指定矩形的像素数据，通过 putImageData() 方法将图像数据放回画布
  newCtx.putImageData(content, 0, 0);
  return newCanvas.toDataURL('image/png');
}

// 绘制截图矩阵
const drawRect = function () {
  // 截图宽度
  const w = cropSize.width;
  // 截图高度
  const h = cropSize.height;
  // 获取截图区域内容,截图区域的像素点矩阵
  const cutImage = ctx.getImageData(cropSize.x, cropSize.y, w, h);
  // 裁剪后的base64数据
  const newImage = createNewCanvas(cutImage, w, h);
  croppedImg.src = newImage;
};