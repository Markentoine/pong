class Ball {

    constructor(context) {
        this.context = context;
    }

    setPosition(ratio, xCoord, yCoord) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.ellipse(xCoord, yCoord, 2, 2 * ratio, Math.PI / 180, 0, 2 * Math.PI);
        this.context.fill();
    }
}