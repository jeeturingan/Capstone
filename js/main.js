function initPage() { // called on page load
  // find heading in document and change the displayed text
  var headingText = document.getElementById('pageTitle');
  headingText.innerHTML = "2D to 3D Lithophane Generator™";
}

function previewFile() {
  var preview = document.querySelector('#preview');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function onImageClicked(event) {

  console.log(plain_text);
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
  var minThicknessInMM = 0.1;
  var ThickInMM = 3; //repeat
  var maxOutputHeight = ThickInMM - minThicknessInMM;
  var zScale = maxOutputHeight / 255;
  var vertexPixelRatio = 4; //repeat

  // go through each pixel in the image
  for (var height_pixel_index = 0; height_pixel_index < numb_pixels; height_pixel_index++)
  {
     // extract red,green and blue from pixel array
     var red_channel = pixels[image_pixel_offset ],
     green_channel = pixels[image_pixel_offset + 1],
     blue_channel = pixels[image_pixel_offset + 2],
     channels = red_channel + green_channel + blue_channel;

     // create positive monochrome value from red, green and blue values
     var negative_average = (red_channel * 0.299 + green_channel * 0.587 + blue_channel * 0.114);

     // store value in height array
     //height_data[height_pixel_index]=negative_average;
     height_data[height_pixel_index] = (minThicknessInMM + (negative_average * zScale)) * vertexPixelRatio; // store scaled value in height array

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
  //setLevels(height_data, image_data.height, image_data.width);
  setLevels(height_data, image_data.width, image_data.height);
}

function setLevels(heightData, width, height) {
  // TODO - create 3D data from height data
  //var lithoGeometry = new THREE.ParametricGeometry( getPoint, width, height );
  var lithoGeometry = new THREE.Geometry();
  lithoGeometry.vertices = processVectors(heightData, width, height);
  lithoGeometry.faces = processFaces(width, height);
  lithoGeometry.faceVertexUvs[0] = processUVs(width, height);
  lithoGeometry.mergeVertices();
  lithoGeometry.computeFaceNormals();
  lithoGeometry.computeVertexNormals();
  addBaseSizePos(lithoGeometry);

  var material = new THREE.MeshPhongMaterial({ color: 0x001040, specular: 0x006080, side: THREE.DoubleSide,shininess: 10 });//
  var lithoPart = new THREE.Mesh(lithoGeometry, material);

  //lithoMesh.position.set(-200, 250, -100);
  lithoPart.rotation.z += 180 * Math.PI / 180;
  //lithoPart.rotation.y += 180 * Math.PI / 180;
  lithoPart.receiveLight = true;
  //scene.add(lithoPart);

  function processVectors(heightData, width, height) {
    var i, j;
    var index = 0;
    var heightPixels = height;
    var widthPixels = width;
    var domeRatio = 1;
    height--;
    width--;

    var verts = [];
    verts.length = height * width;
    var height_pixel_index;
    for (i = 0; i <= height; i++) {
      for (j = 0; j <= width; j++) {
        var height_pixel_index = j + ((height - i) * widthPixels);
        if ((i === 0) || (i === height) || (((j === 0) || (j === width)))) {
          // make sure the edge pixels go down to the base
          heightData[height_pixel_index] = 0;
        }

        var y = heightPixels - i;
        y++;

        var z, x;
        var x = widthPixels - j;
        z = heightData[height_pixel_index];
        x++;
        verts[index] = new THREE.Vector3(x, y, z);
        index++;
      }
    }
    return verts;
  }
  function processFaces(width, height) {
    var i, j;
    var index = 0;
    var heightPixels = height;
    var widthPixels = width;
    height--;
    width--;
    var a, b, c, d;
    var yoffset = 0;
    var y1offset = widthPixels;

    var faces = [];
    faces.length = (height * width * 2);
    //faces.length = (height * width * 2)+(this.panelledBack?width*2:0);

    for (i = 0; i < height; i++) {
      var xoffset = 0;
      var x1offset = 1;
      for (j = 0; j < width; j++) {
        a = yoffset + xoffset;
        b = yoffset + x1offset;
        c = y1offset + x1offset;
        d = y1offset + xoffset;

        if (((j === 0) && (i === 0)) || ((j === width - 1) && (i === height - 1))) {
          faces[index++] = new THREE.Face3(a, b, c);
          faces[index++] = new THREE.Face3(c, d, a);
        } else {
          faces[index++] = new THREE.Face3(a, b, d);
          faces[index++] = new THREE.Face3(b, c, d);
        }

        if (this.panelledBack) {
          if (i === height - 1) {
            a = y1offset + xoffset;
            b = y1offset + x1offset;
            c = x1offset;
            d = xoffset;
            faces[index++] = new THREE.Face3(b, c, d);
            faces[index++] = new THREE.Face3(a, b, d);
          }
        }
        xoffset++;
        x1offset++;
      }
      yoffset += widthPixels;
      y1offset += widthPixels;
    }
    return faces;
  }
  function processUVs(width, height) {
    var i, j;
    var index = 0;
    height--;
    width--;
    var uva, uvb, uvc, uvd;
    index = 0;
    var uvs = [];
    uvs.length = height * width * 2;

    for (i = 0; i < height; i++) {
      // UV Array holds values from 0-1
      var yProp = i / height;
      var y1Prop = (i + 1) / height;

      for (j = 0; j < width; j++) {
        var xProp = j / width;
        var x1Prop = (j + 1) / width;
        uva = new THREE.Vector2(xProp, yProp);
        uvb = new THREE.Vector2(x1Prop, yProp);
        uvc = new THREE.Vector2(x1Prop, y1Prop);
        uvd = new THREE.Vector2(xProp, y1Prop);

        if (((j === 0) && (i === 0)) || ((j === width - 1) && (i === height - 1))) {
          uvs[index++] = [uva, uvb, uvc];
          uvs[index++] = [uvc.clone(), uvd, uva.clone()];
        } else {
          uvs[index++] = [uva, uvb, uvd];
          uvs[index++] = [uvb.clone(), uvc, uvd.clone()];
        }

        if (this.panelledBack) {
          if (i === height - 1) {
            yProp = 0;
            y1Prop = 1;
            uva = new THREE.Vector2(xProp, yProp);
            uvb = new THREE.Vector2(x1Prop, yProp);
            uvc = new THREE.Vector2(x1Prop, y1Prop);
            uvd = new THREE.Vector2(xProp, y1Prop);
            uvs[index++] = [uvb.clone(), uvc, uvd.clone()];
            uvs[index++] = [uva, uvb, uvd];
          }
        }
      }
    }
    return uvs;
  }
  function addBaseSizePos(lithoGeometry) {
      var toGeometry=lithoGeometry;
      var WidthInMM=78.75; //=78.75
      var HeightInMM=100; //=100
      var ThickInMM=3; //=3
      var borderThicknessInMM=0;  //=0
      var baseDepth=0;  //=0
      var vertexPixelRatio=4;  //=4
      // adjust to exact size required - there is always 1 pixel less on the
      // width & height due to the vertices being positioned in the middle of each pixel
      toGeometry.computeBoundingBox();
      var gWidth = (toGeometry.boundingBox.max.x - toGeometry.boundingBox.min.x);
      var gHeight = (toGeometry.boundingBox.max.y - toGeometry.boundingBox.min.y);
      var gThick = (toGeometry.boundingBox.max.z - toGeometry.boundingBox.min.z);

      gWidth /= vertexPixelRatio;
      gHeight /= vertexPixelRatio;
      gThick /= vertexPixelRatio;
      toGeometry.applyMatrix(new THREE.Matrix4().makeScale(WidthInMM / gWidth, HeightInMM / gHeight, ThickInMM / gThick));
      // centre mesh
      toGeometry.center();
      // Place on floor
      toGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, ThickInMM * vertexPixelRatio / 2));
      // add a base

      toGeometry.center();
      toGeometry.computeBoundingBox();
      toGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0 - toGeometry.boundingBox.min.z));
  }

  mergeGeoms(lithoPart, processBraille (plain_text), lithoBraille);

  var lithoBrailleMat = new THREE.MeshPhongMaterial({color: 0x001040});
  var lithoBrailleMesh = new THREE.Mesh(lithoBraille, lithoBrailleMat);
  scene.add (lithoBrailleMesh);


  animate();
}

