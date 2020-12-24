function InGamePosition(setting, level){
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = []
}

InGamePosition.prototype.update = function(play){

    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds

    if(play.pressedKeys[37]){
        spaceship.x -= spaceshipSpeed * upSec;
    }
    if(play.pressedKeys[39]){
        spaceship.x += spaceshipSpeed * upSec;
    }
    //if user fires: so hits the SPACE
    if(play.pressedKeys[32]){
        this.shoot();
    }

    if(spaceship.x < play.playBoundaries.left){
        spaceship.x = play.playBoundaries.left;
    }
    if(spaceship.x > play.playBoundaries.right){
        spaceship.x = play.playBoundaries.right;
    }
}
InGamePosition.prototype.shoot = function(){
    this.object = new Objects();
    this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height / 2, this.setting.bulletSpeed));
}

InGamePosition.prototype.entry = function(play){
    this.upSec = this.setting.updateSeconds;
    this.spaceshipSpeed = this.setting.spaceshipSpeed;
    this.spaceship_image = new Image();
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image)
}

InGamePosition.prototype.keyDown = function(play, keyboardCode){

}

InGamePosition.prototype.draw = function(play){
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width/2), this.spaceship.y - (this.spaceship.height/2))

    //draw Bullets
    ctx.fillStyle = '#ff0000';
    for(let i=0; i < this.bullets.length; i++){
        let bullet = this.bullets[i];
        ctx.fillRect(bullet.x-1, bullet.y-6, 2,6);
    }
}