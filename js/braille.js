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

params = getParams();
braille = unescape(params["plain_text"]);
var braille_array = [];
var braille_dot = [];
var i;
var x_coords = [-10, 10, -10, 10, -10, 10];
var y_coords = [0, 0, 0, 0, 0, 0];
var z_coords = [0, 0, 15, 15, 30, 30];

var geometry = new THREE.CylinderGeometry( 5, 5, 10, 32 );
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
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[0], y_coords[0], z_coords[0]);
      scene.add( braille_dot[i] );
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
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[1], y_coords[1], z_coords[1]);
      scene.add( braille_dot[i] );
    }

    if (braille.toLowerCase().charAt(i) == "b" || braille.toLowerCase().charAt(i) == "f" ||
    braille.toLowerCase().charAt(i) == "g" || braille.toLowerCase().charAt(i) == "h" ||
    braille.toLowerCase().charAt(i) == "i" || braille.toLowerCase().charAt(i) == "j" ||
    braille.toLowerCase().charAt(i) == "l" || braille.toLowerCase().charAt(i) == "p" ||
    braille.toLowerCase().charAt(i) == "q" || braille.toLowerCase().charAt(i) == "r" ||
    braille.toLowerCase().charAt(i) == "s" || braille.toLowerCase().charAt(i) == "t" ||
    braille.toLowerCase().charAt(i) == "v" || braille.toLowerCase().charAt(i) == "w")
    {
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[2], y_coords[2], z_coords[2]);
      scene.add( braille_dot[i] );
    }

    if (braille.toLowerCase().charAt(i) == "d" || braille.toLowerCase().charAt(i) == "e" ||
    braille.toLowerCase().charAt(i) == "g" || braille.toLowerCase().charAt(i) == "h" ||
    braille.toLowerCase().charAt(i) == "j" || braille.toLowerCase().charAt(i) == "n" ||
    braille.toLowerCase().charAt(i) == "o" || braille.toLowerCase().charAt(i) == "q" ||
    braille.toLowerCase().charAt(i) == "r" || braille.toLowerCase().charAt(i) == "t" ||
    braille.toLowerCase().charAt(i) == "w" || braille.toLowerCase().charAt(i) == "y" ||
    braille.toLowerCase().charAt(i) == "z")
    {
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[3], y_coords[3], z_coords[3]);
      scene.add( braille_dot[i] );
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
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[4], y_coords[4], z_coords[4]);
      scene.add( braille_dot[i] );
    }

    if (braille.toLowerCase().charAt(i) == "u" || braille.toLowerCase().charAt(i) == "v" ||
    braille.toLowerCase().charAt(i) == "w" || braille.toLowerCase().charAt(i) == "x" ||
    braille.toLowerCase().charAt(i) == "y" || braille.toLowerCase().charAt(i) == "z")
    {
      braille_dot[i] = new THREE.Mesh( geometry, material );
      braille_dot[i].position.set(x_coords[5], y_coords[5], z_coords[5]);
      scene.add( braille_dot[i] );
    }

    x_coords[0] += 40;
    x_coords[1] += 40;
    x_coords[2] += 40;
    x_coords[3] += 40;
    x_coords[4] += 40;
    x_coords[5] += 40;

  }
}

braille2 = braille_array.join("");

document.getElementById("braille_code").innerText = braille2;
//document.write("Braille = " + braille + "<br>");
