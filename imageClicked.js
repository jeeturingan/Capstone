function onImageClicked(event)
{
  var image = event.target; // the image that was clicked

  // point at canvas element that will show image data
  // once we've processed it
  var canvas = document.getElementById("outputcanvas");
  // make our canvas the same size as the image
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  // we'll need the 2D context to manipulate the data
  var canvas_context = canvas.getContext("2d");
  canvas_context.drawImage(image, 0, 0); // draw the image on our canvas

  // image_data points to the image metadata including each pixel value
  var image_data = canvas_context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  // pixels points to the canvas pixel array, arranged in 4 byte
  // blocks of Red, Green, Blue and Alpha channel
  var pixels = image_data.data;
  var numb_pixels=pixels.length/4; // the number of pixels to process
  var height_data = new Float32Array(numb_pixels); // an array to hold the result data
  var image_pixel_offset=0;// current image pixel being processed

  // go through each pixel in the image
  for (var height_pixel_index = 0; height_pixel_index < numb_pixels; height_pixel_index++)
  {
     // extract red,green and blue from pixel array
     var red_channel = pixels[image_pixel_offset ],
     green_channel = pixels[image_pixel_offset + 1],
     blue_channel = pixels[image_pixel_offset + 2],
     channels = red_channel + green_channel + blue_channel;

     // create negative monochrome value from red, green and blue values
     var negative_average = 255 - (red_channel * 0.299 + green_channel * 0.587 + blue_channel * 0.114);

     // store value in height array
     height_data[height_pixel_index]=negative_average;

     // store value back in canvas for display of negative monochrome image
     pixels[image_pixel_offset] = negative_average;
     pixels[image_pixel_offset + 1] = negative_average;
     pixels[image_pixel_offset + 2] = negative_average;

     image_pixel_offset+=4; // offest of next pixel in RGBA byte array
  }

  // display modified image
  image_data.data = pixels;
  canvas_context.putImageData(image_data, 0, 0, 0, 0, image_data.width, image_data.height);

  // create 3D lithophane using height data
  setLevels(height_data, image_data.width, image_data.height);

}
