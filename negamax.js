var GameBoard = [
    //0 1  2  3  4  5  6  7  8  9  0  1  2  3  4      
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //4
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //5
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //7
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //11
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
]
GameBoard[7][7] = 1;
GameBoard[8][8] = -1;
// GameBoard[7][9] = 1;
// GameBoard[8][7] = -1;
// GameBoard[6][8] = 1;
// GameBoard[5][9] = -1;
// GameBoard[7][10] = 1;
// GameBoard[7][8] = -1;
// GameBoard[6][9] = 1;
// GameBoard[6][10] = -1;
// GameBoard[7][11] = 1;
// GameBoard[9][11] = -1;
// GameBoard[8][10] = 1;
// GameBoard[7][12] = -1;
// GameBoard[8][6] = 1;
// GameBoard[4][6] = -1;
// GameBoard[9][8] = 1;
// GameBoard[9][9] = -1;
// GameBoard[10][6] = 1;
// GameBoard[9][6] = -1;
// GameBoard[7][5] = 1;
// GameBoard[9][5] = -1;
// GameBoard[6][4] = 1;
// GameBoard[5][3] = -1;
// GameBoard[10][7] = 1;
// GameBoard[10][5] = -1;
// GameBoard[11][4] = 1;
// GameBoard[8][9] = -1;
// GameBoard[9][4] = 1;
// GameBoard[9][10] = -1;
// GameBoard[6][7]=1;
// GameBoard[10][11]=-1;

const aiPlayer = 1;
const huPlayer = -1;
var fc = 0;
const FiguresToWin = 5;
const Rows = GameBoard.length;
const Columns = GameBoard[0].length
const WIN_DETECTED = false;
const LiveOne = 10;
const DeadOne = 1;
const LiveTwo = 100;
const DeadTwo = 10;
const LiveThree = 1000;
const DeadThree = 100;
const LiveFour = 10000;
const DeadFour = 1000;
const Five = 100000;

function eval_board(Board, pieceType, restrictions) {
    var score = 0;
    let min_r = restrictions[0];
    let min_c = restrictions[1];
    let max_r = restrictions[2];
    let max_c = restrictions[3];
    for (var row = min_r; row < max_r + 1; row++) {
        for (var column = min_c; column < max_c + 1; column++) {
            if (Board[row][column] == pieceType) {
                var block = 0;
                var piece = 1;
                // left
                if (column === 0 || Board[row][column - 1] !== 0) {
                    block++;
                }
                // pieceNum
                for (column++; column < Columns && Board[row][column] === pieceType; column++) {
                    piece++;
                }
                // right
                if (column === Columns || Board[row][column] !== 0) {
                    block++;
                }
                score += evaluateblock(block, piece);
            }
        }
    }

    for (var column = min_c; column < max_c + 1; column++) {
        for (var row = min_r; row < max_r + 1; row++) {
            if (Board[row][column] == pieceType) {
                var block = 0;
                var piece = 1;
                // left
                if (row === 0 || Board[row - 1][column] !== 0) {
                    block++;
                }
                // pieceNum
                for (row++; row < Rows && Board[row][column] === pieceType; row++) {
                    piece++;
                }
                // right
                if (row === Rows || Board[row][column] !== 0) {
                    block++;
                }
                score += evaluateblock(block, piece);
            }
        }
    }

    for (var n = min_r; n < (max_c - min_c + max_r); n += 1) {
        var r = n;
        var c = min_c;
        while (r >= min_r && c <= max_c) {
            if (r <= max_r) {
                if (Board[r][c] === pieceType) {
                    var block = 0;
                    var piece = 1;
                    // left
                    if (c === 0 || r === Rows - 1 || Board[r + 1][c - 1] !== 0) {
                        block++;
                    }
                    // pieceNum
                    r--;
                    c++;
                    for (; r >= 0 && Board[r][c] === pieceType; r--) {
                        piece++;
                        c++
                    }
                    // right
                    if (r < 0 || c === Columns || Board[r][c] !== 0) {
                        block++;
                    }
                    score += evaluateblock(block, piece);
                }
            }
            r -= 1;
            c += 1;
        }
    }

    for (var n = min_r - (max_c - min_c); n <= max_r; n++) {
        var r = n;
        var c = min_c;
        var str = '';
        while (r <= max_r && c <= max_c) {
            if (r >= min_r && r <= max_r) {
                if (Board[r][c] === pieceType) {
                    var block = 0;
                    var piece = 1;
                    // left
                    if (c === 0 || r === 0 || Board[r - 1][c - 1] !== 0) {
                        block++;
                    }
                    // pieceNum
                    r++;
                    c++;
                    for (; r < Rows && Board[r][c] == pieceType; r++) {
                        piece++;
                        c++;
                    }
                    // right
                    if (r === Rows || c === Columns || Board[r][c] !== 0) {
                        block++;
                    }
                    score += evaluateblock(block, piece);
                }
            }
            r += 1;
            c += 1;
        }

    }
    return score;
}

