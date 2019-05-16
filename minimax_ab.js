var GameBoard = [
    //0 1  2  3  4  5  6  7  8  9  0  1  2  3  4      
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //4
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //5
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], //7
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //11
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
]
const aiPlayer = 1;
const huPlayer = -1;
var fc = 0;
const FiguresToWin = 5;
const Rows = GameBoard.length;
const Columns = GameBoard[0].length
const WIN_DETECTED=false;
function check_directions(arr) {
    for (var i = 0; i < arr.length - 4; i++) {
        if (arr[i] !== 0) {
            if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2] && arr[i] === arr[i + 3] && arr[i] === arr[i + 4]) {
                return true
            }
        }

    }
}
function get_directions(Board,x,y){
     let Directions = [[],[],[],[]];
    for (var i = -4; i < 5; i++) {
        if (x + i >= 0 && x + i <= 14) {
            Directions[0].push(Board[x + i][y])
           if (y + i >= 0 && y + i <= 14 ) {
            Directions[2].push(Board[x + i][y + i])
        }
        }
        if (y + i >= 0 && y + i <= 14) {
            Directions[1].push(Board[x][y + i])
              if (x - i >= 0 && x - i <= 14) {
            Directions[3].push(Board[x - i][y + i])
        }
        }
        
    }
    return Directions
}
function checkwin(Board, x, y) {
    let Directions = get_directions(Board,x,y)
    for (var i = 0; i < 4; i++) {
        if (check_directions(Directions[i])) {
            return true
        }
    }
}

function remoteCell(Board, r, c) {
    for (var i = r - 2; i <= r + 2; i++) {
        if (i < 0 || i >= Rows) continue;
        for (var j = c - 2; j <= c + 2; j++) {
            if (j < 0 || j >= Columns) continue;
            if (Board[i][j] !== 0) return false;
        }
    }
    return true;
}

function Get_restrictions(Board) {
    let min_r = Infinity;
    let min_c = Infinity;
    let max_r = -Infinity;
    let max_c = -Infinity;
    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Columns; j++) {
            if (Board[i][j] !== 0) {
                min_r = Math.min(min_r, i)
                min_c = Math.min(min_c, j)
                max_r = Math.max(max_r, i)
                max_c = Math.max(max_c, j)
            }
        }
    }
    if (min_r - 2 < 0) {
        min_r = 2;
    }
    if (min_c - 2 < 0) {
        min_c = 2;
    }
    if (max_r + 2 >= Rows) {
        max_r = Rows - 3;
    }
    if (max_c + 2 >= Columns) {
        max_c = Columns - 3;
    }
    return [min_r, min_c, max_r, max_c]
}

function Change_restrictions(restrictions, i, j) {
    let min_r = restrictions[0];
    let min_c = restrictions[1];
    let max_r = restrictions[2];
    let max_c = restrictions[3];
    if (i < min_r) {
        min_r = i
    } else if (i > max_r) {
        max_r = i
    }
    if (j < min_c) {
        min_c = j
    } else if (j > max_c) {
        max_c = j
    }
    if (min_r - 2 < 0) {
        min_r = 2;
    }
    if (min_c - 2 < 0) {
        min_c = 2;
    }
    if (max_r + 2 >= Rows) {
        max_r = Rows - 3;
    }
    if (max_c + 2 >= Columns) {
        max_c = Columns - 3;
    }
    return [min_r, min_c, max_r, max_c]
}

function compare(a, b) {
    if (a.score < b.score)
        return 1;
    if (a.score > b.score)
        return -1;
    return 0;
}
var BoardGenerator_Cache = {}

function BoardGenerator(restrictions, Board, player) {
    let availSpots_score = []; //c is j  r is i;
    let min_r = restrictions[0];
    let min_c = restrictions[1];
    let max_r = restrictions[2];
    let max_c = restrictions[3];
    let move = {};
    for (var i = min_r - 2; i <= max_r + 2; i++) {
        for (var j = min_c - 2; j <= max_c + 2; j++) {
            if (Board[i][j] === 0 && !remoteCell(Board, i, j)) {
                move = {}
                move.i = i;
                move.j = j;
                // move.score = evalute_move(Board, i, j, player)
                move.score = evalute_move(Board, i, j, player)
                if (move.score === WIN_DETECTED) {
                    //BoardGenerator_Cache[hash]=move
                    return [move]
                }
                availSpots_score.push(move)
            }
        }
    }
    availSpots_score.sort(compare);
    return availSpots_score;
}
var Scores = [19, 15, 11, 7, 3]
function evaluate_direction(direction_arr, player) {
    let score = 0;
    let empty;
    let stones;
    for (var i = 0;(i + 4) < direction_arr.length; i++) {
        empty = 0;
        stones = 0;
        for (var j = 0; j <= 4; j++) {
            if (direction_arr[i + j] === 0) {
                empty++;
            } else if (direction_arr[i + j] === player) {
                stones++
            } else {
                break;
            }
        }
        if (stones === 5) {
            return WIN_DETECTED
        }
        if (empty === 5) {
            continue
        }

        if ((stones + empty) === 5) {
            score += Scores[empty]
        }
    }
    return score;
}

