const canvas = document.getElementById('ufoCanvas');
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

function resize() {
    const height = window.innerHeight - 20;

    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

window.addEventListener('load', resize, false);

function GameBasics(canvas) {

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    //active playing fields
    this.playBoundaries = {
        top: 150,
        bottom: 650,
        left: 100,
        right: 800
    }

    //initial values
    this.level = 1;
    this.score = 0;
    this.shields = 2;

    this.setting = {
        //FPS: 60 frame per 1 second, this mean 1 new frame in every 0.01666667 seconds
        updateSeconds: (1 / 60),
        spaceshipSpeed: 400,
    }

    //we collect here the different positions, states of the game
    this.positionContainer = [];

    // pressed keys storing
    this.pressedKeys = {};
}

GameBasics.prototype.presentPositions = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null
}
//Move to desired position
GameBasics.prototype.goToPosition = function (position) {
    //If we are already in a position clear the positionContainer
    if (this.presentPositions()) {
        this.positionContainer.length = 0;
    }
    //If we finds an entry in a given position, we call it.
    if (position.entry) {
        position.entry(play);
    }
    //Setting the current game position in the positionContainer
    this.positionContainer.push(position);
}
//push our new positions into the positionContainer
GameBasics.prototype.pushPosition = function (position) {
    this.positionContainer.push(position);
};
//pop the position from the positionContainer
GameBasics.prototype.popPosition = function () {
    this.positionContainer.pop();
}
GameBasics.prototype.start = function () {
    setInterval(function () { gameLoop(play); }, this.setting.updateSeconds * 1000); //0.01666667 sec * 1000 = 16.67 ms
    //Go into the opening position
    this.goToPosition(new OpeningPosition())
}

// Notifies the game when a key is pressed
GameBasics.prototype.keyDown = function (keyboardCode){
    // store the pressed key in 'pressedKeys'
    this.pressedKeys[keyboardCode] = true;
    console.log('keydownfunc');
    //it calls the present position's keyDown function
    if(this.presentPositions() && this.presentPositions().keyDown){
        this.presentPositions().keyDown(this, keyboardCode);
    }
}

// Notifies the game when a key is released
GameBasics.prototype.keyUp = function (keyboardCode){
    // delete the released key from 'pressedKeys'
    delete this.pressedKeys[keyboardCode];
}

function gameLoop(play) {
    let presentPosition = play.presentPositions();
    if (presentPosition) {
        //update
        if (presentPosition.update) {
            presentPosition.update(play);
        }
        //draw
        if (presentPosition.draw) {
            presentPosition.draw(play);
        }
    }
}

//keyboard events listening
window.addEventListener("keydown", function (e){
    const keyboardCode = e.which || event.keyCode;
    console.log('keydown');
    if(keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32){
        e.preventDefault();
    }
    play.keyDown(keyboardCode);
});
window.addEventListener("keyup", function (e){
    const keyboardCode = e.which || event.keyCode;
    play.keyUp(keyboardCode);
});
const play = new GameBasics(canvas);
play.start();