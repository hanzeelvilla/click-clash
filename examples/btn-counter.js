const { Board, Button} = require("johnny-five");
const board = new Board();

board.on("ready", () => {
    let count = 0;

    const button = new Button(2);

    console.log(`Count: ${count}`);
    console.log("Press the button to increment the counter.");

    button.on("press", () => {
        count += 1;
        console.log(`Button pressed ${count} times`);
    });
});