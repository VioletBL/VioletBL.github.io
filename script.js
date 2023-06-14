
class Region {
  constructor(startR, startC, endR, endC) {
   this.startR = startR;
   this.startC = startC;
   this.endR = endR;
   this.endC = endC;
  }
 
 isValid(grid, row, col, color) {
 for (var r = this.startR; r<this.endR; r++) {
   for (var c = this.startC; c<this.endC; c++) {
     if (grid[r][c] != null && row != r && col != c && grid[r][c] == color) {
       return false;
     }
   }
 }
 return true;
  }
 
 isContained(row, col) {
  return (row>=this.startR && col >= this.startC && row <= this.endR && col <= this.endC);
}
 }
 

function createGrid() {
 var size = document.getElementById("size").value;
 var gridContent = createGridContent(size);
 document.getElementById("grid").innerHTML = gridContent;
 gridContent=gridContent.replaceAll("box[","box2[");
 document.getElementById("grid2").innerHTML = gridContent;
 generateBlanks(size, gridContent, document.getElementById("challenge").value);
}

function generateBlanks(size, gridContent, challenge) {
var blanks;
  if (size == 4) {
  if (challenge == 1) 
    blanks = 8;
  if (challenge == 2) 
    blanks = 10;
  if (challenge == 3)
    blanks = 12;
}
 else if (size == 6) {
  if (challenge == 1) 
    blanks = 18;
  if (challenge == 2)
    blanks = 20;
  if (challenge == 3)
    blanks = 22;
  }
  for (var i = 0; i<blanks; i++) {
    var randR = Math.floor(Math.random()*size);
    var randC = Math.floor(Math.random()*size);
    var box = document.getElementById("box["+ randR + "][" + randC + "]");
    console.log("test" + randR + randC + box);
    while (box.classList.contains("blank")) {
      randR = Math.floor(Math.random()*size);
      randC = Math.floor(Math.random()*size);
      box = document.getElementById("box["+ randR + "][" + randC + "]");
    }
    box.classList.add("blank");
  }
}

function createGridContent(size) {
  var content = "";
  var colors = addColors(size);
  for (var r = 0; r < size; r++) {
    content += ' <div class="rowSection">';
    for (var c = 0; c < size; c++) {
      var edges = '';
      var boxId = "box[" + r + "][" + c + "]";
      var colorClass = colors[r][c];
    if (size == 4) {
      if (r === 0 || r === 2)
        edges += 'topEdge ';
      if (c === 0 || c === 2)
        edges += 'leftEdge ';
      if (r === 1 || r === 3)
        edges += 'bottomEdge ';
      if (c === 1 || c === 3)
        edges += 'rightEdge ';
    }
    if (size == 6) {
      if (r === 0 || r === 2 || r === 4) 
        edges += 'topEdge ';
      if (c === 0 || c === 3)
        edges += 'leftEdge ';
      if (r === 1 || r === 3 || r === 5)
        edges += 'bottomEdge ';
      if (c === 2 || c === 5)
        edges += 'rightEdge ';
    }
      content += '<div class="box ' + edges + '" id="' + boxId + '" style= background:' + colorClass +  ';></div>';
    }
    content += ' </div>';
}
  return content;
}

function generateColors(size) {
  var available = [document.getElementById("picker-1").value, document.getElementById("picker-2").value, document.getElementById("picker-3").value, document.getElementById("picker-4").value, document.getElementById("picker-5").value, document.getElementById("picker-6").value];
  return available.slice(0, size);
}

function addColors(size) {
 console.log("colors");
  var colors = [];
  for (var x = 0; x < size; x++)
    colors[x] = [];
  var availColors = generateColors(size);
  for (var r = 0; r<size; r++) {
    for (var c = 0; c<size; c++) {
      var color = findColor(colors, r, c, availColors, size)
      if (color == 0) {
        return addColors(size);
      }
      colors[r][c] = color;
    }
  }
  return colors;
}

function findColor(grid, gridRow, gridCol, possibleColors, size) {
 console.log("find");
  var pColors = possibleColors.slice();
  var rand = Math.floor(Math.random() * pColors.length);
  var color = pColors[rand];
  var counter = 0;
  while (isRepeated(color, gridRow, gridCol, grid, size)) {
      counter++;
      if (counter > 15) {
        return 0;
      }
      console.log(counter);
      pColors.slice(rand, 1);
      rand = Math.floor(Math.random() * pColors.length);
      color = pColors[rand];
    }
  return color;
  }

  function isRepeated(color, gridRow, gridCol, grid, size) {
    var regions = [];
    if (size == 4) {
      regions = [new Region(0,0,1,1),new Region(0,2,1,3),new Region(0,2,3,1),new Region(2,2,3,3)];
    }
    else if (size == 6) {
      regions = [new Region(0,0,1,2), new Region(0,3,1,5), new Region(2,0,3,2), new Region(2,3,3,5), new Region(4,0,5,2), new Region(4,3,5,5)];
    }
    else if (size == 9) {
      regions = [new Region(0,0,2,2), new Region(0,3,2,5), new Region(0,6,2,8), new Region(3,0,5,2), new Region(3,3,5,5), new Region(3,6,5,8), new Region(6,0,8,2), new Region(6,3,8,5), new Region(6,6,8,8)];
    }
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (grid[r][c] != null && r == gridRow && c !=gridCol && color == grid[r][c]) {
          return true;
        }
        else if (gridCol == c) {
          for (var i = 0; i < size; i++) {
            if (grid[i][c] != null && gridRow != i && color == grid[i][c]) {
              return true;
            }
        }
          }
        }
      }
      for (var i = 0; i<size; i++) {
        var region = regions[i];
        console.log("region" + i);
        if (region.isContained(gridRow, gridCol)) {
          if (!region.isValid(grid, gridRow, gridCol, color))
            return true;
        }
      }
  return false;
}

