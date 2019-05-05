function initPage() { // called on page load
    // find heading in document and change the displayed text
    var headingText=document.getElementById('pageheading');
    headingText.innerHTML="2D to 3D Lithophane Generator™";
}

function onImageClicked(event) {
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
 var height_data = new Uint8Array(numb_pixels); // an array to hold the result data
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

function setLevels(heightData, width, height) {
 // TODO - create 3D data from height data
 var lithoFace = new THREE.ParametricGeometry( getPoint, width, height );
 var lithoMaterial = new THREE.MeshPhongMaterial( { color: 0x3030C0 });
 var lithoMesh = new THREE.Mesh (lithoFace ,lithoMaterial);
 lithoMesh.position.set( -200, 250, -300 );
 lithoMesh.rotation.z += 180 * Math.PI / 180;
 lithoMesh.rotation.y += 180 * Math.PI / 180;
 lithoMesh.receiveShadow = true;
 scene.add( lithoMesh );
 
 var geometry = new THREE.PlaneGeometry( width+200, height+200 );
 var material = new THREE.MeshPhongMaterial( {color: 0xffffff } );
 var plane = new THREE.Mesh( geometry, material );
 plane.position.set( 0, -100, -500 );
 plane.receiveShadow = true;
 scene.add( plane );
 
 function getPoint(u, v, target)
 {
    // use the height data collected from the image
    // to return a height, for the 3D model, for each pixel
    var x=width*u;
    var y=height*v;
    var z=heightData[width*y+x];
 
    target.set(x, y, z);
    //return new THREE.Vector3 (x,y,heightData[width*y+x]);
 }

 animate();
}

function vertexAsString(vert){
   return vert.x+" "+vert.y+" "+vert.z;
}

function generateSTL(geometry,name) {
   var vertices = geometry.vertices;
   var faces = geometry.faces;
   var stl = "solid "+name+"\n";
   for(var i = 0; i<faces.length; i++){
      stl += ("facet normal "+vertexAsString( faces[i].normal )+" \n");
      stl += ("outer loop \n");
       stl += "vertex "+vertexAsString( vertices[ faces[i].a ])+" \n";
       stl += "vertex "+vertexAsString( vertices[ faces[i].b ])+" \n";
       stl += "vertex "+vertexAsString( vertices[ faces[i].c ])+" \n";
       stl += ("endloop \n");
       stl += ("endfacet \n");
   }
   stl += ("endsolid "+name+"\n");
   return stl;
}

function saveSTL( geometry, name ){
 var stlString = generateSTL( geometry,name );

 var blob = new Blob([stlString], {type: 'text/plain'});

 saveAs(blob, name + '.stl'); // add the .STL extension
}

function saveAs(blob,name) {
 var downloadLink = document.createElement("a");
 downloadLink.download = name;
 downloadLink.innerHTML = "Download File";
 if (window.webkitURL !== null) {
 // Chrome allows the link to be clicked
 // without actually adding it to the DOM.
   downloadLink.href = window.webkitURL.createObjectURL(blob);
 }
 else {
 // Firefox requires the link to be added to the DOM
 // before it can be clicked.
   downloadLink.href = window.URL.createObjectURL(blob);
   downloadLink.onclick = destroyClickedElement;
   downloadLink.style.display = "none";
   document.body.appendChild(downloadLink);
 }
 downloadLink.click();
}