function evaluateblock(blocks, pieces) {
    if (blocks === 0) {
        switch (pieces) {
            case 1:
                return LiveOne;
            case 2:
                return LiveTwo;
            case 3:
                return LiveThree;
            case 4:
                return LiveFour;
            default:
                return Five;
        }
    } else if (blocks === 1) {
        switch (pieces) {
            case 1:
                return DeadOne;
            case 2:
                return DeadTwo;
            case 3:
                return DeadThree;
            case 4:
                return DeadFour;
            default:
                return Five;
        }
    } else {
        if (pieces >= 5) {
            return Five;
        } else {
            return 0
        }
    }
}

function check_directions(arr) {
    for (var i = 0; i < arr.length - 4; i++) {
        if (arr[i] !== 0) {
            if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2] && arr[i] === arr[i + 3] && arr[i] === arr[i + 4]) {
                return true
            }
        }

    }
}

function get_directions(Board, x, y) {
    let Directions = [[],[],[],[]];
    for (var i = -4; i < 5; i++) {
        if (x + i >= 0 && x + i <= Rows - 1) {
            Directions[0].push(Board[x + i][y])
            if (y + i >= 0 && y + i <= Columns - 1) {
                Directions[2].push(Board[x + i][y + i])
            }
        }
        if (y + i >= 0 && y + i <= Columns - 1) {
            Directions[1].push(Board[x][y + i])
            if (x - i >= 0 && x - i <= Rows - 1) {
                Directions[3].push(Board[x - i][y + i])
            }
        }

    }
    return Directions
}

function checkwin(Board, x, y) {
    let Directions = get_directions(Board, x, y)
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
                move.score = evalute_move(Board, i, j, player)
                if (move.score === WIN_DETECTED) {
                    return [move]
                }
                availSpots_score.push(move)
            }
        }
    }
    availSpots_score.sort(compare);
    //  return availSpots_score.slice(0,20)
    return availSpots_score;
}

function evaluate_direction(direction_arr, player) {
    let score = 0;
    for (var i = 0;(i + 4) < direction_arr.length; i++) {
        let you = 0;
        let enemy = 0;
        for (var j = 0; j <= 4; j++) {
            if (direction_arr[i + j] === player) {
                you++
            } else if (direction_arr[i + j] === -player) {
                enemy++
            }
        }
        score += evalff(get_seq(you, enemy));
        if ((score >= 800000)) {
            return WIN_DETECTED;
        }
    }
    return score
}


function evalff(seq) {
    switch (seq) {
        case 0:
            return 7;
        case 1:
            return 35;
        case 2:
            return 800;
        case 3:
            return 15000;
        case 4:
            return 800000;
        case -1:
            return 15;
        case -2:
            return 400;
        case -3:
            return 1800;
        case -4:
            return 100000;
        case 17:
            return 0;
    }
}

function get_seq(y, e) {
    if (y + e === 0) {
        return 0;
    }
    if (y !== 0 && e === 0) {
        return y
    }
    if (y === 0 && e !== 0) {
        return -e
    }
    if (y !== 0 && e !== 0) {
        return 17
    }
}

function evalute_move(Board, x, y, player) {
    let score = 0;
    let Directions = get_directions(Board, x, y);
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

function evaluate_state(Board, player, hash, restrictions) {
    var black_score = eval_board(Board, -1, restrictions);
    var white_score = eval_board(Board, 1, restrictions);
    var score = 0;
    if (player = -1) {
        score = -(black_score - white_score);
    } else {
        score = -(white_score - black_score);
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
            let Board_value = board[i][j];
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
        return evaluate_state(newBoard, player, hash, restrictions)
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
        return bestMove
    } else {
        return bestvalue
    }
}

function iterative_negamax(player, Board, depth) {
    var bestmove;
    var i = 2;
    while (i !== depth + 2) {
        MaximumDepth = i;
        bestmove = negamax(Board, player, MaximumDepth, -Infinity, Infinity, hash(Board), Get_restrictions(Board), 0, 0)
        console.log(bestmove)
        //  Set_last_best(bestmove)
        if (bestmove.score > 1999900) {
            break;
        }
        i += 2;
    }
    return bestmove
}


var MaximumDepth; //GLOBAL USED IN SEARCH FUNCTIONS
Hashtable_init();
var CacheHits = 0;
var Cutoffs = 0;
var CacheCutoffs = 0;
var CachePuts = 0;
var cch_hts = 0;
var cch_pts = 0;

function search(player, depth) {
    MaximumDepth = depth;
    var t0 = performance.now();
    let bestmove = iterative_negamax(player,GameBoard,depth)
    // let bestmove = negamax(GameBoard, player, depth, -Infinity, Infinity, hash(GameBoard), Get_restrictions(GameBoard), 0, 0)
    var t1 = performance.now();
    Cache = {}
    StateCache = {}
    console.log({
        bestmove: bestmove,
        CacheHits: CacheHits,
        CacheCutoffs: CacheCutoffs,
        CachePuts: CachePuts,
        StateCacheHits: cch_hts,
        StateCachePuts: cch_pts,
        fc: fc,
        time: (t1 - t0) / 1000
    })
}
search(1, 8);
