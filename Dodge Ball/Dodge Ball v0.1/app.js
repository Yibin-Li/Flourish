PIXI.utils.sayHello();
// size of the game
var xSize = 800;
var ySize = 600;

// starting position of other balls
var xStart = 100;
var yStart = 200;

// startign position of the player's ball
var xPlayerStart = 200;
var yPlayerStart = 300;

// radius of the playerball
var playerBallRadius = 6;

// radius of the ball
var ballRadius = 10;

// velocity of the playerball
var playerBallVelocity = 12;

// number of balls in the screen
var ballNumber = 2;

// current time
var d = new Date();
var n = d.getTime();

// current game level
var curretLevels = 0;

// set up current game environment
var app = new PIXI.Application(xSize, ySize, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

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
var playerInfoText = new PIXI.Text("X: " + xCo + " " + "Y: " + yCo + "V: " + playerBallVelocity, {
	fontSize: 20
});
playerInfoText.x = 0;
playerInfoText.y = 0;
app.stage.addChild(playerInfoText);

// add currect score text
var scoreText = new PIXI.Text("Score: " + n);
scoreText.x = app.screen.width / 2 - 100;
scoreText.y = 0;
app.stage.addChild(scoreText);

// add time of survival
var timeText = new PIXI.Text("Time: " + Math.floor(n / 1000) + "s", {
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

// add functions to each frame
app.ticker.add(multiMovingBall);
app.ticker.add(nextLevel);
app.ticker.add(end);

// Add the 'keydown' event listener to our document
document.addEventListener('keydown', onKeyPressed);

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
function multiMovingBall() {
	// update time
	let d = new Date();
	let timeElapsed = d.getTime() - n;
	
	// check if need to display text (130000 means 13s, 10s for each 
	// level, 3s for display text)
	if (timeElapsed > 9950 + curretLevels*13000) {
		console.log("movingballs called curretLevels: " + curretLevels)
		levelText.alpha = 100;
	};
	
	// update text
	let xCo = playerBall.x.toString();
	let yCo = playerBall.y.toString();
	playerInfoText.text = "X: " + xCo + " Y: " + yCo + " V: " + playerBallVelocity;
	
	//update score and time
	scoreText.text = "Score: " + (timeElapsed - curretLevels*3000);
	timeText.text = "Time: " + (1 + Math.floor(timeElapsed / 1000) - curretLevels*3) + "s";
	levelInfoText.text = "Level: " + (curretLevels + 1);
	
	for (let j = 0; j < allGraphic.length; j++) {
		let xPos = allGraphic[j].x + allGraphicVelocity[j][0];
		let yPos = allGraphic[j].y + allGraphicVelocity[j][1];
		if (xPos > xSize || xPos < 0) {
			allGraphicVelocity[j][0] = -allGraphicVelocity[j][0];
		} else if (yPos > ySize || yPos < 0) {
			allGraphicVelocity[j][1] = -allGraphicVelocity[j][1];
		}
		allGraphic[j].x += allGraphicVelocity[j][0];
		allGraphic[j].y += allGraphicVelocity[j][1];
	};	
};

function onKeyPressed(key) {
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

// return if the palyer collided with the balls
function collided() {
	for (let j = 0; j < allGraphic.length; j++) {
		let ball = allGraphic[j];
		let dis = Math.sqrt((playerBall.x - ball.x) ** 2 
		+ (playerBall.y - ball.y) ** 2);
		if (dis <= ballRadius) {
			//console.log("dis" + dis);
			//console.log("ball x" + ball.x);
			//console.log("ball y" + ball.y);
			return true;
		};
	};
	return false;
};

// function that terminates the game (when the player collide with the balls)
function end() {
	
	// find elapsed time from the game starts
	let d = new Date();
	let timeElapsed = d.getTime() - n;
	
	if (timeElapsed > 3000 + curretLevels*13000 && collided()) {		
		app.ticker.stop();
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
		
		endText.x = app.screen.width / 2 - 180;
		endText.y = app.screen.height / 2 - 50;
		app.stage.addChild(endText);
	};
	// return score, time
};

// if the player survive more than 10s, game goes to next level
function nextLevel() {
	let d = new Date();
	let timeElapsed = d.getTime() - n;
	
	if (timeElapsed > 10001 + curretLevels*13000) {		
		curretLevels += 1;
		
		// increase difficulty
		ballNumber += 1;
		ballRadius += 1;
		
		//console.log("nextLevel called curretLevels: " + curretLevels);
		app.ticker.stop();
		
		let dd = new Date();
		let timer = dd.getTime() - d.getTime();
		while (timer < 3000) {
			let dd = new Date();
			timer = dd.getTime() - d.getTime();
		}
		//console.log("success");
		
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

function repeat() {
	app.stage.addChild(playerBall);
	app.stage.addChild(scoreText);
	app.stage.addChild(playerInfoText);
	app.stage.addChild(timeText);
	app.stage.addChild(levelText);
	app.stage.addChild(levelInfoText);
	initializeBallsAndDraw();
};
