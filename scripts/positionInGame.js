function InGamePosition(setting, level) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = [];
    this.lastBulletTime = null;
    this.ufos = [];
    this.bombs = [];
}

InGamePosition.prototype.update = function (play) {

    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets

    if (play.pressedKeys[37]) {
        spaceship.x -= spaceshipSpeed * upSec;
    }
    if (play.pressedKeys[39]) {
        spaceship.x += spaceshipSpeed * upSec;
    }
    //if user fires: so hits the SPACE
    if (play.pressedKeys[32]) {
        this.shoot();
    }

    if (spaceship.x < play.playBoundaries.left) {
        spaceship.x = play.playBoundaries.left;
    }
    if (spaceship.x > play.playBoundaries.right) {
        spaceship.x = play.playBoundaries.right;
    }

    //Moving bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= upSec * this.setting.bulletSpeed;
        //If our bullet flies out from the canvas, it w be cleared
        if (bullet.y < 0) {
            bullets.splice(i--, 1);
        }
    }

    //Movement of UFOS
    let reachSide = false;

    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        let fresh_x = ufo.x + this.ufoSpeed * upSec * this.turnAround * this.horizontalMoving;
        let fresh_y = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;

        if (fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left) {
            this.turnAround *= -1;
            reachSide = true;
            this.horizontalMoving = 0;
            this.verticalMoving = 1;
            this.ufoAreSinking = true;
        }

        if (reachSide !== true) {
            ufo.x = fresh_x;
            ufo.y = fresh_y;
        }
    }
    if (this.ufoAreSinking == true) {
        this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
        if (this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue) {
            this.ufoAreSinking = false;
            this.verticalMoving = 0;
            this.horizontalMoving = 1;
            this.ufoPresentSinkingValue = 0;
        }
    }

    //UFOS bombing
    //Sorting UFOS - which are at the bottom of each column
    const frontLineUFOs = [];
    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        if (!frontLineUFOs[ufo.column] || frontLineUFOs[ufo.column].line < ufo.line) {
            frontLineUFOs[ufo.column] = ufo;
        }
    }

    // Give a chance for bombing
    for (let i = 0; i < this.setting.ufoColumns; i++) {
        let ufo = frontLineUFOs[i];
        if (!ufo) continue;
        let chance = this.bombFrequency * upSec;
        this.object = new Objects();
        if (chance > Math.random()) {
            //make a bomb object and put it into bombs array
            this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height / 2));

        }
    }

    //Moving bombs
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        bomb.y += upSec * this.bombSpeed;
        //If a bomb falls out of the canvas it will be deleted
        if (bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    //UFO-bullet collision
    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        let collision = false;
        for (let j = 0; j < bullets.length; j++) {
            let bullet = bullets[j];
            //collision check
            if (bullet.x >= (ufo.x - ufo.width / 2) && bullet.x <= (ufo.x + ufo.width / 2) &&
                bullet.y >= (ufo.y - ufo.height / 2) && bullet.y <= (ufo.y + ufo.height / 2)) {
                //if there is collision we delete the bullet and set collision true
                bullets.splice(j--, 1);
                collision = true;
                play.score += this.setting.pointsPerUFO;
            }
        }
        //if there is collision we delete the UFO
        if (collision == true) {
            this.ufos.splice(i--, 1);
            play.sounds.playSound('death')
        }
    }

    //Spaceship-bomb collision
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        if (bomb.x + 2 >= (spaceship.x - spaceship.width / 2) &&
            (bomb.x - 2 <= (spaceship.x + spaceship.width / 2)) &&
            bomb.y + 6 >= (spaceship.y - spaceship.height / 2) &&
            bomb.y <= (spaceship.y - spaceship.height / 2)) {
            // effect on the spaceship
            play.sounds.playSound('explosion');
            //if there is a collision we delete the bomb
            this.bombs.splice(i--, 1);
            // play.goToPosition(new OpeningPosition());
            play.shields--;
        }
    }

    //Spaceship-UFO collision
    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        if ((ufo.x + ufo.width / 2) > (spaceship.x - spaceship.width / 2) &&
            (ufo.x - ufo.width / 2) < (spaceship.x + spaceship.width / 2) &&
            (ufo.y + ufo.height / 2) > (spaceship.y - spaceship.height / 2) &&
            (ufo.y - ufo.height / 2) < (spaceship.y + spaceship.height / 2)) {
            // if there is collision
            play.sounds.playSound('explosion');
            // play.goToPosition(new OpeningPosition());
            play.shields = -1;
        }
    }

    if(play.shields<0){
        play.goToPosition(new OpeningPosition())
    }

    //Level completed
    if(this.ufos.length == 0){
        play.level +=1;
        play.goToPosition(new TransferPosition(play.level));
    }

}

