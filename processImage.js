function onImageClicked(event) {
  var outputCanvas =  document.getElementById("outputcanvas");
  var image = event.target;

  var minThicknessInMM = 0.8;
  var zScale = 0.008627450980392158;
  var vertexPixelRatio = 4  //=4
  var positive = true ; //=true
  var dontMirror = true;  //=true
  var flip = false;  //=false
  var stampWidth = 331; //=315
  var stampHeight = 400;  //=400
  var repeatX = 1
  var repeatY = 1
  var mirrorRep = false;  //=false
  var flipRep = false; //=false

  // we'll need the 2D context to manipulate the data
  var canvas_context = outputCanvas.getContext("2d");
  canvas_context.beginPath();
  canvas_context.lineWidth = "1";
  canvas_context.fillStyle = "black";
  canvas_context.rect(0, 0, outputCanvas.width, outputCanvas.height);
  canvas_context.fill();
  //fill the canvas black then place the image in the centre leaving black pixels to form the border
  layoutImage(image, canvas_context, stampWidth, stampHeight, image.edgeThickness, image.edgeThickness, repeatX, repeatY, mirrorRep, flipRep, dontMirror, flip);

  // image_data points to the image metadata including each pixel value
  var image_data = canvas_context.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

  // pixels points to the canvas pixel array, arranged in 4 byte blocks of Red, Green, Blue and Alpha channel
  var pixels = image_data.data;
  var numb_pixels = pixels.length / 4; // the number of pixels to process

  var heightData = new Float32Array(numb_pixels); // an array to hold the result data

  var image_pixel_offset = 0; // current image pixel being processed
  var height_pixel_index = 0; // current position in the height data
  for (var y = 0, h = image_data.height; y < h; y++)
  {
    for (var x = 0, w = image_data.width; x < w; x++)
    {
      image_pixel_offset = (((flip ? (h - 1) - y : y) * w) + (dontMirror ? (w - 1) - x : x)) * 4;
      height_pixel_index = x + (((h - 1) - y) * w);
      //height_pixel_index=(dontMirror?w-x:x)+(y*w);
      // extract red,green and blue from pixel array
      var red_channel = pixels[image_pixel_offset],
        green_channel = pixels[image_pixel_offset + 1],
        blue_channel = pixels[image_pixel_offset + 2];
      // create negative monochrome value from red, green and blue values
      var negative_average;
      if (positive)
      {
        negative_average = (red_channel * 0.299 + green_channel * 0.587 + blue_channel * 0.114);
      }
      else
      {
        negative_average = 255 - (red_channel * 0.299 + green_channel * 0.587 + blue_channel * 0.114);
      }
      //heightData[height_pixel_index] = negative_average;
      heightData[height_pixel_index] = (minThicknessInMM + (negative_average * zScale)) * vertexPixelRatio; // store scaled value in height array

      // store value back in canvas in all channels for 2D display of negative monochrome image
      pixels[image_pixel_offset] = pixels[image_pixel_offset + 1] = pixels[image_pixel_offset + 2] = negative_average;
      image_pixel_offset += 4; // offest of next pixel in RGBA byte array
    }
  }
  // display modified image
  canvas_context.putImageData(image_data, 0, 0, 0, 0, image_data.width, image_data.height);
  //return (heightData);
  setLevels(heightData, image_data.width, image_data.height);

  function layoutImage (image,context,imageX,imageY,offsetX,offsetY,repX,repY,mirrorRep,flipRep,dontMirror,flip)
  {
    for (var x=0;x<repX;x++)
    {
      for (var y=0;y<repY;y++)
      {
        var mirroring=((mirrorRep)&&(x%2===((dontMirror)?1:0)));
        var flipping=((flipRep)&&(y%2===((flip)?0:1)));
        context.save();
        context.scale(mirroring?-1:1,flipping?-1:1);
        context.drawImage(image,mirroring?(0-imageX)-(offsetX+imageX*x):(offsetX+imageX*x),flipping?(0-imageY)-(offsetY+imageY*y):(offsetY+imageY*y),imageX,imageY);
        context.restore();
      }
    }
  }
}
