const html = document.documentElement;
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const Width = 1440
const Height = 1440
const margin = 20
const grid = 14
const line_w1 = 5
const line_w2 = 6
const grid_w = (Width-2*margin) / grid


function draw_background(){
	ctx.lineWidth = line_w1;
	ctx.beginPath();
	ctx.moveTo(margin,margin);
	ctx.lineTo(margin,Height-margin);
	ctx.lineTo(Width-margin,Height-margin);
	ctx.lineTo(Width-margin,margin);
	ctx.lineTo(margin,margin);
	ctx.lineCap = 'round';
	ctx.stroke();
	for (let i = 1; i <grid; i++){
		ctx.moveTo(i*grid_w+margin,margin);
		ctx.lineTo(i*grid_w+margin,Height-margin);
		ctx.moveTo(margin, i*grid_w+margin);
		ctx.lineTo(Height-margin,i*grid_w+margin);

	}
	ctx.stroke();
}


function play_gomoku(){
    draw_background();
}

function game(){
	canvas.width=Width;
	canvas.height=Height + 20;

	play_gomoku();
}

window.onload = game;