InGamePosition.prototype.shoot = function () {

    if (this.lastBulletTime === null || ((new Date()).getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency)) {
        this.object = new Objects();
        this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height / 2, this.setting.bulletSpeed));
        this.lastBulletTime = (new Date()).getTime();
        play.sounds.playSound('shoot');
    }
}

InGamePosition.prototype.entry = function (play) {
    this.horizontalMoving = 1;
    this.verticalMoving = 0;
    this.ufoAreSinking = false;
    this.ufoPresentSinkingValue = 0;
    this.turnAround = 1;
    this.upSec = this.setting.updateSeconds;
    this.spaceshipSpeed = this.setting.spaceshipSpeed;
    this.ufo_image = new Image();
    this.spaceship_image = new Image();
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image);

    // values that change with levels(1.UFO speed 2.Bomb falling speed, 3.Bomb dropping frequency
    let presentLevel = this.level;
    this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7);
    // 2. Bomb falling speed
    this.bombSpeed = this.setting.bombSpeed + (presentLevel * 10);
    // 3. Bomb dropping frequency
    this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.05);

    //Creating UFOS
    const lines = this.setting.ufoLines;
    const columns = this.setting.ufoColumns;
    const ufosInitial = [];

    let line, column;

    for (line = 0; line < lines; line++) {
        for (column = 0; column < columns; column++) {
            this.object = new Objects();
            let x, y;
            x = (play.width / 2) + (column * 80) - ((columns - 1) * 40);
            y = (play.playBoundaries.top + 50) + (line * 50);
            ufosInitial.push(this.object.ufo(
                x,
                y,
                line,
                column,
                this.ufo_image
            ));
        }
    }
    this.ufos = ufosInitial;
    this.temp = 0;
}

InGamePosition.prototype.keyDown = function (play, keyboardCode) {
    if (keyboardCode == 83) {
        play.sounds.mute();
    }
    if (keyboardCode == 80) {
        play.pushPosition(new PausePosition());
    }
}

InGamePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width / 2), this.spaceship.y - (this.spaceship.height / 2))

    //draw Bullets
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        ctx.fillRect(bullet.x - 1, bullet.y - 6, 2, 6);
    }

    // draw UFOS
    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        ctx.drawImage(this.ufo_image, ufo.x - (ufo.width / 2), ufo.y - (ufo.height / 2))
    }

    //draw bombs
    ctx.fillStyle = "#FE2EF7";
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y, 4, 6);
    }

    // draw Sound & Mute info
    ctx.font = "16px Comic Sans MS";

    ctx.fillStyle = "#424242";
    ctx.textAlign = "left";
    ctx.fillText("Press S to switch sound effect ON/OFF. Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 70);

    let soundStatus = (play.sounds.muted === true) ? "OFF" : "ON";
    ctx.fillStyle = (play.sounds.muted === true) ? '#FF0000' : '#0B6121';
    ctx.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);

    ctx.fillStyle = "#424242";
    ctx.textAlign = "right";
    ctx.fillText("Press P to Pause.", play.playBoundaries.right, play.playBoundaries.bottom + 70);

    //show the score and level to the user
    ctx.textAlign = "center";
    ctx.fillStyle = "#BDBDBD";

    ctx.font = "bold 24px Comic Sans MS";
    ctx.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 25);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top);

    ctx.font = "bold 24px Comic Sans MS";
    ctx.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 25);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top);

    //draw Shields
    ctx.textAlign = "center";
    if(play.shields > 0){
        ctx.fillStyle = '#BDBDBD';
        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillText("Shields", play.width/2, play.playBoundaries.top - 25);
        ctx.font = "bold 30px Comic Sans MS";
        ctx.fillText(play.shields, play.width/2, play.playBoundaries.top);
    } else{
        ctx.fillStyle = '#ff4d4d';
        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillText("Warning", play.width/2, play.playBoundaries.top - 25);
        ctx.fillStyle = '#BDBDBD';
        ctx.fillText('No shields left!', play.width/2, play.playBoundaries.top);
    }
}