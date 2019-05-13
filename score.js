class Score {
    constructor() {
        this.score1 = 0;
        this.score2 = 0;
    }
    clear(scores) {
        scores.forEach(score => score.textContent = '0');
    }

    update(winner) {
        if (winner === 'player1') {
            this.score1++
        } else if (winner === 'player2') {
            this.score2++;
        }
    }
}