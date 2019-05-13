class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.score = 0;
    }

    updateScore() {
        this.score++;
    }
}