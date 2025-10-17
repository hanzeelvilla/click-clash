const { Board, Led , Button} = require("johnny-five");
const board = new Board();

board.on("ready", () => {
    console.log("Board is ready!");
});