function evalute_move(Board, x, y, player) {
    let score = 0;
    let prev_value = Board[x][y]
    Board[x][y] = player;
    let Directions = get_directions(Board,x,y);
    Board[x][y] = prev_value;
    let temp_score;
    for (var i = 0; i < 4; i++) {
        temp_score = evaluate_direction(Directions[i], player);
        if (temp_score === WIN_DETECTED) {
            return WIN_DETECTED
        } else {
            score += temp_score
        }
    }
    return score;
}
var StateCache = {};

function evaluateState(restrictions, Board, player, hash) {
    let min_r = restrictions[0];
    let min_c = restrictions[1];
    let max_r = restrictions[2];
    let max_c = restrictions[3];
    let score = 0;
    for (var i = min_r - 2; i <= max_r + 2; i++) {
        for (var j = min_c - 2; j <= max_c + 2; j++) {
            let Board_value=Board[i][j]
            if (Board_value === -player) {
                score -= evalute_move(Board, i, j, -player);
            } else if (Board_value === player) {
                score += evalute_move(Board, i, j, player);
            }
        }
    }
    StateCache[hash] = score;
    cch_pts++;
    return score;

}
var Table = []
var Cache = {};

function random32() {
    let o = new Uint32Array(1);
    self.crypto.getRandomValues(o);
    return o[0];
}

function Hashtable_init() {
    for (var i = 0; i < Rows; i++) {
        Table[i] = [];
        for (var j = 0; j < Columns; j++) {
            Table[i][j] = []
            Table[i][j][0] = random32(); //1
            Table[i][j][1] = random32(); //2
        }

    }

}

function hash(board) {
    let h = 0;
    let p;
    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Columns; j++) {
            let Board_value=board[i][j];
            if (Board_value !== 0) {
                if (Board_value === -1) {
                    p = 0
                } else {
                    p = 1
                }
                h = h ^ Table[i][j][p];
            }
        }
    }
    return h;
}

function update_hash(hash, player, row, col) {
    if (player === -1) {
        player = 0
    } else {
        player = 1
    }
    hash = hash ^ Table[row][col][player];
    return hash
}


function negamax(newBoard, player, depth, a, b, hash, restrictions, last_i, last_j) {
    const alphaOrig = a;
    if ((Cache[hash] !== undefined) && (Cache[hash].depth >= depth)) {
        CacheHits++;
        let score = Cache[hash].score;
        if (Cache[hash].Flag === 0) {
            CacheCutoffs++;
            return score
        }
        if (Cache[hash].Flag === -1) {
            a = Math.max(a, score);
        } else if (Cache[hash].Flag === 1) {
            b = Math.min(b, score);
        }
        if (a >= b) {
            CacheCutoffs++
            return score
        }
    }
    fc++;
    if (checkwin(newBoard, last_i, last_j)) {
        return -2000000 + (MaximumDepth - depth)
    }
    if (depth === 0) {
        if (StateCache[hash] !== undefined) {
            cch_hts++
            return StateCache[hash]
        }
        return evaluateState(restrictions, newBoard, player, hash)
    }
    var availSpots;
    availSpots = BoardGenerator(restrictions, newBoard, player);
    if (availSpots.length === 0) {
        return 0;
    }

    var bestMove;
    var i, j;
    var newHash;
    var bestvalue = -Infinity
    var value;

    for (var y = 0; y < availSpots.length; y++) {
        i = availSpots[y].i;
        j = availSpots[y].j;
        newHash = update_hash(hash, player, i, j)
        newBoard[i][j] = player;
        var restrictions_temp = Change_restrictions(restrictions, i, j)
        value = -negamax(newBoard, -player, depth - 1, -b, -a, newHash, restrictions_temp, i, j)
        newBoard[i][j] = 0;
        if (value > bestvalue) {
            bestvalue = value
            if (depth == MaximumDepth) {
                bestMove = {i: i,j: j,score: value}
            }
        }
        a = Math.max(a, value)
        if (a >= b) {
            break;
        }
    }
    CachePuts++
    Cache[hash] = {score: bestvalue};
    Cache[hash].depth = depth
    if (bestvalue <= alphaOrig) {
        Cache[hash].Flag = 1
    } else if (bestvalue >= b) {
        Cache[hash].Flag = -1
    } else {
        Cache[hash].Flag = 0
    }
    if (depth == MaximumDepth) {
        console.log(1)
        return bestMove
    } else {
        return bestvalue
    }
}


var MaximumDepth; //GLOBAL USED IN SEARCH FUNCTIONS
Hashtable_init();
var CacheHits = 0;
var Cutoffs = 0;
var CacheCutoffs = 0;
var CachePuts = 0;
var cch_hts = 0;
var cch_pts=0;
function search(player,depth) {
    MaximumDepth=depth;
    var t0 = performance.now(); 
    let bestmove =  negamax(GameBoard, player, depth, -Infinity, Infinity, hash(GameBoard), Get_restrictions(GameBoard), 0,0)
    var t1 = performance.now();
    Cache={}
    StateCache={}
   console.log({
        bestmove:bestmove,
        CacheHits:CacheHits,
        CacheCutoffs:CacheCutoffs,
        CachePuts:CachePuts,
        StateCacheHits:cch_hts,
        StateCachePuts:cch_pts,
        fc:fc,
        time:(t1 - t0) / 1000
    })
}