//Braille Translation

function mergeGeoms(objOne, objTwo, mergedGeom) {
  objOne.updateMatrix(); // as needed
  mergedGeom.merge(objOne.geometry, objOne.matrix);

  objTwo.updateMatrix(); // as needed
  mergedGeom.merge(objTwo.geometry, objTwo.matrix);
}

function processBrailleDot(x, y, z) {
  var dotGeom = new THREE.CylinderGeometry( 2, 2, 5, 32 );
  var dotMat = new THREE.MeshPhongMaterial( {color: 0xffff00} );
  brailleDot = new THREE.Mesh( dotGeom, dotMat );
  brailleDot.position.set(x, y, z);
  brailleDot.rotation.x += 90 * Math.PI / 180;
  return brailleDot;
}

function processBraille (plainText) {
  console.log(document.getElementById('plain_text').value);
  braille = document.getElementById('plain_text').value.split('');
  var i;
  var col = 0, row = 0;
  var x_coords = [-140, -133, -140, -133, -140, -133];
  var y_coords = [-210, -210, -217, -217, -224, -224];
  var z_coords = [11, 11, 11, 11, 11, 11];

  var finalGeom = new THREE.Geometry();

  var tabGeom = new THREE.BoxGeometry( 314.7, 60, 12 );
  var tabMat = new THREE.MeshPhongMaterial( {color: 0x001040} );
  var tabCube = new THREE.Mesh( tabGeom, tabMat );
  tabCube.position.y = -229;
  tabCube.position.z = 6;
  scene.add( tabCube );

  for (i=0; i < braille.length; i++)
  {
    if (braille[i] == "+")
    {
      braille[i] = " ";
    }

    else
    {
      col++;
      if (row <= 1)
      {
        if (braille[i] == "a" || braille[i] == "b" ||
        braille[i] == "c" || braille[i] == "d" ||
        braille[i] == "e" || braille[i] == "f" ||
        braille[i] == "g" || braille[i] == "h" ||
        braille[i] == "k" || braille[i] == "l" ||
        braille[i] == "m" || braille[i] == "n" ||
        braille[i] == "o" || braille[i] == "p" ||
        braille[i] == "q" || braille[i] == "r" ||
        braille[i] == "u" || braille[i] == "v" ||
        braille[i] == "x" || braille[i] == "y" ||
        braille[i] == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[0], y_coords[0], z_coords[0]), tabCube, finalGeom);
        }

        if (braille[i] == "c" || braille[i] == "d" ||
        braille[i] == "f" || braille[i] == "g" ||
        braille[i] == "i" || braille[i] == "j" ||
        braille[i] == "m" || braille[i] == "n" ||
        braille[i] == "p" || braille[i] == "q" ||
        braille[i] == "s" || braille[i] == "t" ||
        braille[i] == "w" || braille[i] == "x" ||
        braille[i] == "y")
        {
          mergeGeoms(processBrailleDot(x_coords[1], y_coords[1], z_coords[1]), tabCube, finalGeom);
        }

        if (braille[i] == "b" || braille[i] == "f" ||
        braille[i] == "g" || braille[i] == "h" ||
        braille[i] == "i" || braille[i] == "j" ||
        braille[i] == "l" || braille[i] == "p" ||
        braille[i] == "q" || braille[i] == "r" ||
        braille[i] == "s" || braille[i] == "t" ||
        braille[i] == "v" || braille[i] == "w")
        {
          mergeGeoms(processBrailleDot(x_coords[2], y_coords[2], z_coords[2]), tabCube, finalGeom);
        }

        if (braille[i] == "d" || braille[i] == "e" ||
        braille[i] == "g" || braille[i] == "h" ||
        braille[i] == "j" || braille[i] == "n" ||
        braille[i] == "o" || braille[i] == "q" ||
        braille[i] == "r" || braille[i] == "t" ||
        braille[i] == "w" || braille[i] == "y" ||
        braille[i] == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[3], y_coords[3], z_coords[3]), tabCube, finalGeom);
        }

        if (braille[i] == "k" || braille[i] == "l" ||
        braille[i] == "m" || braille[i] == "n" ||
        braille[i] == "o" || braille[i] == "p" ||
        braille[i] == "q" || braille[i] == "r" ||
        braille[i] == "s" || braille[i] == "t" ||
        braille[i] == "u" || braille[i] == "v" ||
        braille[i] == "x" || braille[i] == "y" ||
        braille[i] == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[4], y_coords[4], z_coords[4]), tabCube, finalGeom);
        }

        if (braille[i] == "u" || braille[i] == "v" ||
        braille[i] == "w" || braille[i] == "x" ||
        braille[i] == "y" || braille[i] == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[5], y_coords[5], z_coords[5]), tabCube, finalGeom);
        }

        if (col == 19)
        {
          for (var a = 0; a < 6; a++)
          {
            if (a == 0 || a == 2 || a == 4)
              x_coords[a] = -140;

            else if (a == 1 || a == 3 || a == 5)
              x_coords[a] = -133;
          }

          for (var b = 0; b < 6; b++)
          {
            y_coords[b] -= 21;
          }

          col = 0;
          row++;
        }

        else if (col != 19)
        {
          x_coords[0] += 15;
          x_coords[1] += 15;
          x_coords[2] += 15;
          x_coords[3] += 15;
          x_coords[4] += 15;
          x_coords[5] += 15;
        }
      }
    }
  }

  var brailleMat = new THREE.MeshPhongMaterial({color: 0x001040});
  var brailleCode = new THREE.Mesh(finalGeom, brailleMat);
  //scene.add(brailleCode);

  return brailleCode;

}

