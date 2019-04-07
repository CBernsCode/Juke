import p5 from 'p5';
let x;
let Bx;
let By;
let y;
let bullet;
let pLocation;
let canvas;

export default function sketch(p) {
  let rotation = 0;

  p.setup = function () {
    p.createCanvas(600, 400, p.WEBGL);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  p.draw = function () {
    p.background(100);
    p.noStroke();
    p.push();
    p.rotateY(rotation);
    p.box(100);
    p.pop();
  };
};


// //file for handling the survival game
// export default function sketch(p) {

//   p.setup = () => {
//     canvas = p.createCanvas(720, 400);
//     p.stroke(255);
//     x = p.width/2;
//     y = p.height/2;
//     p.spawnBullet();
//     pLocation = p.circle(x,y,10);
//   };

// p.draw = () =>  {
//     p.background(51);
//     p.updateBullet();
//   }
// p.keyPressed = () =>  {
//   if (p.keyCode === p.UP_ARROW) {
//     y -= 10;
//   } 
//   else if (p.keyCode === p.DOWN_ARROW) {
//     y += 10;
//   }
//   else if (p.keyCode === p.LEFT_ARROW) {
//     x -= 10;
//   }
//   else if (p.keyCode === p.RIGHT_ARROW) {
//     x += 10;
//   }
// }
// p.spawnBullet = () => {
//     Bx = 0;
//     By = Math.floor(Math.random()* p.height);
//     bullet = p.circle(Bx,By,10);
// }
// p.updateBullet = () =>  {
//     if(By < (p.width/2+1)) {
//         bullet = p.circle(Bx++,By,10);
//     }
//     if(Bx == p.width) {
//       p.spawnBullet();
//     }
// }
// }