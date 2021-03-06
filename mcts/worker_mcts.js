var GameBoard;
var Rows = 15;
var Columns = 15;

function childUCB1(parent, child) {
    let w = child.hits;
    let n = child.totalTrials;
    let c = Math.sqrt(2);
    let t = parent.totalTrials;
    if (n === 0) {
        return Infinity
    }
    return w / n + c * Math.sqrt(Math.log(t) / n);
}

var Table = []
var Cache = {};

function random32() {
    let o = new Uint32Array(1);
    self.crypto.getRandomValues(o);
    return o[0];
}

function Hashtable_init() {
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

function shuffle(a) {
    let temp = null;
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a
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

function get_directions(Board, x, y) {
    let Directions = [
        [],
        [],
        [],
        []
    ];
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

function check_directions(arr) {
    for (var i = 0; i < arr.length - 4; i++) {
        if (arr[i] !== 0) {
            if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2] && arr[i] === arr[i + 3] && arr[i] === arr[i + 4]) {
                return true
            }
        }

    }
}

function simpleCopy(board) {
    let simpleCopy = new Array(board.length);
    for (let i = 0; i < board.length; i++) {
        simpleCopy[i] = new Array(board[i].length);
        for (let a = 0; a < board[i].length; a++) {
            simpleCopy[i][a] = board[i][a];
        }
    }
    return simpleCopy;
}

function simpleCopy1D(board) {
    let simpleCopy = new Array(board.length);
    for (let i = 0; i < board.length; i++) {
        simpleCopy[i] = board[i];
    }
    return simpleCopy;
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

function getPossibleMoves(state) {
    let possibleMoves = [];
    let min_r = state.restrictions[0];
    let min_c = state.restrictions[1];
    let max_r = state.restrictions[2];
    let max_c = state.restrictions[3];
    for (let i = min_r - 2; i <= max_r + 2; i++) {
        for (let a = min_c - 2; a <= max_c + 2; a++) {
            if (state.board[i][a] === 0 && !remoteCell(state.board, i, a)) {
                possibleMoves.push([i, a])
            }
        }

    }

    return possibleMoves;
}


function game_over(state) {
    if (state.freespaceleft === 0) {
        return true
    }
    if (checkwin(state.board, state.lastMove[0], state.lastMove[1])) {
        return true
    }
    return false;
}

function play_move(Board, move, turn) {
    // if(move===undefined){
    //   debugger;
    // }
    Board[move[0]][move[1]] = turn;
}

function simulate(state) {

    let tempState = {
        board: simpleCopy(state.board),
        turn: state.turn,
        lastMove: simpleCopy1D(state.lastMove),
        freespaceleft: state.freespaceleft,
        restrictions: simpleCopy1D(state.restrictions)
    }
    let turn = state.turn
    let possibleMoves;
    let random_move;

    while (!game_over(tempState)) {
        possibleMoves = getPossibleMoves(tempState);
        random_move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        play_move(tempState.board, random_move, -tempState.turn);
        tempState.restrictions = Change_restrictions(tempState.restrictions, random_move[0], random_move[1])

        tempState.turn = -tempState.turn;
        tempState.freespaceleft--;
    }

    if (tempState.freespaceleft === 0) {
        return 0
    } else if (tempState.turn === turn) {
        return 1
    } else {
        return -1
    }
}

function select_best_node(root) {
    var node = root;
    while (node.possible_moves_left !== null && node.possible_moves_left.length === 0) {
        node = get_node_best_ucb1(node)
    }
    return node;
}

function get_node_best_ucb1(node) {
    let bestChild = [node.children[0]];
    let bestUCB1 = childUCB1(node, node.children[0])
    let UCB1;
    for (let i = 1; i < node.children.length; i++) {
        UCB1 = childUCB1(node, node.children[i]);
        if (UCB1 === bestUCB1) {
            bestChild.push(node.children[i])
        }
        if (UCB1 > bestUCB1) {
            bestUCB1 = UCB1;
            bestChild = [node.children[i]];
        }
    }
    return bestChild[Math.floor(Math.random() * bestChild.length)]
}

function expand(node) {
    let tempBoard = simpleCopy(node.State.board);
    let turn = node.State.turn;
    let Move = node.possible_moves_left.pop();
    play_move(tempBoard, Move, -turn);
    var child = new MctsNode(new State(tempBoard, -1 * turn, Move, node.State.freespaceleft - 1, Change_restrictions(node.State.restrictions, Move[0], Move[1])), node);
    node.children.push(child);
}

class MctsNode {
    constructor(State, parent) {
        this.State = State;
        this.parent = parent;


        this.hits = 0;
        this.totalTrials = 0;
        this.children = [];
        this.possible_moves_left = null;
    }

    search(timeout) {
        let end = Date.now() + timeout * 1000
        var node = this;
        var temp;

        while (Date.now() < end) {
            let best_node = select_best_node(this);
            var node_status = game_over(best_node.State);
            if (node_status === false) {
                if (best_node.possible_moves_left === null) {
                    best_node.possible_moves_left = shuffle(getPossibleMoves(best_node.State));
                }
                expand(best_node);
            }
            if (best_node.possible_moves_left !== null && best_node.possible_moves_left.length !== 0) {
                best_node.children[best_node.children.length - 1].runSimulation();
            } else {
                best_node.runSimulation()
            }
        }
        let score = -Infinity;
        let best_child;
        for (let child of this.children) {
            if (child.totalTrials > score) {
                score = child.totalTrials;
                best_child = child;
            }
        }
        return best_child

    }
    runSimulation() {
        this.backPropagate(simulate(this.State));
    }

    backPropagate(simulation) {
        if (simulation > 0) {
            this.hits++;
        }
        this.totalTrials++;


        if (this.parent) {
            this.parent.backPropagate(-simulation);
        }

    }
}


class State {
    constructor(board, turn, lastMove = null, freespaceleft, restrictions) {
        this.board = board;
        this.turn = turn;
        this.lastMove = lastMove;
        this.freespaceleft = freespaceleft;
        this.restrictions = restrictions;

    }
}

function calc_free_space() {
    var free = 0;
    for (let i = 0; i < GameBoard.length; i++) {
        for (let a = 0; a < GameBoard[i].length; a++) {
            if (GameBoard[i][a] === 0) {
                free++;
            }
        }
    }
    return free;
}

Hashtable_init();


function search(player,Time) {
   var MCTS= new MctsNode(new State(GameBoard, -1 * player, [7, 7], calc_free_space(), Get_restrictions(GameBoard)), null);
   var bestmove=MCTS.search(Time);
    Cache = {}
    // StateCache = {}
    return ({
        bestmove: bestmove
    })
}
onmessage = function(e) {
    var Board = e.data[0]
    var Turn = e.data[1]
    var MaximumTimeForMove = e.data[2]
    console.log(e.data)
    if (Board) {
        GameBoard = Board;
        Rows = GameBoard.length;
        Columns = GameBoard[0].length
        var sum = 0;
        for (var x = 0; x < Rows; x++) {
            for (var y = 0; y < Columns; y++) {
                if (GameBoard[x][y] !== 0) {
                    sum++
                }
            }
        }
        if (sum === 0) {
            postMessage({
                bestmove: {
                    i: 10,
                    j: 10,
                    score: 31337
                },
            })
            return
        }
        var results = search(Turn,MaximumTimeForMove);
        postMessage(results)
    }
}