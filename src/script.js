import { getStorageData } from './utils/storage.js';
import { generatePixleBoard, paintPixelBoard } from './utils/pixelBoard.js';
import { placeCollorOnElements } from './utils/collorPalette.js';

const { boardSize, colorPalette, pixelBoard } = getStorageData();

function initializeApplication() {
  generatePixleBoard(boardSize || 5);
  placeCollorOnElements(colorPalette);
  paintPixelBoard(pixelBoard);
}

initializeApplication();

if (localStorage.getItem('pixelBoard') !== null) {
  recoverPixelBoard();
} else {
  localStorage.getItem('colorPalette', '{}');
}

function generateBoardInput() {
  if (document.getElementById('board-size').value == '') {
    alert('Board inválido!');
    return 1;
  }

  let input = parseInt(document.getElementById('board-size').value);

  if (input < 5) {
    input = 5;
  }

  if (input > 50) {
    input = 50;
  }

  // Apaga os elementos existentes
  let pixels = document.getElementsByClassName('pixel');
  for (let index = pixels.length - 1; index >= 0; index -= 1) {
    pixels[index].remove();
  }
  clearBoard();
  generatePixles(input);
  saveBoardSize(input);
}

// Gera quadro de pixels de acordo com input da função

// -------- Recuperações de dados ----------
// Recuperação da paleta após loading da página

function recoverPixelBoard() {
  if (localStorage.getItem('pixelBoard') === null) {
    localStorage.setItem('pixelBoard', JSON.stringify(pixelBoard));
  } else {
    if (localStorage.getItem('pixelBoard') == '') {
      return 1;
    }

    let pixels = document.getElementsByClassName('pixel');
    pixelBoard = JSON.parse(localStorage.getItem('pixelBoard'));

    for (let index = 0; index < pixels.length; index += 1) {
      let pixel = pixels[index];
      if (pixelBoard[`${index}`] == null) {
        pixel.style.background = 'white';
      } else {
        pixel.style.background = pixelBoard[`${index}`];
      }
    }
    return 1;
  }
}

// -------- Eventos ------------
// Atribui as cores o eventListener Click para definir a color com a class Selected
let palette = document.getElementById('color-palette');
palette.addEventListener('click', function (event) {
  let selectedColor = document.querySelector('.selected');
  selectedColor.classList.remove('selected');
  event.target.classList.add('selected');
});

// Atribui aos Pixels o eventListener Click para pintar da cor selecionada
let pixels = document.getElementsByClassName('pixel');
for (let index = 0; index < pixels.length; index += 1) {
  let pixel = pixels[index];
  pixel.addEventListener('click', function (event) {
    let currentColor =
      document.querySelector('.selected').style.backgroundColor;
    event.target.style.backgroundColor = currentColor;
    updatePixelBoardObject(event.target);
  });
}

// Alterna a classe selected do antigo para o novo selecionado
function selectColor(event) {
  const selectedColor = document.querySelector('.selected');
  selectColor.classList.remove('selected');
  event.target.classList.add('selected');
}

// Deve atualizar o objeto JS pixelBoard em todos os momentos em que houver uma atualização do usuário (terá de ser chamada)
function updatePixelBoardObject(element) {
  let pixelNum = element.id;
  let newColor = element.style.backgroundColor;
  pixelBoard[pixelNum] = newColor;
  localStorage.setItem('pixelBoard', JSON.stringify(pixelBoard));
}

function clearBoard() {
  let pixels = document.getElementsByClassName('pixel');
  for (let index = 0; index < pixels.length; index += 1) {
    let pixel = pixels[index];
    pixel.style.background = 'white';
  }

  pixelBoard = {};
  localStorage.setItem('pixelBoard', '');
}

// ------------- Funções para a Geração de cores --------
// Verifica cores brancas

function checkWhite(r, g, b) {
  if (r == 0 && g == 0 && b == 0) {
    return true;
  }
  return false;
}
// Função que gera 3 valores entre 0 e 250 e retorna no formato de texto RGB para CSS
function colorGenerator() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  if (checkWhite(r, g, b)) {
    colorGenerator();
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function checkRepeat(array) {
  let color1 = array[1].style.backgroundColor;
  let color2 = array[2].style.backgroundColor;
  let color3 = array[3].style.backgroundColor;

  if (color1 == color2 && color1 == color3 && color2 == color3) {
    return true;
  }
  return false;
}

// Itera sobre os elementos a serem coloridos e atribui as novas cores randomicas
function generateRandomColors() {
  const colorElements = document.getElementsByClassName('color');

  for (let index = 1; index < colorElements.length; index += 1) {
    const elementSelected = colorElements[index];
    const newCollor = colorGenerator();
    elementSelected.style.backgroundColor = newCollor;
  }
  // Chama a função que verifica repetição e caso haja chama recursivamente a função atual
  if (checkRepeat(colorElements)) {
    generateRandomColors();
  }
  saveColorLC();
}

// ------------ Saves -----------

// Salva paleta de cores aleatorias no local storage
function saveColorLC() {
  const colorElements = document.getElementsByClassName('color');
  const colors = {};
  for (let index = 1; index < colorElements.length; index += 1) {
    colors[`${index}`] = colorElements[index].style.backgroundColor;
  }
  localStorage.setItem('colorPalette', JSON.stringify(colors));
}

function saveBoardSize(size) {
  if (localStorage.getItem('boardSize') === null) {
    localStorage.setItem('boardSize', JSON.parse(size));
    return 1;
  }
  localStorage.setItem('boardSize', JSON.parse(size));
}