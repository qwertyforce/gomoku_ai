# gomoku_ai
https://qwertyforce.dev/gomoku_ai.pdf [RU]<br>
https://habr.com/ru/post/541564/ [RU]<br>
Experiments with variations of minimax algorithm, MTD(f), MCTS in Gomoku  <br>
mtdf(10) - dangerous pruning, can lead to unexpected loss <br>
Main ai agent is in mtdf(10)_worker.js. You can play against ai here https://gomoku.qwertyforce.dev/game_offline

You can see this error while opening html files in Chrome <br>
![Alt text](./screenshots/1.JPG) <br>
Chrome doesn't let you load web workers from a local file.
https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker
https://stackoverflow.com/questions/17679399/does-disable-web-security-work-in-chrome-anymore/36939693 <br>
c++ version - https://github.com/qwertyforce/gomoku_ai_c
