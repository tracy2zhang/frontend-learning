function gaussBlur(imgData, radius, sigma) {
  var pixes = imgData.data;
  var width = imgData.width;
  var height = imgData.height;
  var gaussMatrix = [],
      gaussSum = 0,
      x, y,
      r, g, b, a,
      i, j, k, len;


  radius = Math.floor(radius) || 3;
  sigma = sigma || radius / 3;

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  b = -1 / (2 * sigma * sigma);
  //生成高斯矩阵
  for (i = 0, x = -radius; x <= radius; x++, i++) {
      g = a * Math.exp(b * x * x);
      gaussMatrix[i] = g;
      gaussSum += g;

  }
  //归一化, 保证高斯矩阵的值在[0,1]之间
  for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum;
  }
  //x 方向一维高斯运算
  for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for (j = -radius; j <= radius; j++) {
              k = x + j;
              if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
                  //r,g,b,a 四个一组
                  i = (y * width + k) * 4;
                  r += pixes[i] * gaussMatrix[j + radius];
                  g += pixes[i + 1] * gaussMatrix[j + radius];
                  b += pixes[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
              }
          }
          i = (y * width + x) * 4;
          // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
          // console.log(gaussSum)
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
          // pixes[i + 3] = a ;
      }
  }
  //y 方向一维高斯运算
  for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for (j = -radius; j <= radius; j++) {
              k = y + j;
              if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                  i = (k * width + x) * 4;
                  r += pixes[i] * gaussMatrix[j + radius];
                  g += pixes[i + 1] * gaussMatrix[j + radius];
                  b += pixes[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
              }
          }
          i = (y * width + x) * 4;
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
          // pixes[i] = r ;
          // pixes[i + 1] = g ;
          // pixes[i + 2] = b ;
          // pixes[i + 3] = a ;
      }
  }
  //end
  imgData.data = pixes;
  return imgData;
}

var canvasFilter = {
  invert : function(obj , i){
      obj[i] = 255 - obj[i];
      obj[i+1] = 255 - obj[i+1];
      obj[i+2] = 255 - obj[i+2];
  },
  grayscale : function(obj,i){
      var average = (obj[i] + obj[i+1] + obj[i+2]) / 3;
      //var average = 0.2126*obj[i] + 0.7152*obj[i+1] + 0.0722*obj[i+2]; 或者
      obj[i] = obj[i+1] = obj[i+2] = average;
  },
  sepia : function(obj , i){
      var r = obj[i],
          g = obj[i+1],
          b = obj[i+2];
      obj[i] = (r*0.393)+(g*0.769)+(b*0.189);
      obj[i+1] = (r*0.349)+(g*0.686)+(b*0.168);
      obj[i+2] = (r*0.272)+(g*0.534)+(b*0.131);
  },
  negative : function(obj , i){
      var r = obj[i],
          g = obj[i+1],
          b = obj[i+2];
      obj[i] = 255 - r;
      obj[i+1] = 255 - g;
      obj[i+2] = 255 - b;
  },
  brightness : function(obj , i , brightVal){
      var r = obj[i],
          g = obj[i+1],
          b = obj[i+2];
      obj[i] += brightVal;
      obj[i+1] += brightVal;
      obj[i+2] += brightVal;
  },
  threshold : function(obj , i , thresholdVal){
      var average = (obj[i] + obj[i+1] + obj[i+2]) / 3;
      obj[i] = obj[i+1] = obj[i+2] = average > thresholdVal ? 255 : 0;
  },
  relief : function(obj , i , canvas){
      if ((i+1) % 4 !== 0) { // 每个像素点的第四个（0,1,2,3  4,5,6,7）是透明度。这里取消对透明度的处理
          if ((i+4) % (canvas.width*4) == 0) { // 每行最后一个点，特殊处理。因为它后面没有边界点，所以变通下，取它前一个点
             obj[i] = obj[i-4];
             obj[i+1] = obj[i-3];
             obj[i+2] = obj[i-2];
             obj[i+3] = obj[i-1];
             i+=4;
          }
          else{ // 取下一个点和下一行的同列点
               obj[i] = 255/2         // 平均值
                        + 2*obj[i]   // 当前像素点
                        - obj[i+4]   // 下一点
                        - obj[i+canvas.width*4]; // 下一行的同列点
          }
      }
      else {  // 最后一行，特殊处理
           if ((i+1) % 4 !== 0) {
              obj[i] = obj[i-canvas.width*4];
           }
      }
  }
}