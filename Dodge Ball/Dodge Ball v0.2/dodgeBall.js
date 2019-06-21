PIXI.utils.sayHello();
// size of the game
var xSize = 800;
var ySize = 600;

// starting position of other balls
var xStart = 100;
var yStart = 200;

// startign position of the player's ball
var xPlayerStart = 500;
var yPlayerStart = 400;


// current time
var d = new Date();
var n = d.getTime();

// radius of the playerball
var playerBallRadius = 10;

// radius of the ball
var ballRadius = 10;

// velocity of the playerball
var playerBallVelocity = 12;

// number of balls in the screen
var ballNumber = 2;

// current game level
var curretLevels = 0;

// wait time between each level (in milliseconds)
var waitLevelTime = 1000;

// the time player is invincible (in milliseconds)
var invincibleTime = 3000;

// the time to play for each level (in milliseconds)
var levelTime = 10000; 

var instructionDisplayTime = 5000;

// the scale for the score (update when capture the reward)
var scale = 1;

var rewardPresent = true;

// set up current game environment
var app = new PIXI.Application(xSize, ySize, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

// initialize reward
var reward = new PIXI.Graphics();
reward.beginFill(0x39ff2b); // green
reward.drawRect(0, 0, 10, 10); 
reward.x = -50;
reward.y = -50;
reward.endFill();
app.stage.addChild(reward);
rewardXSpeed = Math.floor(Math.random() * 6) - 3;
rewardYSpeed = Math.floor(Math.random() * 6) - 3;

// initialize player ball
var playerBall = new PIXI.Graphics();
playerBall.beginFill(0xffffff); // white
playerBall.drawCircle(0, 0, playerBallRadius); 
playerBall.x = xPlayerStart;
playerBall.y = yPlayerStart;
playerBall.endFill();
app.stage.addChild(playerBall);

initializeBallsAndDraw();

// add player info to the screen
let xCo = playerBall.x.toString();
let yCo = playerBall.y.toString();
var playerInfoText = new PIXI.Text("X: " + xCo + " " + "Y: " + yCo + " V: " + playerBallVelocity, {
	fontSize: 20
});
playerInfoText.x = 0;
playerInfoText.y = 0;
app.stage.addChild(playerInfoText);

// add currect score text
var scoreText = new PIXI.Text("Score: " + 0);
scoreText.x = app.screen.width / 2 - 100;
scoreText.y = 0;
app.stage.addChild(scoreText);

// add time of survival
var timeText = new PIXI.Text("Time: " + 0 + "s", {
	fontSize: 20
});
timeText.x = app.screen.width - 150;
timeText.y = 0;
app.stage.addChild(timeText);

// UI text
var levelText = new PIXI.Text("Next Level", {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 60
});		
levelText.x = app.screen.width / 2 - 180;
levelText.y = app.screen.height / 2 - 50;
levelText.alpha = 0;
app.stage.addChild(levelText);

// add level info
var levelInfoText = new PIXI.Text("Level: " + curretLevels, {
	fontSize: 20
});
levelInfoText.x = app.screen.width - 250;
levelInfoText.y = 0;
app.stage.addChild(levelInfoText);

// instruction text before the game starts
var instructionText = new PIXI.Text("         The game is easy. \n Try not touch the red balls!", {
		fontWeight: 'bold',
		fontSize: 30
});
instructionText.alpha = 0;
app.stage.addChild(instructionText);

instructionText.x = app.screen.width / 2 - 220;
instructionText.y = app.screen.height / 2 - 50;

// add functions to each frame
app.ticker.add(instructionDisplay);
app.ticker.add(motion);
app.ticker.add(nextLevel);
app.ticker.add(end);

// Add the 'keydown' event listener to our document
document.addEventListener('keydown', onKeyPressed);

/* Helper functions
-----------------------------------------------------
*/

// instruction before the game starts
function instructionDisplay() {
	// update time
	let d = new Date();
	let timeElapsed = d.getTime() - n;
	
	if (timeElapsed < instructionDisplayTime) {
		instructionText.alpha = 100;
	} else {
		instructionText.alpha = 0;
	};
};

// initialize balls and their random velocity
function initializeBallsAndDraw() {
	// store all balls graphics to allGraphic, velocity to allGraphicVelocity
	allGraphic = [];
	allGraphicVelocity = [];

	// create balls
	for (let i = 0; i < ballNumber; i++) {
		let newBall = new PIXI.Graphics();
		allGraphic.push(newBall);
		app.stage.addChild(newBall);
		xv = Math.floor(Math.random() * 20) - 10;
		yv = Math.floor(Math.random() * 20) - 10;
		allGraphicVelocity.push([xv, yv]);
	};

	// draw all ball graphics on the screen
	for (let j = 0; j < allGraphic.length; j++) {
		let ball = allGraphic[j];
		ball.beginFill(0xff0000); // white
		ball.drawCircle(0, 0, ballRadius); // drawCircle(x, y, radius)
		ball.x = xStart;
		ball.y = yStart;
		allGraphic[j].endFill();
	};
};

// the core function for animation
function motion() {
	// update time
	let d = new Date();
	let timeElapsed = d.getTime() - n - instructionDisplayTime;
	
	if (timeElapsed > 0) {
	
		// check if need to display text (130000 means 13s, 10s for each 
		// level, 3s for display text)
		if (timeElapsed > (levelTime - 50) + curretLevels*(levelTime + waitLevelTime)) {
			// console.log("movingballs called curretLevels: " + curretLevels)
			levelText.alpha = 100;
		};
		
		if (rewardCollided() && rewardPresent){
			app.stage.removeChild(reward);
			scale = scale * 2;
			rewardPresent = false;
			// TODO: add a double score message to the screen
		};
		
		// update text
		let xCo = playerBall.x.toString();
		let yCo = playerBall.y.toString();
		playerInfoText.text = "X: " + xCo + " Y: " + yCo + " V: " + playerBallVelocity;
		
		//update score and time
		scoreText.text = "Score: " + (timeElapsed - curretLevels*waitLevelTime) * scale;
		timeText.text = "Time: " + 
		(1 + Math.floor((timeElapsed - curretLevels*waitLevelTime)/ 1000)) + "s";
		levelInfoText.text = "Level: " + (curretLevels + 1);
		
		// update red balls' position
		for (let j = 0; j < allGraphic.length; j++) {
			let xPos = allGraphic[j].x + allGraphicVelocity[j][0];
			let yPos = allGraphic[j].y + allGraphicVelocity[j][1];
			if (xPos > xSize || xPos < 0) {
				allGraphicVelocity[j][0] = -allGraphicVelocity[j][0];
			};
			if (yPos > ySize || yPos < 0) {
				allGraphicVelocity[j][1] = -allGraphicVelocity[j][1];
			};
			allGraphic[j].x += allGraphicVelocity[j][0];
			allGraphic[j].y += allGraphicVelocity[j][1];
		};
		
		// update reward's position
		rewardXPos = reward.x;
		rewardYPos = reward.y;
		//console.log("x: ", rewardXPos);
		//console.log("y: ", rewardYPos);
		if (rewardXPos > xSize + 100 || rewardXPos < 0 - 100) {
			rewardXSpeed = -rewardXSpeed;
		}; 
		if (rewardYPos > ySize + 100 || rewardYPos < 0 - 100) {
			rewardYSpeed = -rewardYSpeed;
		};
		reward.x += rewardXSpeed;
		reward.y += rewardYSpeed;
	};
};

function onKeyPressed(key) {
	let d = new Date();
	let timeElapsed = d.getTime() - n;
	
	if (timeElapsed > instructionDisplayTime) {
		
		// W Key is 87, Up arrow is 87. If the W key or the Up arrow is pressed, 
		// move the player up. Don't move up if the player is at the top of the stage.
		if ((key.keyCode === 87 || key.keyCode === 38)&&
			((playerBall.y - playerBallVelocity) >= 0 + playerBallRadius))	{
			playerBall.y -= playerBallVelocity;
		};

		// S Key is 83, Down arrow is 40. If the S key or the Down arrow is pressed, 
		// move the player down. Don't move if the player is at the bottom.
		if ((key.keyCode === 83 || key.keyCode === 40)&&
			((playerBall.y + playerBallVelocity) <= ySize - playerBallRadius)) {
			playerBall.y += playerBallVelocity;
		};

		// A Key is 65, Left arrow is 37. If the A key or the Left arrow is pressed, 
		// move the player to the left. Don't move if the player is at the left side.
		if ((key.keyCode === 65 || key.keyCode === 37)&&
			((playerBall.x - playerBallVelocity) >= 0 + playerBallRadius)) {
			playerBall.x -= playerBallVelocity;
		};

		// D Key is 68, Right arrow is 39. If the D key or the Right arrow is pressed, 
		// move the player to the right.Don't move if the player is at the right side.
		if ((key.keyCode === 68 || key.keyCode === 39)&&
			((playerBall.x + playerBallVelocity) <= xSize - playerBallRadius)){
			playerBall.x += playerBallVelocity;
		};
	};
};

// return if the palyer collided with the balls
function collided() {
	for (let j = 0; j < allGraphic.length; j++) {
		let ball = allGraphic[j];
		let dis = Math.sqrt((playerBall.x - ball.x) ** 2 
		+ (playerBall.y - ball.y) ** 2);
		if (dis <= ballRadius) {
			return true;
		};
	};
	return false;
};

// function that terminates the game (when the player collide with the red balls)
function end() {
	
	// find elapsed time from the game starts
	let d = new Date();
	let timeElapsed = d.getTime() - n - instructionDisplayTime;
	
	if (timeElapsed > invincibleTime + 
		curretLevels*(levelTime + waitLevelTime) && collided()) {		
		app.ticker.stop();
		scoreText.alpha = 0;
		playerInfoText.alpha = 0;
		/*// clean the screen
		for (var i = app.stage.children.length - 1; i >= 0; i--) {
			app.stage.removeChild(app.stage.children[i]);
		};*/
		var endText = new PIXI.Text("Game Over", {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 60,
			//fontFamily: 'Arvo',
			//fill: '#3e1707',
			//align: 'center',
			//stroke: '#a4410e',
			//strokeThickness: 7
		});
		
		var endTextScore = new PIXI.Text("Score: "+ 
		(timeElapsed - curretLevels*waitLevelTime) * scale, {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 30,
		});
		
		endText.x = app.screen.width / 2 - 180;
		endText.y = app.screen.height / 2 - 50;
		endTextScore.x = app.screen.width / 2 - 110;
		endTextScore.y = app.screen.height / 2 - 90;
		app.stage.addChild(endText);
		app.stage.addChild(endTextScore);
	};
	// return score, time
};

// if the player survive more than 10s, game goes to next level
function nextLevel() {
	let d = new Date();
	let timeElapsed = d.getTime() - n - instructionDisplayTime;
	
	if (timeElapsed > (levelTime + 1) + curretLevels*(levelTime + waitLevelTime)) {		
		curretLevels += 1;
		
		// increase difficulty
		ballNumber += 1;
		ballRadius += 1;
		
		app.ticker.stop();
		
		// stop for waitLevelTime milliseconds
		let dd = new Date();
		let timer = dd.getTime() - d.getTime();
		while (timer < waitLevelTime) {
			let dd = new Date();
			timer = dd.getTime() - d.getTime();
		}
		
		// clean the screen
		for (let i = app.stage.children.length - 1; i >= 0; i--) {
			app.stage.removeChild(app.stage.children[i]);
		};
		
		app.ticker.start();
		
		// make levelInfoText invisible during the game
		levelText.alpha = 0;
		repeat();
	};
};

// repeat the game process after finishing one level
function repeat() {
	app.stage.addChild(reward);
	rewardXSpeed = Math.floor(Math.random() * 2) + 3;
	rewardYSpeed = Math.floor(Math.random() * 2) + 3;
	rewardPresent = true;
	app.stage.addChild(playerBall);
	app.stage.addChild(scoreText);
	app.stage.addChild(playerInfoText);
	app.stage.addChild(timeText);
	app.stage.addChild(levelText);
	app.stage.addChild(levelInfoText);
	initializeBallsAndDraw();
};

function rewardCollided() {
	//let d = new Date();
	//let timeElapsed = d.getTime() - n - instructionDisplayTime;
	let dis = Math.sqrt((playerBall.x - reward.x - 5) ** 2 
		+ (playerBall.y - reward.y - 5) ** 2);
	if (dis <= ballRadius) {
		return true;
	};
	return false;
};
