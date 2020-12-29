function Objects(){

}
Objects.prototype.spaceship = function(x,y,spaceship_image){
    this.x = x;
    this.y = y;
    this.width = 63;
    this.height = 76;
    this.spaceship_image = spaceship_image;
    this.spaceship_image.src = "images/ship.png";
    return this;
}
Objects.prototype.bullet = function(x,y){
    this.x = x;
    this.y = y;
    return this;
}
Objects.prototype.ufo = function (x,y,line,column,ufo_image){
    this.x = x;
    this.y = y;
    this.line = line;//row
    this.column = column;
    this.width = 69;
    this.height = 46;
    this.ufo_image = ufo_image;
    this.ufo_image.src = "images/ufo.png"
    return this;
}
Objects.prototype.bomb = function(x,y){
    this.x = x;
    this.y = y;
    return this;
}