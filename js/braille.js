function getParams()
{
  var idx = document.URL.indexOf('?');
  var params = new Array();
  if (idx != -1)
  {
    var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
    for (var i=0; i<pairs.length; i++)
    {
      nameVal = pairs[i].split('=');
      params[nameVal[0]] = nameVal[1];
    }
  }
  return params;
}

function mergeGeoms(braille_dot, tablet, mergedGeom)
{
  braille_dot.updateMatrix(); // as needed
  mergedGeom.merge(braille_dot.geometry, braille_dot.matrix);

  tablet.updateMatrix(); // as needed
  mergedGeom.merge(tablet.geometry, tablet.matrix);
}

function processBrailleDot(x, y, z)
{
  brailleDot = new THREE.Mesh( geometry, material );
  brailleDot.position.set(x, y, z);
  brailleDot.rotation.x += 90 * Math.PI / 180;
  return brailleDot;
}

// function processBraille()
// {
  //params = getParams();
  //braille = unescape(params["plain_text"]);
  braille = plain_text.split('');
  var braille_array = [];
  var braille_dot = [];
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
  //scene.add( tabCube );

  var geometry = new THREE.CylinderGeometry( 2, 2, 5, 32 );
  var material = new THREE.MeshPhongMaterial( {color: 0xffff00} );

  for (i=0; i < braille.length; i++)
  {
    braille_array[i] = braille.charAt(i);
    if (braille.charAt(i) == "+")
    {
      braille_array[i] = " ";
    }

    else
    {
      col++;
      if (row <= 1)
      {
        if (braille.toLowerCase().charAt(i) == "a" || braille.toLowerCase().charAt(i) == "b" ||
        braille.toLowerCase().charAt(i) == "c" || braille.toLowerCase().charAt(i) == "d" ||
        braille.toLowerCase().charAt(i) == "e" || braille.toLowerCase().charAt(i) == "f" ||
        braille.toLowerCase().charAt(i) == "g" || braille.toLowerCase().charAt(i) == "h" ||
        braille.toLowerCase().charAt(i) == "k" || braille.toLowerCase().charAt(i) == "l" ||
        braille.toLowerCase().charAt(i) == "m" || braille.toLowerCase().charAt(i) == "n" ||
        braille.toLowerCase().charAt(i) == "o" || braille.toLowerCase().charAt(i) == "p" ||
        braille.toLowerCase().charAt(i) == "q" || braille.toLowerCase().charAt(i) == "r" ||
        braille.toLowerCase().charAt(i) == "u" || braille.toLowerCase().charAt(i) == "v" ||
        braille.toLowerCase().charAt(i) == "x" || braille.toLowerCase().charAt(i) == "y" ||
        braille.toLowerCase().charAt(i) == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[0], y_coords[0], z_coords[0]), tabCube, finalGeom);
        }

        if (braille.toLowerCase().charAt(i) == "c" || braille.toLowerCase().charAt(i) == "d" ||
        braille.toLowerCase().charAt(i) == "f" || braille.toLowerCase().charAt(i) == "g" ||
        braille.toLowerCase().charAt(i) == "i" || braille.toLowerCase().charAt(i) == "j" ||
        braille.toLowerCase().charAt(i) == "m" || braille.toLowerCase().charAt(i) == "n" ||
        braille.toLowerCase().charAt(i) == "p" || braille.toLowerCase().charAt(i) == "q" ||
        braille.toLowerCase().charAt(i) == "s" || braille.toLowerCase().charAt(i) == "t" ||
        braille.toLowerCase().charAt(i) == "w" || braille.toLowerCase().charAt(i) == "x" ||
        braille.toLowerCase().charAt(i) == "y")
        {
          mergeGeoms(processBrailleDot(x_coords[1], y_coords[1], z_coords[1]), tabCube, finalGeom);
        }

        if (braille.toLowerCase().charAt(i) == "b" || braille.toLowerCase().charAt(i) == "f" ||
        braille.toLowerCase().charAt(i) == "g" || braille.toLowerCase().charAt(i) == "h" ||
        braille.toLowerCase().charAt(i) == "i" || braille.toLowerCase().charAt(i) == "j" ||
        braille.toLowerCase().charAt(i) == "l" || braille.toLowerCase().charAt(i) == "p" ||
        braille.toLowerCase().charAt(i) == "q" || braille.toLowerCase().charAt(i) == "r" ||
        braille.toLowerCase().charAt(i) == "s" || braille.toLowerCase().charAt(i) == "t" ||
        braille.toLowerCase().charAt(i) == "v" || braille.toLowerCase().charAt(i) == "w")
        {
          mergeGeoms(processBrailleDot(x_coords[2], y_coords[2], z_coords[2]), tabCube, finalGeom);
        }

        if (braille.toLowerCase().charAt(i) == "d" || braille.toLowerCase().charAt(i) == "e" ||
        braille.toLowerCase().charAt(i) == "g" || braille.toLowerCase().charAt(i) == "h" ||
        braille.toLowerCase().charAt(i) == "j" || braille.toLowerCase().charAt(i) == "n" ||
        braille.toLowerCase().charAt(i) == "o" || braille.toLowerCase().charAt(i) == "q" ||
        braille.toLowerCase().charAt(i) == "r" || braille.toLowerCase().charAt(i) == "t" ||
        braille.toLowerCase().charAt(i) == "w" || braille.toLowerCase().charAt(i) == "y" ||
        braille.toLowerCase().charAt(i) == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[3], y_coords[3], z_coords[3]), tabCube, finalGeom);
        }

        if (braille.toLowerCase().charAt(i) == "k" || braille.toLowerCase().charAt(i) == "l" ||
        braille.toLowerCase().charAt(i) == "m" || braille.toLowerCase().charAt(i) == "n" ||
        braille.toLowerCase().charAt(i) == "o" || braille.toLowerCase().charAt(i) == "p" ||
        braille.toLowerCase().charAt(i) == "q" || braille.toLowerCase().charAt(i) == "r" ||
        braille.toLowerCase().charAt(i) == "s" || braille.toLowerCase().charAt(i) == "t" ||
        braille.toLowerCase().charAt(i) == "u" || braille.toLowerCase().charAt(i) == "v" ||
        braille.toLowerCase().charAt(i) == "x" || braille.toLowerCase().charAt(i) == "y" ||
        braille.toLowerCase().charAt(i) == "z")
        {
          mergeGeoms(processBrailleDot(x_coords[4], y_coords[4], z_coords[4]), tabCube, finalGeom);
        }

        if (braille.toLowerCase().charAt(i) == "u" || braille.toLowerCase().charAt(i) == "v" ||
        braille.toLowerCase().charAt(i) == "w" || braille.toLowerCase().charAt(i) == "x" ||
        braille.toLowerCase().charAt(i) == "y" || braille.toLowerCase().charAt(i) == "z")
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
          console.log(col);
        }
      }
    }
  }

  braille2 = braille_array.join("");
  document.getElementById("braille_code").innerText = braille2;
  //document.write("Braille = " + braille + "<br>");

  var brailleMat = new THREE.MeshPhongMaterial({color: 0x001040});
  var brailleCode = new THREE.Mesh(finalGeom, brailleMat);
  scene.add(brailleCode);

//}
