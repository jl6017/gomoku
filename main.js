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
const dir_x = [1, 1, 0,-1];
const dir_y = [0, 1, 1, 1];
const score_board = [
    [0,20,100,500,2500,200000],
    [0, 0, 20,100, 500,200000],
    [0, 0,  0,  0,   0,200000]
];
// zero block; one block; two blocks
const max_depth = 3;


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
            empty_list.splice(i, 1);
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
        console.log("black",eval_black_white(black_list, white_list, empty_list))
        if (eval_black_white(black_list, white_list, empty_list) >= 100000){
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
        console.log("white", eval_black_white(black_list, white_list, empty_list))
        if (eval_black_white(black_list, white_list, empty_list) <= -100000){
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

// function check_win(){
//     let count = 0
//     let x_0 = 0
//     let y_0 = 0
//     let direction = []
//     if (black_or_white==0){
//         // black
//         for (let i = 0; i<black_list.length; i++){
//             x_0 = black_list[i][0]
//             y_0 = black_list[i][1]
//             // four directions
//             for (let d = 0; d<4; d++){
//                 direction = [
//                     [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
//                     [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
//                     [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
//                     [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]
//                 count = 1
//                 for (let dir = 0; dir<4; dir++){
//                     count += in_list(direction[dir][0], direction[dir][1], black_list)
//                 }
//                 if (count == 5) {return 10000}
//             }
//         }
//         return 0
//     }
//     else{
//         // white
//         for (let i = 0; i<white_list.length; i++){
//             x_0 = white_list[i][0]
//             y_0 = white_list[i][1]
//             // direction 1
//             for (let d = 0; d<4; d++){
//                 direction = [
//                     [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
//                     [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
//                     [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
//                     [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]
//                 count = 1
//                 for (let dir = 0; dir<4; dir++){
//                     count += in_list(direction[dir][0], direction[dir][1], white_list)
//                 }
//                 if (count == 5) {return -10000}
//             }
//         }
//         return 0
//     }
// }

function eval_black_white(my_black_list, my_white_list, my_empty_list){
    let count = 0;
    let blocks = 0;
    let x_0 = 0;
    let y_0 = 0;
    let direction = [];
    let black_score = 0;
    let white_score = 0;
    
    // black
    for (let i = 0; i<my_black_list.length; i++){
        // every black piece
        x_0 = my_black_list[i][0];
        y_0 = my_black_list[i][1];

        for (let d = 0; d < 4; d++){
            // four directions
            count = 1;
            blocks = 0;
            direction = [
                [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
                [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
                [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
                [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]  
                
            for (let steps = 0; steps<4; steps++){
                if (in_list(direction[steps][0], direction[steps][1], my_black_list) == 1){
                    count += 1;
                }
                else if (in_list(direction[steps][0], direction[steps][1], my_white_list) == 1){
                    blocks += 1;
                    break;
                }
                else if (in_list(direction[steps][0], direction[steps][1], my_empty_list) == 1){

                    break;
                }
            }

            // check one step before, add block if meet the other color
            if (in_list(x_0 - 1 * dir_x[d], y_0 - 1 * dir_y[d], my_white_list) == 1){
                blocks += 1;
            }

            black_score += score_board[blocks][count];
        }
    }

    // white
    for (let i = 0; i<my_white_list.length; i++){
        // every black piece
        x_0 = my_white_list[i][0];
        y_0 = my_white_list[i][1];

        for (let d = 0; d < 4; d++){
            // four directions
            count = 1;
            blocks = 0;
            direction = [
                [x_0 + 1 * dir_x[d], y_0 + 1 * dir_y[d]], 
                [x_0 + 2 * dir_x[d], y_0 + 2 * dir_y[d]], 
                [x_0 + 3 * dir_x[d], y_0 + 3 * dir_y[d]], 
                [x_0 + 4 * dir_x[d], y_0 + 4 * dir_y[d]]]  
                
            for (let steps = 0; steps<4; steps++){
                if (in_list(direction[steps][0], direction[steps][1], my_white_list) == 1){
                    count += 1;
                }
                else if (in_list(direction[steps][0], direction[steps][1], my_black_list) == 1){
                    blocks += 1;
                    break;
                }
                else if (in_list(direction[steps][0], direction[steps][1], my_empty_list) == 1){

                    break;
                }
            }

            // check one step before, add block if meet the other color
            if (in_list(x_0 - 1 * dir_x[d], y_0 - 1 * dir_y[d], my_black_list) == 1){
                blocks += 1;
            }
            
            white_score += score_board[blocks][count];
            
        }
    }

    return black_score - white_score

}

function game(){
	canvas.width=Width;
	canvas.height=Height;
    draw_background();
    alpha_beta();
}

function alpha_beta(){
    if (black_list.length == 0){
        id_x = 7;
        id_y = 7;
    }
    else {

        // let rand_idx = Math.floor(Math.random() * empty_list.length);
        // console.log(empty_list.length);
        let step = black_search_algorithm();
        // console.log(empty_list.length);
        // id_x = empty_list[rand_idx][0];
        // id_y = empty_list[rand_idx][1]; 
        id_x = step[0];
        id_y = step[1];
    }



    // console.log(eval_black_white(black_list, white_list, empty_list));

    draw_circle(id_x, id_y);
    if (eval_black_white(black_list, white_list, empty_list) >= 100000){
        document.getElementById("p1").innerHTML = "Black win!";
        terminal = 1;
    }
}

function black_search_algorithm(){
    let give_x = 0;
    let give_y = 0;
    let depth = 0;

    let orig_state = [black_list, white_list, empty_list];

    let max_step = max_value(orig_state, -1000000, 1000000, depth);

    return max_step;
}

function max_value(state, alpha, beta, depth){
    let temp_black = state[0];
    let temp_white = state[1];
    let temp_empty = state[2];
    // let temp_score = eval_black_white(temp_black, temp_white, temp_empty)
    // if (temp_score >= 100000 || temp_score <= -100000 || depth > max_depth){
    //     // terminal
    //     console.log("here")
    //     return [temp_score, 0]
    // }

    let temp_value = -1000000
    let best_step = temp_empty[0]
    for (let id = 0; id < temp_empty.length; id++){
        let temp_black_copy = JSON.parse(JSON.stringify(temp_black));
        let temp_white_copy = JSON.parse(JSON.stringify(temp_white));
        let temp_empty_copy = JSON.parse(JSON.stringify(temp_empty));  // deep copy
        let next_step = temp_empty_copy[id];
        temp_empty_copy.splice(id, 1);
        temp_black_copy.push(next_step);
        // let max_value = eval_black_white(temp_black_copy, temp_white_copy, temp_empty_copy)

        let min_v = min_value([temp_black_copy, temp_white_copy, temp_empty_copy], alpha, beta, depth+1);

        if (min_v > temp_value){
            temp_value = min_v;
            best_step = next_step;
        }

    }

    return best_step;
}

function min_value(state, alpha, beta, depth){
    let temp_black = state[0];
    let temp_white = state[1];
    let temp_empty = state[2];
    // let temp_score = eval_black_white(temp_black, temp_white, temp_empty)
    // if (temp_score >= 100000 || temp_score <= -100000 || depth > max_depth){
    //     // terminal
    //     console.log("here")
    //     return [temp_score, 0]
    // }

    let temp_value = 1000000
    let best_step = temp_empty[0]
    for (let id = 0; id < temp_empty.length; id++){
        let temp_black_copy = JSON.parse(JSON.stringify(temp_black));
        let temp_white_copy = JSON.parse(JSON.stringify(temp_white));
        let temp_empty_copy = JSON.parse(JSON.stringify(temp_empty));  // deep copy
        let next_step = temp_empty_copy[id];
        temp_empty_copy.splice(id, 1);
        temp_black_copy.push(next_step);
        let min_value = eval_black_white(temp_black_copy, temp_white_copy, temp_empty_copy)
        if (min_value < temp_value){
            temp_value = min_value;
            best_step = next_step;
        }
        // let min_v = max_value([temp_black_copy, temp_white_copy, temp_empty_copy], alpha, beta, depth+1)[0];


    }
    return temp_value;
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
    
    // console.log(id_x, id_y);
    if (-1<id_x && id_x<15 && -1<id_y && id_y<15){

        if (in_list(id_x, id_y, black_list) == 0 && in_list(id_x, id_y, white_list) == 0){
            if (terminal == 0){
                draw_circle(id_x, id_y);

                if (terminal != 1){
                    alpha_beta();
                }             
            }      
        }      
    }
});

window.onload = game;