<<<<<<< HEAD
import p5 from 'p5';
let x;
let Bx;
let By;
let y;
let bullet;
let pLocation;
let canvas;
let play;
let Score = 0;
export default function sketch(p) {
  window.p = p
  let rotation = 0;
  let arr = []
  for(let i = 0 ; i < 500; i += 50 ){
    arr.push(new Bullet(i,100,6), new Bullet(i,200,6))
  }
  play = new Player(400,250)
  p.setup = function () {
    p.createCanvas(600, 400,);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  let xPos = 10
  p.draw = function () {
    p.background(100);
    p.noStroke();
    arr.forEach(it => it.draw(p))
    play.draw(p)
    p.text(Score,250,50)
  };
  p.keyPressed = function() {
    if(p.keyCode === p.LEFT_ARROW){
      play.x -= 5
    }
    else if(p.keyCode === p.RIGHT_ARROW){
      play.x += 5
    }
    else if(p.keyCode === p.UP_ARROW){
      play.y -= 5
    }
    else if(p.keyCode === p.DOWN_ARROW){
      play.y +=5
    }
  }
};
class Bullet {

  constructor(x,y,speed = 2){
    this.x = x
    this.y = y
    this.speed = speed
  }
  draw = (p) => {
    p.fill('#000000')
    this.x = this.x + this.speed
    if(this.x > p.width){
      this.x = 0
      this.y = Math.random()*400
      Score++
    }
    p.rect(this.x, this.y, 10,4);
    if(collideRectRect(this.x,this.y,10,4,play.x,play.y,10,10)){
      Score -= 10
      this.x = 0
      this.y = Math.random()*400
    }
  }
};
class Player {
  constructor(x,y){
    this.x = x
    this.y = y
  }

  draw = (p) => {
    p.fill('#ffffff')
    p.rect(this.x, this.y, 10,10)
  }
};
//all code from this point is not my own work. it is from the collide2D library for p5 located here https://github.com/bmoren/p5.collide2D.
//There is no npm module for collison2D so I took the one function I needed
function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
  //2d
  //add in a thing to detect rectMode CENTER
  if (x + w >= x2 &&    // r1 right edge past r2 left
      x <= x2 + w2 &&    // r1 left edge past r2 right
      y + h >= y2 &&    // r1 top edge past r2 bottom
      y <= y2 + h2) {    // r1 bottom edge past r2 top
        return true;
  }
  return false;
};

