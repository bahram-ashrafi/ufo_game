function Sounds(){

}

Sounds.prototype.init = function(){
    this.sound = new Audio();
    this.sound.src = "sounds/shoot.wav";
    this.sound.setAttribute("preload","auto");
};

Sounds.prototype.playSound = function(soundName){
    if(soundName == 'shoot'){
        this.sound.play();
    }
}
Sounds.prototype.mute = function(){

}