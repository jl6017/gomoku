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
let terminal = 0;
let id_x = 0;
let id_y = 0;
let empty_list = [];
for (let i = 0; i<=grid; i++) {
    for (let j = 0; j<=grid; j++){
        empty_list.push([i,j]);
    }
}

// four directions -, /, |, \
let dir_x = [1, 1, 0,-1];
let dir_y = [0, 1, 1, 1];
let score_board = [

]

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


function renew_empty_list(x, y){
    for (let i = 0; i<empty_list.length; i++){
        if (empty_list[i][0] == x && empty_list[i][1] == y){
            empty_list.splice(i, 1)
        }
    }
}


function draw_circle(x_id, y_id){
    ctx.beginPath();
    ctx.arc(x_id * grid_w + margin, y_id * grid_w + margin, radius, 0, 2 * Math.PI, false);
    if (black_or_white==0){
        ctx.fillStyle = 'black';
        black_list.push([x_id, y_id]);
        renew_empty_list(x_id, y_id);
        if (check_win() == 10000){
            document.getElementById("p1").innerHTML = "Black win!";
            terminal = 1;
        }
        else {
            document.getElementById("p1").innerHTML = "White turn";
        }
        black_or_white = 1;
    }
    else{
        ctx.fillStyle = 'white';
        white_list.push([x_id, y_id]);
        renew_empty_list(x_id, y_id);
        if (check_win() == -10000){
            document.getElementById("p1").innerHTML = "White win!";
            terminal = 1;
        }
        else{
            document.getElementById("p1").innerHTML = "Black turn";
        }
        black_or_white = 0;
    }
    
    ctx.fill();
}

function in_list(x_n, y_n, list_n){
    // if in list return 1, not in list, return 0
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
            // four directions
            for (let d = 0; d<4; d++){
                direction = [
                    [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
                    [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
                    [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
                    [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]
                count = 1
                for (let dir = 0; dir<4; dir++){
                    count += in_list(direction[dir][0], direction[dir][1], black_list)
                }
                if (count == 5) {return 10000}
            }
        }
        return 0
    }
    else{
        // white
        for (let i = 0; i<white_list.length; i++){
            x_0 = white_list[i][0]
            y_0 = white_list[i][1]
            // direction 1
            for (let d = 0; d<4; d++){
                direction = [
                    [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
                    [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
                    [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
                    [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]
                count = 1
                for (let dir = 0; dir<4; dir++){
                    count += in_list(direction[dir][0], direction[dir][1], white_list)
                }
                if (count == 5) {return -10000}
            }
        }
        return 0
    }
}

function eval_black_white(){
    let count = 0;
    let blocks = 0;
    let x_0 = 0;
    let y_0 = 0;
    let direction = [];
    let score = 0;
    
    // black
    for (let i = 0; i<black_list.length; i++){
        x_0 = black_list[i][0]
        y_0 = black_list[i][1]

        for (let d = 0; d < 4; d++){
            // four directions
            count = 0;
            blocks = 0;
            direction = [
                [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
                [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
                [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
                [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]  
                
            for (let steps = 0; steps<4; steps++){
                if (in_list(direction[steps][0], direction[steps][1], black_list) == 1){
                    count += 1;
                }
                else if (in_list(direction[steps][0], direction[steps][1], white_list) == 1){
                    blocks += 1;
                    break
                }
                else if (in_list(direction[steps][0], direction[steps][1], empty_list) == 1){

                    break
                }
            }

            // check one step before
            if (in_list(x_0 - 1 * dir_x[d], y_0 - 1 * dir_y[d], white_list) == 1){
                blocks += 1
                break
            }
        }



    }


}

function game(){
	canvas.width=Width;
	canvas.height=Height;
    draw_background();
    alpha_beta();
}

function alpha_beta(){
    let rand_idx = Math.floor(Math.random() * empty_list.length);

    id_x = empty_list[rand_idx][0];
    id_y = empty_list[rand_idx][1];
    
    console.log(id_x, id_y);
    draw_circle(id_x, id_y);
}

window.addEventListener("click", (event) => { 
    const rect = canvas.getBoundingClientRect()

    // if (black_or_white==0){
    //     alpha_beta()
    // }
    // else{
    //     id_x = Math.round(20 * (event.clientX-rect.left) / (rect.right-rect.left) - 3);
    //     id_y = Math.round(20 * (event.clientY-rect.top) / (rect.bottom-rect.top) - 3);
    // }

    id_x = Math.round(20 * (event.clientX-rect.left) / (rect.right-rect.left) - 3);
    id_y = Math.round(20 * (event.clientY-rect.top) / (rect.bottom-rect.top) - 3);
    
    console.log(id_x, id_y);
    if (-1<id_x && id_x<15 && -1<id_y && id_y<15){

        if (in_list(id_x, id_y, black_list) == 0 && in_list(id_x, id_y, white_list) == 0){
            if (terminal == 0){
                draw_circle(id_x, id_y);
                if (check_win() == 10000){
                    document.getElementById("p1").innerHTML = "Black win!";
                    terminal = 1;
                }
                if (terminal != 1){
                    alpha_beta();
                }             
            }      
        }      
    }
});

window.onload = game;