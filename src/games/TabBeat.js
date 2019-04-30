export const TapBeat = () => {
  // Score count being aggregated
  let score = 0;
  // Game time in milliseconds
  let totalGameTime = 60000;
  // Count for time that has elapsed in the game
  let timeElapsed = 0;
  // Number being shown on the button
  let buttonNum = 0;

  let game = document.getElementById("game");

  window.kill = () => {
    let oldScore = score
    score = 0
    //console.log(oldScore)
    return oldScore
  }

  // Create a score counter on the top right to increment when the button is hit
  let scoreCount = document.createElement("p");
  let scoreMessage = document.createTextNode("Score :  " + score);
  scoreCount.appendChild(scoreMessage);
  scoreCount.id = "score";
  scoreCount.setAttribute("style", "text-align: right; padding-top: 30px; padding-right: 50px;");
  game.appendChild(scoreCount);

  // The game is set to last 1 minute
  while (timeElapsed !== totalGameTime) {
    // Makes it so that every 1.5 seconds, a button will appear
    timeElapsed += 1000;
    createButton(timeElapsed);
  }

  function createButton(seconds) {
    setTimeout(function () {
      let buttonTest = document.createElement("button");
      buttonTest.style.top = Math.floor((Math.random() * 200) + 100) + "px";
      buttonTest.style.left = Math.floor((Math.random() * 200) + 300) + "px";
      buttonTest.style.position = "absolute";
  
      if (buttonNum === 9) {
        buttonNum = 0;
        buttonTest.innerHTML = ++buttonNum;
      } else {
        buttonTest.innerHTML = ++buttonNum;
      }
  
      buttonTest.addEventListener('click', function () {
        this.remove();
        updateScore();
      });

      setTimeout(function() {
        buttonTest.remove();
      }, 2500);
  
      buttonTest.id = "gameButton";
      game.appendChild(buttonTest);
    }, seconds);
  }

  function updateScore() {
    let scoreText = document.getElementById("score");
    score++;
    scoreText.innerText = "Score : " + score;
  }
}
