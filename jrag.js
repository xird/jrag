/**
 * Javascript Random Art Generator.
 *
 * Generates consistent randomart images on given hexadecimal input string.
 *
 * @param id String Required
 *   The hexadecimal string whose randomart representation is needed
 * @param parent_element_id String Required
 *   The DOM id of the element where the randomart canvas should be placed in
 * @param width Integer Required
 *   The pixel width for the randomart to be generated
 * @param height Integer Required
 *   The pixel height for the randomart to be generated 
 * @param scale Integer Optional Default 1
 *   Multiplier for the width and height of the randomart image
 * @param mirror_x Boolean Optional Default true
 *   Should the randomart image be mirrored on its x-axis?
 * @param mirror_y Boolean Optional Default true
 *   Should the randomart image be mirrored on its y-axis?
 *
 */
function JRAG() {
  var parent_id = params.parent_element_id;
  var width = params.width;
  var height = params.height;
  var id = params.id;
  
  if (typeof params.mirror_x != "undefined") {
    var mirror_x = params.mirror_x;
  }
  else {
    var mirror_x = true;
  }
  
  if (typeof params.mirror_y != "undefined") {
    var mirror_y = params.mirror_y;
  }
  else {
    var mirror_y = true;
  }

  if (typeof params.scale != "undefined") {
    var scale = params.scale;
  }
  else {
    var scale = 1;
  }

  var seed = parseInt(id.substring(0, 10), 16);
  function random() {
    var x = Math.sin(seed++) * 10000;
    var tmp =  x - Math.floor(x);
    return Math.floor(tmp * (15 - 0) + 0);
  }

  var parent = document.getElementById(parent_id);
  var canvas = document.createElement('canvas');
  parent.appendChild(canvas);

  canvas.width = width * scale;
  canvas.height = height * scale;
  
  var ctx = canvas.getContext('2d');

  var coord = {
    "x": Math.floor(width / 2),
    "y": Math.floor(height / 2),
    "fillstyle": "127,127,127"
  };
  ctx.fillStyle = "rgb(" + coord.fillstyle + ")";

  var iter = width * height * 6;
  for (var i = 0; i < iter; i++) {
    ctx.fillStyle = "rgb(" + coord.fillstyle + ")";
    var r = random().toString(16);    
    coord = alter(coord, r);
    ctx.fillRect(coord.x * scale, coord.y * scale, 1 * scale, 1 * scale);
  }

  if (mirror_x) {
    var input = ctx.getImageData(0,0,Math.floor(width*scale/2), height * scale);
    var output = ctx.createImageData(Math.floor(width*scale/2), height * scale);
    var w = input.width, h = input.height;
    var inputData = input.data;
    var outputData = output.data
    // Flip horizontal
    for (var y = 0; y < h; y++) {
       for (var x = 0; x < w; x++) {
         var i = (y * w + x) * 4;
         var flip = (y * w + (w - x - 1)) * 4;
         for (var c = 0; c < 4; c ++) {
            outputData[i+c] = inputData[flip+c];
         }
       }
    }
    ctx.putImageData(output, Math.floor(width * scale / 2), 0);
  }
  if (mirror_y) {
    var input = ctx.getImageData(0, 0, width * scale, Math.floor(height*scale/2));
    var output = ctx.createImageData(width * scale, Math.floor(height*scale/2));
    var w = input.width, h = input.height;
    var inputData = input.data;
    var outputData = output.data

    // Flip vertical
    for (var y = 0; y < h; y++) {
       for (var x = 0; x < w; x++) {
         var i    = (y * w + x) * 4;
         var flip = (((h - 1) * w) - (y * w) + x) * 4;
         for (var c = 0; c < 4; c ++) {
            outputData[i+c] = inputData[flip+c];
         }
       }
    }
    ctx.putImageData(output, 0, Math.floor(height * scale / 2));    
  }

  /**
   * Changes the coordinates or the colour based on the input and the internal
   * state of the function.
   */
  function alter(coord, action) {
    if (typeof alter.counter == 'undefined' ) {
      alter.counter = 1;
    }
    else {
      alter.counter++;
    }
    if (alter.counter % 17 == 0) {
      var c = coord.fillstyle.split(",");
      var r = parseInt(c[0]);
      var g = parseInt(c[1]);
      var b = parseInt(c[2]);
      var s = 128;
      switch(action){
        case "0":
          r = r + s;
          break;
        case "1":
          r = r - s;
          break;
        case "2":
          g = g + s;
          break;
        case "3":
          g = g - s;
          break;
        case "4":
          b = b + s;
          break;
        case "5":
          b = b - s;
          break;
        case "6":
          r = r + s;
          g = g - s;
          break;
        case "7":
          r = r - s;
          g = g + s;
          break;
        case "8":
          g = g + s;
          b = b - s;
          break;
        case "9":
          g = g - s;
          b = b + s;
          break;
        case "a":
          r = r + s;
          b = b - s;
          break;
        case "b":
          r = r - s;
          b = b + s;
          break;
        case "c":
        case "d":
          r = r + s;
          g = b + s;
          g = b + s;
          break;
        case "e":
        case "f":
          r = r - s;
          g = b - s;
          g = b - s;
          break;
      }
    
      if (r < 0) {r = 0;}
      if (g < 0) {g = 0;}
      if (b < 0) {b = 0;}
      if (r > 255) {r = 255;}
      if (g > 255) {g = 255;}
      if (b > 255) {b = 255;}
      coord.fillstyle = [r, g, b].join(",");
    }
    else {
      var s = 1;
      var x = coord.x;
      var y = coord.y;
      switch(action) {
        case "0":
        case "1":
          x=x+s;
          break;
        case "2":
        case "3":
          x=x-s;
          break;
        case "4":
        case "5":
          y=y+s;
          break;
        case "6":
        case "7":
          y=y-s;
          break;
        case "8":
        case "9":
          x=x+s;
          y=y+s;
          break;
        case "a":
        case "b":
          x=x-s;
          y=y-s;
          break;
        case "c":
        case "d":
          x=x+s;
          y=y-s;
          break;
        case "e":
        case "f":
          x=x-s;
          y=y+s;
          break;
      }
    
      if (x < 0) {x = width + x;}
      else if (x > width) {x = x - width;}
      if (y < 0) {y = height + y;}
      else if (y > height) {y = y - height;}
    
      coord.x = x;
      coord.y = y;
    }
    return coord;  
  }
}