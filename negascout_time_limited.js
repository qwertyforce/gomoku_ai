const GameBoard = [
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
// GameBoard[7][7] = 1;
// GameBoard[8][8] = -1;
// GameBoard[6][6] = 1;
// GameBoard[7][5] = -1;
// GameBoard[9][7] = 1;
// GameBoard[8][7] = -1;
// GameBoard[8][6] = 1;
// GameBoard[7][6] = -1;
// GameBoard[6][8] = 1;
// GameBoard[5][9] = -1;
// GameBoard[6][5] = 1;
// GameBoard[6][7] = -1;
// GameBoard[5][8] = 1;
// GameBoard[9][8] = -1;
// GameBoard[10][8] = 1;
// GameBoard[8][9] = -1;
// GameBoard[7][8] = 1;
// GameBoard[10][9] = -1;
// GameBoard[11][10] = 1;
// GameBoard[11][9] = -1;
// GameBoard[9][9] = 1;
// GameBoard[8][10] = -1;
// GameBoard[8][11] = 1;
// GameBoard[7][10] = -1;
// GameBoard[6][11] = 1;
// GameBoard[6][10] = -1;
// GameBoard[9][10] = 1;
// GameBoard[4][8] = -1;
// GameBoard[7][11] = 1;
// GameBoard[5][11] = -1;
// GameBoard[10][11]=1;
// GameBoard[9][11] = -1;
// GameBoard[12][9]=1;
// GameBoard[7][9] = -1;

const aiPlayer = 1;
const huPlayer = -1;
let fc = 0;
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
    let score = 0;
    const min_r = restrictions[0];
    const min_c = restrictions[1];
    const max_r = restrictions[2];
    const max_c = restrictions[3];
    for (let row = min_r; row < max_r + 1; row++) {
        for (let column = min_c; column < max_c + 1; column++) {
            if (Board[row][column] == pieceType) {
                let block = 0;
                let piece = 1;
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

    for (let column = min_c; column < max_c + 1; column++) {
        for (let row = min_r; row < max_r + 1; row++) {
            if (Board[row][column] == pieceType) {
                let block = 0;
                let piece = 1;
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

    for (let n = min_r; n < (max_c - min_c + max_r); n += 1) {
        let r = n;
        let c = min_c;
        while (r >= min_r && c <= max_c) {
            if (r <= max_r) {
                if (Board[r][c] === pieceType) {
                    let block = 0;
                    let piece = 1;
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

    for (let n = min_r - (max_c - min_c); n <= max_r; n++) {
        let r = n;
        let c = min_c;
        while (r <= max_r && c <= max_c) {
            if (r >= min_r && r <= max_r) {
                if (Board[r][c] === pieceType) {
                    let block = 0;
                    let piece = 1;
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
    for (let i = 0; i < arr.length - 4; i++) {
        if (arr[i] !== 0) {
            if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2] && arr[i] === arr[i + 3] && arr[i] === arr[i + 4]) {
                return true
            }
        }

    }
}

function get_directions(Board, x, y) {
    const Directions = [[],[],[],[]];
    for (let i = -4; i < 5; i++) {
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
    const Directions = get_directions(Board, x, y)
    for (let i = 0; i < 4; i++) {
        if (check_directions(Directions[i])) {
            return true
        }
    }
}

function remoteCell(Board, r, c) {
    for (let i = r - 2; i <= r + 2; i++) {
        if (i < 0 || i >= Rows) continue;
        for (let j = c - 2; j <= c + 2; j++) {
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
    for (let i = 0; i < Rows; i++) {
        for (let j = 0; j < Columns; j++) {
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

function BoardGenerator(restrictions, Board, player) {
    const availSpots_score = []; //c is j  r is i;
    const min_r = restrictions[0];
    const min_c = restrictions[1];
    const max_r = restrictions[2];
    const max_c = restrictions[3];;
    for (let i = min_r - 2; i <= max_r + 2; i++) {
        for (let j = min_c - 2; j <= max_c + 2; j++) {
            if (Board[i][j] === 0 && !remoteCell(Board, i, j)) {
                const move = {}
                move.i = i;
                move.j = j;
                move.score = evaluate_move(Board, i, j, player)
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
    for (let i = 0;(i + 4) < direction_arr.length; i++) {
        let you = 0;
        let enemy = 0;
        for (let j = 0; j <= 4; j++) {
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

function evaluate_move(Board, x, y, player) {
    let score = 0;
    const Directions = get_directions(Board, x, y);
    let temp_score;
    for (let i = 0; i < 4; i++) {
        temp_score = evaluate_direction(Directions[i], player);
        if (temp_score === WIN_DETECTED) {
            return WIN_DETECTED
        } else {
            score += temp_score
        }
    }
    return score;
}


function evaluate_state(Board, player, hash, restrictions) {
    const  black_score = eval_board(Board, -1, restrictions);
    const  white_score = eval_board(Board, 1, restrictions);
    let score = 0;
    if (player == -1) {
        score = (black_score - white_score);
    } else {
        score = (white_score - black_score);
    }
    StateCache.set(hash,score);
    StateCachePuts++;
    return score;
}



function random32() {
    let o = new Uint32Array(1);
    self.crypto.getRandomValues(o);
    return o[0];
}

function Table_init() {
    for (let i = 0; i < Rows; i++) {
        Table[i] = [];
        for (let j = 0; j < Columns; j++) {
            Table[i][j] = []
            Table[i][j][0] = random32(); //1
            Table[i][j][1] = random32(); //2
        }

    }

}

function hash(board) {
    let h = 0;
    let p;
    for (let i = 0; i < Rows; i++) {
        for (let j = 0; j < Columns; j++) {
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

function negascout(newBoard, player, depth, alpha, beta, hash, restrictions, last_i, last_j) {
    if (TIMEOUT()) {
        return 1
    }
    const alphaOrig = alpha;
    const CacheNode =Cache.get(hash)  
    if ((CacheNode !== undefined) && (CacheNode.depth >= depth)) {
        CacheHits++;
        const score = CacheNode.score;
        if (CacheNode.Flag === 0) {
            CacheCutoffs++;
            return score
        }
        if (CacheNode.Flag === -1) {
            alpha = Math.max(alpha, score);
        } else if (CacheNode.Flag === 1) {
            beta = Math.min(beta, score);
        }
        if (alpha >= beta) {
            CacheCutoffs++
            return score
        }
    }
    fc++

    if (checkwin(newBoard, last_i, last_j)) {
        return -2000000 + (MaximumDepth - depth)
    }
    if (depth === 0) {
        const StateCacheNode=StateCache.get(hash);
        if (StateCacheNode !== undefined) {
            StateCacheHits++
            return StateCacheNode
        }
        return evaluate_state(newBoard, player, hash, restrictions)
    }

    const availSpots = BoardGenerator(restrictions, newBoard, player);
    if (availSpots.length === 0) {
        return 0;
    }

    let b = beta;
    let bestscore = -Infinity;
    const bestMove={};
    for (let y = 0; y < availSpots.length; y++) {
        let  i = availSpots[y].i;
        let j = availSpots[y].j;
        const newHash = update_hash(hash, player, i, j)
        newBoard[i][j] = player;
        const restrictions_temp = Change_restrictions(restrictions, i, j)
        let score = -negascout(newBoard, -player, depth - 1, -b, -alpha, newHash, restrictions_temp, i, j)
        if (score > alpha && score < beta && y > 0) {
            score = -negascout(newBoard, -player, depth - 1, -beta, -score, newHash, restrictions_temp, i, j)
        }
        if (score > bestscore) {
            bestscore = score
            if (depth === MaximumDepth) {
                bestMove.i=i
                bestMove.j=j
                bestMove.score=score;
            }
        }
        newBoard[i][j] = 0;
        alpha = Math.max(alpha, score)
        if (alpha >= beta) {
            break;
        }
        b = alpha + 1;
    }
    CachePuts++
    const obj={score: bestscore,depth:depth};
    if (bestscore <= alphaOrig) {
        obj.Flag = 1
    } else if (bestscore >= b) {
        obj.Flag = -1
    } else {
        obj.Flag = 0
    }
    Cache.set(hash,obj);
    if (depth == MaximumDepth) {
        return bestMove
    } else {
        return bestscore
    }
}

function iterative_negascout(player, Board) {
    let bestmove;
    let depth = 2;
    while (!TIMEOUT()) {
        let temp_bestmove;
        MaximumDepth = depth;
        temp_bestmove = negascout(Board, player, MaximumDepth, -Infinity, Infinity, hash(Board), Get_restrictions(Board), 0, 0)
         if (TIMEOUT()) {
            return bestmove;
        }
        bestmove=temp_bestmove
        //  Set_last_best(bestmove)
        console.log(depth)
        console.log(bestmove)
        const t11 = performance.now();
        console.log((t11 - t00) / 1000)
        if (bestmove.score > 1999900) {
            break;
        }
        depth += 2;
    }
    return bestmove
}


function TIMEOUT() {
    if ((Date.now() - startTime) >= MaximumTimeForMove) {
        return true;
    } else {
        return false;
    }
}

const Table = []
const Cache = new Map();
const StateCache = new Map();
let MaximumDepth; //GLOBAL USED IN SEARCH FUNCTION
Table_init();
let CacheHits = 0;
let Cutoffs = 0;
let CacheCutoffs = 0;
let CachePuts = 0;
let StateCacheHits = 0;
let StateCachePuts = 0;
let t00 = performance.now(); 
let MaximumTimeForMove;
let startTime
function search(player, time) {
    startTime = Date.now();
    MaximumTimeForMove=time
    const t0 = performance.now();
    let bestmove = iterative_negascout(player,GameBoard)
    const t1 = performance.now();
    Cache.clear()
    StateCache.clear()
    console.log({
        bestmove: bestmove,
        CacheHits: CacheHits,
        CacheCutoffs: CacheCutoffs,
        CachePuts: CachePuts,
        StateCacheHits: StateCacheHits,
        StateCachePuts: StateCachePuts,
        fc: fc,
        time: (t1 - t0) / 1000
    })
}
search(1, 60000);