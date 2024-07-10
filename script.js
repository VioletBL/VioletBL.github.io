let selectedColor = null;
let generatedSolution = null;

class Region {
  constructor(startR, startC, endR, endC) {
    this.startR = startR;
    this.startC = startC;
    this.endR = endR;
    this.endC = endC;
  }

  isValid(grid, row, col, color) {
    for (var r = this.startR; r < this.endR; r++) {
      for (var c = this.startC; c < this.endC; c++) {
        if (grid[r][c] === color) {
          return false;
        }
      }
    }
    return true;
  }

  isContained(row, col) {
    return (row >= this.startR && col >= this.startC && row < this.endR && col < this.endC);
  }
}

function createGrid() {
  var size = parseInt(document.getElementById("size").value);
  var challenge = parseInt(document.getElementById("challenge").value);
  var gridsContainer = document.getElementById("grids-container");
  gridsContainer.innerHTML = "";

  var topGridContainer = document.createElement("div");
  topGridContainer.classList.add("grid-container");

  var grid = generateValidGrid(size);
  generatedSolution = JSON.parse(JSON.stringify(grid)); 

  var topGridContent = createGridContent(size, grid);
  topGridContainer.innerHTML = topGridContent;

  gridsContainer.appendChild(topGridContainer);
  generateColorPalette(size);
  generateBlanksAndEvents(size, topGridContainer, challenge);
}

function generateBlanksAndEvents(size, gridContainer, challenge) {
  generateBlanks(size, gridContainer, challenge);
  addBoxClickEvents();
}

function generateBlanks(size, gridContainer, challenge) {
  var blanks;
  if (size === 4) {
    if (challenge === 1) blanks = 8;
    if (challenge === 2) blanks = 10;
    if (challenge === 3) blanks = 12;
  } else if (size === 6) {
    if (challenge === 1) blanks = 18;
    if (challenge === 2) blanks = 20;
    if (challenge === 3) blanks = 22;
  } else if (size === 9) {
    if (challenge === 1) blanks = 28;
    if (challenge === 2) blanks = 30;
    if (challenge === 3) blanks = 32;
  }

  var cells = gridContainer.querySelectorAll(".box");
  var blankIndices = [];

  while (blankIndices.length < blanks) {
    var index = Math.floor(Math.random() * size * size);
    if (!blankIndices.includes(index)) {
      cells[index].style.backgroundColor = "";
      cells[index].classList.add("blank"); 
      blankIndices.push(index);
    }
  }
}

function addBoxClickEvents() {
  var cells = document.querySelectorAll(".box");
  cells.forEach(cell => {
    cell.addEventListener("click", function() {
      if (selectedColor && cell.classList.contains("blank")) { 
        const color = selectedColor.style.backgroundColor;
        cell.style.backgroundColor = color;
      }
    });
  });
}


function createGridContent(size, grid) {
  var content = "";
  for (var r = 0; r < size; r++) {
    content += '<div class="rowSection">';
    for (var c = 0; c < size; c++) {
      var edges = '';
      var boxId = "box[" + r + "][" + c + "]";
      var colorClass = grid[r][c];
      if (size === 4) {
        if (r === 0 || r === 2) edges += 'topEdge ';
        if (c === 0 || c === 2) edges += 'leftEdge ';
        if (r === 1 || r === 3) edges += 'bottomEdge ';
        if (c === 1 || c === 3) edges += 'rightEdge ';
      }
      if (size === 6) {
        if (r === 0 || r === 2 || r === 4) edges += 'topEdge ';
        if (c === 0 || c === 3) edges += 'leftEdge ';
        if (r === 1 || r === 3 || r === 5) edges += 'bottomEdge ';
        if (c === 2 || c === 5) edges += 'rightEdge ';
      }
      if (size === 9) {
        if (r % 3 === 0) edges += 'topEdge ';
        if (c % 3 === 0) edges += 'leftEdge ';
        if ((r + 1) % 3 === 0) edges += 'bottomEdge ';
        if ((c + 1) % 3 === 0) edges += 'rightEdge ';
      }
      content += '<div class="box ' + edges + '" id="' + boxId + '" style="background-color:' + colorClass + ';"></div>';
    }
    content += '</div>';
  }
  return content;
}

function generateValidGrid(size) {
  var grid = Array.from(Array(size), () => Array(size).fill(null));
  var availableColors = getAvailableColors(size);
  var regions = generateRegions(size);

  function isValidPlacement(row, col, color) {
    for (var i = 0; i < size; i++) {
      if (grid[row][i] === color || grid[i][col] === color) {
        return false;
      }
    }

    for (var region of regions) {
      if (region.isContained(row, col) && !region.isValid(grid, row, col, color)) {
        return false;
      }
    }

    return true;
  }

  function fillGrid(row, col) {
    if (row === size) return true;
    if (col === size) return fillGrid(row + 1, 0);

    var shuffledColors = availableColors.sort(() => Math.random() - 0.5);

    for (var color of shuffledColors) {
      if (isValidPlacement(row, col, color)) {
        grid[row][col] = color;
        if (fillGrid(row, col + 1)) {
          return true;
        }
        grid[row][col] = null;
      }
    }

    return false;
  }

  fillGrid(0, 0);
  return grid;
}

