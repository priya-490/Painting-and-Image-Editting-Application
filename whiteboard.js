const canvas = document.querySelector("canvas");
let prevMouseX, prevMouseY, snapshot;
const ctx = canvas.getContext("2d");
const toolBtns = document.querySelectorAll(".tool");
const sizeSlider = document.querySelector("#size-slider");
const fillColor = document.querySelector("#fill-color");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
clearCanvas= document.querySelector(".clear-canvas");

saveImg=document.querySelector(".save-img");

let isDrawing = false;
let brushwidth = 5;
selectedColor= "#000"; 
let selectedTool = "brush"; // Default selected tool is brush
const setCanvasBackground=()=>{
  //settign whole canvas background to white so the downloaded image background will be white 
  ctx.fillStyle="#fff";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=selectedColor;// settign fillstyle back to the selectedcolr,it will be the brush colour 
}
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  //fillRect for filled rectangle and strokeRect for unfilled rectangle
  if (!fillColor.checked) {
    ctx.strokeRect(
      prevMouseX, // x-coordinate of the top-left corner
      prevMouseY, // y-coordinate of the top-left corner
      e.offsetX - prevMouseX, // width of the rectangle
      e.offsetY - prevMouseY // height of the rectangle
    );
  } else {
    ctx.fillRect(
      prevMouseX, // x-coordinate of the top-left corner
      prevMouseY, // y-coordinate of the top-left corner
      e.offsetX - prevMouseX, // width of the rectangle
      e.offsetY - prevMouseY // height of the rectangle
    );
  }
};

const drawCircle = (e) => {
  // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.beginPath(); // Begin a new path
  // Calculate the radius dynamically based on the distance between initial and current mouse positions
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Draw the arc
  // ctx.stroke(); // Stroke the arc to create the circle
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  ctx.closePath(); //closing path of  a triangle so that the third line draws automatically
  fillColor.checked ? ctx.fill() : ctx.stroke();
  // ctx.stroke();
};
const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer

  ctx.stroke();
};
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.lineWidth = brushwidth;
  ctx.strokeStyle=selectedColor;
  ctx.fillStyle=selectedColor;
  ctx.beginPath();
  //getImageData() method returns an Image Data object that copies the pixel data
  //copying canvas data and passing as snapshot value..this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;

  //putImagedata() method puts the image back onto the canvas

  brushwidth = sizeSlider.value;

  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool==="eraser") {
    //for erser , it will gie white color
    ctx.strokeStyle =selectedTool==="eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
// sizeSlider.addEventListener("change", () => (brushwidth = sizeSlider.value)); //passing slider value as brush size
colorBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        console.log(btn);
        document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedTool = btn.id;
    selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change" ,()=>{
  //passing picked color value from color picker to last color btn background

  colorPicker.parentElement.style.background=colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",()=>{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  setCanvasBackground();
})
saveImg.addEventListener("click",()=>{
  const link = document.createElement("a");//anchor tag
  // link.download= `${Data.now()}.jpg` ;
  link.download = `${Date.now()}.jpg`;
 //passing current data as link download value
  link.href=canvas.toDataURL();//passing canvas data as link href value
  link.click();//clicking link to download image
});
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