//Download as STL
function downloadBraille3D()
{
  saveSTL(lithoBraille, "Braille3D");
}

function saveSTL(geometry, name) {
  var stlString = generateSTL(geometry, name);

  var blob = new Blob([stlString], {
    type: 'text/plain'
  });

  saveAs(blob, name + '.stl'); // add the .STL extension
}

function saveAs(blob, name) {
  var downloadLink = document.createElement("a");
  downloadLink.download = name;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL !== null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(blob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}

function generateSTL(geometry, name) {
  var vertices = geometry.vertices;
  var faces = geometry.faces;
  var stl = "solid " + name + "\n";
  for (var i = 0; i < faces.length; i++) {
    stl += ("facet normal " + vertexAsString(faces[i].normal) + " \n");
    stl += ("outer loop \n");
    stl += "vertex " + vertexAsString(vertices[faces[i].a]) + " \n";
    stl += "vertex " + vertexAsString(vertices[faces[i].b]) + " \n";
    stl += "vertex " + vertexAsString(vertices[faces[i].c]) + " \n";
    stl += ("endloop \n");
    stl += ("endfacet \n");
  }
  stl += ("endsolid " + name + "\n");
  return stl;
}

function vertexAsString(vert) {
  return vert.x + " " + vert.y + " " + vert.z;
}
