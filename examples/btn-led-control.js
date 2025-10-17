const { Board, Led , Button} = require("johnny-five");
const board = new Board();

board.on("ready", () => {
    const led = new Led(3);
    const btn = new Button(2);

    btn.on("down", () => {
        console.log("Button Pressed");
        led.on();
    });

    btn.on("up", () => {
        console.log("Button Released");
        led.off();
    });
});