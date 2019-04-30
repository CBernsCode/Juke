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

  let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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
      buttonTest.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
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
    score += 10;
    scoreText.innerText = "Score : " + score;
  }
}
