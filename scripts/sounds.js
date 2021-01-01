function Sounds() {
    this.muted = false;
}

Sounds.prototype.init = function () {

    this.soundsSource = ["sounds/shoot.wav", "sounds/death.wav", "sounds/explosion.mp3"];
    this.allSounds = [];

    for (let i = 0; i < this.soundsSource.length; i++) {
        this.allSounds[i] = new Audio();
        this.allSounds[i].src = this.soundsSource[i];
        this.allSounds[i].setAttribute("preload", "auto");
    }
};

Sounds.prototype.playSound = function (soundName) {
    if (this.muted == true) {
        return;
    }
    let soundNumber;
    switch (soundName) {
        case 'shoot':
            soundNumber = 0;
            break;
        case 'death':
            soundNumber = 1;
            break;
        case 'explosion':
            soundNumber = 2;
            break;
    }

    this.allSounds[soundNumber].play();
    this.allSounds[soundNumber].currentTime = 0;
}
Sounds.prototype.mute = function () {
    if (this.muted == false) {
        this.muted = true;
    } else if (this.muted == true) {
        this.muted = false;
    }
}