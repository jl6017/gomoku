const html = document.documentElement;
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const Width = 1000;
const Height = 1000;
const margin = 150;
const grid = 14;
const line_w1 = 4;
const grid_w = (Width-2*margin) / grid;
const radius = 20;
let black_or_white = 0;
let black_list = [];
let white_list = [];
let win = 0;

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

function draw_circle(x_id, y_id){
    ctx.beginPath();
    ctx.arc(x_id * grid_w + margin, y_id * grid_w + margin, radius, 0, 2 * Math.PI, false);
    if (black_or_white==0){
        ctx.fillStyle = 'black';
        black_list.push([x_id, y_id]);
        if (check_win() == 1){
            document.getElementById("p1").innerHTML = "Black win!";
            win = 1;
        }
        else {
            document.getElementById("p1").innerHTML = "White turn";
        }
        black_or_white = 1;
    }
    else{
        ctx.fillStyle = 'white';
        white_list.push([x_id, y_id]);
        if (check_win() == 1){
            document.getElementById("p1").innerHTML = "White win!";
            win = 1;
        }
        else{
            document.getElementById("p1").innerHTML = "Black turn";
        }
        black_or_white = 0;
    }
    
    ctx.fill();
}

function in_list(x_n, y_n, list_n){
    let inlist = 0
    for (let i = 0; i<list_n.length; i++){
        if (list_n[i][0] == x_n && list_n[i][1] == y_n){
            inlist = 1
            return inlist
        }
    }
    return inlist
}

function check_win(){
    let count = 0
    let x_0 = 0
    let y_0 = 0
    let direction = []
    if (black_or_white==0){
        // black
        for (let i = 0; i<black_list.length; i++){
            x_0 = black_list[i][0]
            y_0 = black_list[i][1]
            // direction 1
            direction = [[x_0 + 1, y_0], [x_0 + 2, y_0], [x_0 + 3, y_0], [x_0 + 4, y_0]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], black_list)
            }
            if (count == 5) {return 1}

            // direction 2
            direction = [[x_0 + 1, y_0 + 1], [x_0 + 2, y_0 + 2], [x_0 + 3, y_0 + 3], [x_0 + 4, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], black_list)
            }
            if (count == 5) {return 1}

            // direction 3
            direction = [[x_0, y_0 + 1], [x_0, y_0 + 2], [x_0, y_0 + 3], [x_0, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], black_list)
            }
            if (count == 5) {return 1}

            // direction 4
            direction = [[x_0 - 1, y_0 + 1], [x_0 - 2, y_0 + 2], [x_0 - 3, y_0 + 3], [x_0 - 4, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], black_list)
            }
            if (count == 5) {return 1}
        }
        return 0
    }
    else{
        // white
        for (let i = 0; i<white_list.length; i++){
            x_0 = white_list[i][0]
            y_0 = white_list[i][1]
            // direction 1
            direction = [[x_0 + 1, y_0], [x_0 + 2, y_0], [x_0 + 3, y_0], [x_0 + 4, y_0]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], white_list)
            }
            if (count == 5) {return 1}

            // direction 2
            direction = [[x_0 + 1, y_0 + 1], [x_0 + 2, y_0 + 2], [x_0 + 3, y_0 + 3], [x_0 + 4, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], white_list)
            }
            if (count == 5) {return 1}

            // direction 3
            direction = [[x_0, y_0 + 1], [x_0, y_0 + 2], [x_0, y_0 + 3], [x_0, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], white_list)
            }
            if (count == 5) {return 1}

            // direction 4
            direction = [[x_0 - 1, y_0 + 1], [x_0 - 2, y_0 + 2], [x_0 - 3, y_0 + 3], [x_0 - 4, y_0 + 4]]
            count = 1
            for (let dir = 0; dir<4; dir++){
                count += in_list(direction[dir][0], direction[dir][1], white_list)
            }
            if (count == 5) {return 1}
        }
        return 0

    }
}

function game(){
	canvas.width=Width;
	canvas.height=Height;
    draw_background();
}
window.addEventListener("click", (event) => { 
    const rect = canvas.getBoundingClientRect()
    let id_x = Math.round(20 * (event.clientX-rect.left) / (rect.right-rect.left) - 3);
    let id_y = Math.round(20 * (event.clientY-rect.top) / (rect.bottom-rect.top) - 3);
    console.log(id_x, id_y);
    if (-1<id_x && id_x<15 && -1<id_y && id_y<15){

        if (in_list(id_x, id_y, black_list) == 0 && in_list(id_x, id_y, white_list) == 0){
            if (win == 0){
                draw_circle(id_x, id_y);
            }      
        }      
    }
});

window.onload = game;