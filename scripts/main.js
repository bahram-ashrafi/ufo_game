const canvas = document.getElementById('ufoCanvas');
canvas.width = 900;
canvas.height = 750;

function resize(){
    const height = window.innerHeight - 20;

    const ratio = canvas.width/canvas.height;
    const width = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}
window.addEventListener('load', resize, false);

function GameBasics(canvas){

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

    this.setting = {
        //game setting
    }

    //we collect here the different positions, states of the game
    this.positionContainer = []
}

GameBasics.prototype.presentPositions = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null
}
//Move to desired position
GameBasics.prototype.goToPosition = function(){
    //If we are already in a position clear the positionContainer
    if(this.presentPositions()){
        this.positionContainer.length = 0;
    }
    //If we finds an entry in a given position, we call it.
    if(position.entry){
        position.entry(play);
    }
    //Setting the current game position in the positionContainer
    this.positionContainer.push(position);
}
//push our new positions into the positionContainer
GameBasics.prototype.pushPosition = function(position){
    this.positionContainer.push(position);
};
//pop the position from the positionContainer
GameBasics.prototype.popPosition = function(){
    this.positionContainer.pop();
}