function getAvailableColors(size) {
  var colors = [
    document.getElementById("picker-1").value,
    document.getElementById("picker-2").value,
    document.getElementById("picker-3").value,
    document.getElementById("picker-4").value,
    document.getElementById("picker-5").value,
    document.getElementById("picker-6").value,
    document.getElementById("picker-7").value,
    document.getElementById("picker-8").value,
    document.getElementById("picker-9").value
  ];
  return colors.slice(0, size);
}

function generateRegions(size) {
  const regions = [];
  if (size === 4) {
    regions.push(new Region(0, 0, 2, 2), new Region(0, 2, 2, 4), new Region(2, 0, 4, 2), new Region(2, 2, 4, 4));
  } else if (size === 6) {
    regions.push(new Region(0, 0, 2, 3), new Region(0, 3, 2, 6), new Region(2, 0, 4, 3), new Region(2, 3, 4, 6), new Region(4, 0, 6, 3), new Region(4, 3, 6, 6));
  } else if (size === 9) {
    regions.push(
      new Region(0, 0, 3, 3), new Region(0, 3, 3, 6), new Region(0, 6, 3, 9),
      new Region(3, 0, 6, 3), new Region(3, 3, 6, 6), new Region(3, 6, 6, 9),
      new Region(6, 0, 9, 3), new Region(6, 3, 9, 6), new Region(6, 6, 9, 9)
    );
  }
  return regions;
}

function generateColorPalette(size) {
  const colors = ['#FF0000', '#0000FF', '#339933', '#FFFF00', '#A020F0', '#FFA500', '#00FFFF', '#FF00FF', '#A52A2A'];
  const paletteContainer = document.getElementById('colorPaletteContainer');
  paletteContainer.innerHTML = '';

  let rows, cols;
  if (size <= 4) {
    rows = 2;
    cols = 2;
  } else if (size <= 6) {
    rows = 2;
    cols = 3;
  } else {
    rows = 3;
    cols = 3;
  }

  for (let i = 0; i < size; i++) {
    const colorButton = document.createElement('button');
    colorButton.classList.add('color-button', 'btn', 'btn-primary');
    colorButton.style.backgroundColor = colors[i];
    colorButton.addEventListener('click', function() {
      selectedColor = colorButton;
    });
    paletteContainer.appendChild(colorButton);
  }

  paletteContainer.style.display = 'grid';
  paletteContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
  paletteContainer.style.gridTemplateRows = `repeat(${rows}, 50px)`;
  paletteContainer.style.gap = '10px';
}


function showColorPickers() {
  var modal = document.getElementById("customizeModal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("customizeModal");
  modal.style.display = "none";
}

function showSolution() {
  if (!generatedSolution) {
    alert("No solution available. Please generate a grid first.");
    return;
  }

  var solutionGrid = document.getElementById("solutionGrid");
  if (!solutionGrid) {
    console.error("solutionGrid element not found.");
    return;
  }

  solutionGrid.innerHTML = createGridContent(generatedSolution.length, generatedSolution);
  var modal = document.getElementById("solutionModal");
  modal.style.display = "block";
}

function closeSolutionModal() {
  var modal = document.getElementById("solutionModal");
  modal.style.display = "none";
}

function resetGrid() {
  var cells = document.querySelectorAll(".box.blank"); 
  cells.forEach(cell => {
    cell.style.backgroundColor = ''; 
  });
}

function checkSolution() {
  if (!generatedSolution) {
    alert("No solution available. Please generate a grid first.");
    return;
  }

  var cells = document.querySelectorAll(".box");
  var size = Math.sqrt(cells.length);
  var userGrid = [];

  if (cells.length !== size * size) {
    console.error("Mismatch in grid size and cells length:", size, cells.length);
    return;
  }

  function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return (
      "#" +
      rgbValues
        .map((value) => {
          const hex = value.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    ).toUpperCase();
  }

  for (var r = 0; r < size; r++) {
    var row = [];
    for (var c = 0; c < size; c++) {
      var index = r * size + c;
      var cellColor = cells[index].style.backgroundColor || "";
      if (cellColor.startsWith("rgb")) {
        cellColor = rgbToHex(cellColor);
      }
      row.push(cellColor.toUpperCase());
    }
    userGrid.push(row);
  }

  console.log("User Grid:", userGrid);
  console.log("Generated Solution:", generatedSolution);

  var isCorrect = true;
  for (var r = 0; r < size; r++) {
    for (var c = 0; c < size; c++) {
      if (userGrid[r][c] !== generatedSolution[r][c]) {
        isCorrect = false;
        break;
      }
    }
    if (!isCorrect) {
      break;
    }
  }

  if (isCorrect) {
    alert("Congratulations! You solved the Sudoku puzzle correctly!");
  } else {
    alert("Oops! Some cells are incorrect. Please review your solution.");
  }
}



function resetColors() {
  var defaultColors = ['#FF0000', '#0000FF', '#339933', '#FFFF00', '#A020F0', '#FFA500', '#00FFFF', '#FF00FF', '#A52A2A'];
  var colorPickers = document.querySelectorAll(".color-picker input");

  for (var i = 0; i < colorPickers.length; i++) {
    colorPickers[i].value = defaultColors[i] || "";
  }
}

