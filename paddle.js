class Paddle {
    constructor(context, color) {
        this.context = context;
        this.color = color;
        this.contextHeight = 300;
        this.width = 5;
        this.length = 75;
        this.velocity = 2;
    }

    setPosition(xCoord, yCoord) {
        this.context.fillStyle = this.color;
        this.context.fillRect(xCoord, yCoord, this.width, this.length);
    }
}