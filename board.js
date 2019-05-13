class Board {

    constructor(context, colors, ratio, player1, player2) {
        this.context = context;
        this.ratio = ratio;
        this.player1 = player1;
        this.player2 = player2;
        this.width = 300;
        this.height = 300;
        this.xMin = 0;
        this.yMin = 0;
        this.xMaxBall = this.width - 2;
        this.yMaxPaddle = this.height - 75;
        this.yMaxBall = this.height - (2 * this.ratio);
        this.middle = this.width / 2;
        this.colors = colors;
        this.coordPaddle1 = [5, this.height / 2 - 75 / 2];
        this.coordPaddle2 = [this.width - 10, this.height / 2 - 75 / 2];
        this.coordBall = [this.middle - 5, this.middle - 2];
        this.ballStarter = 0;
        this.xBallVelocity = .5;
        this.yBallVelocity = this.xBallVelocity * this.ratio;
    }

    initiate() {
        this.paddle1 = new Paddle(this.context, this.colors[0]);
        this.paddle2 = new Paddle(this.context, this.colors[1]);
        this.ball = new Ball(this.context);
    }

    create() {
        this.initiate();
        this.paddle1.setPosition(...this.coordPaddle1);
        this.paddle2.setPosition(...this.coordPaddle2);
        this.ball.setPosition(this.ratio, ...this.coordBall);
    }

    controlCoordPaddle() {
        if (this.p1Move === 'up' && this.coordPaddle1[1] < this.yMin) {
            this.p1Move = 'stop';
        } else if (this.p1Move === 'down' && this.coordPaddle1[1] > this.yMaxPaddle) {
            this.p1Move = 'stop';
        }
        if (this.p2Move === 'up' && this.coordPaddle2[1] < this.yMin) {
            this.p2Move = 'stop';
        } else if (this.p2Move === 'down' && this.coordPaddle2[1] > this.yMaxPaddle) {
            this.p2Move = 'stop';
        }
    }

    controlBallCollisions() {
        this.wallCollision();
        this.paddleCollision();
        return this.goalCollision();
    }

    wallCollision() {
        const y = this.coordBall[1];
        if (y <= this.yMin || y >= this.yMaxBall) this.ball.dirY *= -1;
    }

    paddleCollision() {
        const [x, y] = this.coordBall;
        const [xPad1, yPad1] = this.coordPaddle1;
        const [xPad2, yPad2] = this.coordPaddle2;
        if (x <= xPad1 + 5 && y >= yPad1 && y <= yPad1 + 75) {
            this.applyPhysicsForces('p1');
        };
        if (x >= xPad2 && y >= yPad2 && y <= yPad2 + 75) {
            this.applyPhysicsForces('p2');
        }
    }

    goalCollision() {
        const x = this.coordBall[0];
        if (x < this.xMin) {
            return 'player2'
        } else if (x >= this.xMaxBall) {
            return 'player1'
        }
        return false;
    }

    applyPhysicsForces(paddle) {
        this.ball.dirX *= -(1.1);
        if (this[`${paddle}Move`] === 'up') {
            this.yBallVelocity = 0.3 * this.ratio;
        } else if (this[`${paddle}Move`] === 'down') {
            this.yBallVelocity = 0.7 * this.ratio;
        } else {
            this.yBallVelocity = 0.5 * this.ratio;
        }
    }

    defineDirBall() {
        this.ball.dirX = this.randomDir();
        this.ball.dirY = this.randomDir();
    }

    randomDir() {
        return Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    }

    moveBall(ratio) {
        const win = this.controlBallCollisions();
        if (win) return win;
        this.coordBall[0] += this.xBallVelocity * this.ball.dirX;
        this.coordBall[1] += this.yBallVelocity * this.ball.dirY;
        this.ball.setPosition(ratio, ...this.coordBall);
        return true;
    }

    defineNewCoord(moves) {
        this.p1Move = moves.paddle1;
        this.p2Move = moves.paddle2;
        this.controlCoordPaddle();
        if (this.p1Move === 'up') {
            this.coordPaddle1[1] -= this.paddle1.velocity;
        } else if (this.p1Move === 'down') {
            this.coordPaddle1[1] += this.paddle1.velocity;
        }
        if (this.p2Move === 'up') {
            this.coordPaddle2[1] -= this.paddle2.velocity;
        } else if (this.p2Move === 'down') {
            this.coordPaddle2[1] += this.paddle2.velocity;
        }
    }

    refresh(moves) {
        this.defineNewCoord(moves);
        this.context.clearRect(0, 0, this.width, this.height);
        if (this.player1.type === 'bot' || this.player2.type === 'bot') this.automaticPaddle();
        this.paddle1.setPosition(...this.coordPaddle1);
        this.paddle2.setPosition(...this.coordPaddle2);
        if (this.ballStarter === 1) {
            this.ballStarter++;
            this.defineDirBall();
            this.moveBall(this.ratio);
        } else if (this.ballStarter === 0) {
            this.ball.setPosition(this.ratio, ...this.coordBall);
        } else {
            const win = this.moveBall(this.ratio);
            if (win === 'player1' || win === 'player2') return win;
        }
        return true;
    }

    automaticPaddle() {
        const REACTION_LIMIT = 150;
        const velocity = Math.floor(Math.random() * 2 + 1);
        const automaticReaction = paddleCoord => {
            if (this.coordBall[1] > paddleCoord[1] + 37 && paddleCoord[1] < this.yMaxPaddle - 2) {
                paddleCoord[1] += velocity;
            } else if (this.coordBall[1] < paddleCoord[1] + 37 && paddleCoord[1] > this.yMin + 2) {
                paddleCoord[1] -= velocity;
            }
        };
        if (this.player1.type === 'bot' && this.coordBall[0] < REACTION_LIMIT) automaticReaction(this.coordPaddle1);
        if (this.player2.type === 'bot' && this.coordBall[0] > REACTION_LIMIT) automaticReaction(this.coordPaddle2);
    }
}