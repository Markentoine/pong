class Game {

    constructor(canvas, colors, playersTypes, scores) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.colors = colors;
        this.keys = {
            player1: {
                up: 81,
                down: 87
            },
            player2: {
                up: 77,
                down: 58
            }
        };
        this.player1 = playersTypes[0].player1;
        this.player2 = playersTypes[1].player2;
        this.scores = scores;
        this.PFS = 60;
        this.moves = {
            paddle1: 'stop',
            paddle2: 'stop',
        }
    }

    initiate(canvas) {
        this.catchHumanPlayersMoves(canvas);
        this.catchBallThrow(canvas);
        canvas.setAttribute('tabIndex', '1'); // give focus to the canvas to allow capturing of keystrokes
        canvas.focus();
        this.ratio = this.getWinRatio();
        this.player1 = new Player('player1', this.player1);
        this.player2 = new Player('player2', this.player2);
        this.board = new Board(this.context, this.colors, this.ratio, this.player1, this.player2);
        this.score = new Score();
        this.board.create();
    }

    run(canvas) {
        const interval = 1000 / this.FPS;
        this.initiate(canvas);
        this.display = setInterval(() => {
            this.winner = this.board.refresh(this.moves);
            if (this.winner === 'player1' || this.winner === 'player2') {
                this.score.update(this.winner);
                this.updateScores();
                this.board = new Board(this.context, this.colors, this.ratio, this.player1, this.player2);
                this.board.create();
            };
        }, interval);
    }

    updateScores() {
        this.scores[0].textContent = this.score.score1;
        this.scores[1].textContent = this.score.score2;
    }

    getWinRatio() {
        return window.innerWidth / window.innerHeight;
    }

    catchBallThrow(canvas) {
        canvas.addEventListener('keyup', e => {
            if (e.keyCode === 32) {
                this.board.ballStarter++;
            }
        });
    }

    catchHumanPlayersMoves(canvas) {
        canvas.addEventListener('keydown', e => {
            e.stopPropagation();
            const keyCode = e.keyCode;
            if (keyCode === 81 && this.player1.type === 'human') {
                this.moves.paddle1 = 'up';
            } else if (keyCode === 87 && this.player1.type === 'human') {
                this.moves.paddle1 = 'down';
            } else if (keyCode === 77 && this.player2.type === 'human') {
                this.moves.paddle2 = 'up';
            } else if (keyCode === 58 && this.player2.type === 'human') {
                this.moves.paddle2 = 'down'
            }
        });
        canvas.addEventListener('keyup', e => {
            e.stopPropagation();
            const keyCode = e.keyCode;
            if (keyCode === 81) {
                this.moves.paddle1 = 'stop';
            } else if (keyCode === 87) {
                this.moves.paddle1 = 'stop';
            } else if (keyCode === 77) {
                this.moves.paddle2 = 'stop';
            } else if (keyCode === 58) {
                this.moves.paddle2 = 'stop'
            }
        });
    }

    clear(canvas, child, scores) {
        clearInterval(this.display);
        canvas.remove();
        const newCanvas = document.createElement('canvas');
        newCanvas.width = 300;
        newCanvas.height = 300;
        newCanvas.id = 'board';
        child.after(newCanvas);
        this.score.clear(scores);
    }
}