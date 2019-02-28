PIXI.utils.sayHello();

// size of the game
/*if (window.innerWidth > window.innerHeight) {
	console.log(window.innerWidth);
	console.log(window.innerHeight);
	var xSize = window.innerWidth - 20; // 800 originally
	var ySize = window.innerHeight - 20; // 600 originally
} else {
	var xSize = window.innerHeight - 20; // 800 originally
	var ySize = window.innerWidth - 20; // 600 originally
	console.log(window.innerWidth);
	console.log(window.innerHeight);
}*/

var xSize = window.innerWidth - 20; // 800 originally
var ySize = window.innerHeight - 20; // 600 originally

// current time
var d = new Date();
var n = d.getTime();

// -------------Balls Variables-----------------
// starting position of other balls
var xStart = 100;
var yStart = 200;

// startign position of the player's ball
var xPlayerStart = 300;
var yPlayerStart = 400;

// radius of the baloon
var baloonRadius = 50;

// radius of the ball
var ballRadius = 30;

// the size of valid collision
var collidedSize = 30;

// number of balls in the screen
var ballNumber = 2;

// current game level
var curretLevels = 0;

// -------------Time Variables-------------------
// wait time between each level (in milliseconds)
var waitLevelTime = 1000;

// the time player is invincible (in milliseconds)
var invincibleTime = 3000;

// the time to play for each level (in milliseconds)
var levelTime = 10000;

// the time to display the instruction (in milliseconds)
var instructionDisplayTime = 3000;

// the time to display countdown text (in milliseconds)
var countdownDisplayTime = 1000;

// the time to display all text before the game starts
var allTextDisplayTime = countdownDisplayTime * 3 + instructionDisplayTime;

// the time to dispaly the announcement (in milliseconds)
var announcementTime = 2000;

// ------------------Other Variables---------------------
// the scale for the score (update when capture the reward)
var scale = 1000;
var rewardScore = 0;

// set reward present in the screen
var rewardPresent = true;

// initialize mouse/touch reading
var lastmouseX = -1;
var lastmouseY = -1;
var currentmouseX = -1;
var currentmouseY = -1;

// ----------------Elements Variables----------------
// set up current game environment
var app = new PIXI.Application(xSize, ySize, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

/*// -------------------Test Only---------------------
// initialize reward
var rewardG = new PIXI.Graphics();
rewardG.beginFill(0x39ff2b); // green
rewardG.drawRect(0, 0, 20, 20);
rewardG.x = 50;
rewardG.y = 50;
rewardG.endFill();
app.stage.addChild(rewardG);
var rewardXSpeed = Math.floor(Math.random() * 8) - 4;
var rewardYSpeed = Math.floor(Math.random() * 8) - 4;

// initialize player ball
var playerBall = new PIXI.Graphics();
playerBall.beginFill(0xffffff); // white
playerBall.drawCircle(0, 0, 20);
playerBall.x = xPlayerStart;
playerBall.y = yPlayerStart;
playerBall.endFill();
app.stage.addChild(playerBall);

// initialize red ball
var otherBall = new PIXI.Graphics();
otherBall.beginFill(0xFF0000); // red
otherBall.drawCircle(0, 0, 20);
otherBall.x = xStart;
otherBall.y = yStart;
otherBall.endFill();
app.stage.addChild(otherBall);
// -------------------Test Only---------------------*/

// add announcement to the screen
var announcementText = new PIXI.Text("Score Increased!", {
	fontSize: 50,
	fill: '0xffffff'
});
announcementText.x = 20;
announcementText.y = 0;
announcementText.alpha = 0;
app.stage.addChild(announcementText);

// add currect score text
var scoreText = new PIXI.Text("Score: " + 0, {fontSize: 50});
scoreText.x = app.screen.width / 2 - 110;
scoreText.y = 0;
app.stage.addChild(scoreText);

// add time of survival
var timeText = new PIXI.Text("Time: " + 0 + "s", {
	fontSize: 30
});
timeText.x = app.screen.width - 160;
timeText.y = 0;
app.stage.addChild(timeText);

// UI text
var levelText = new PIXI.Text("Next Level", {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 80
});
levelText.x = app.screen.width / 2 - 180;
levelText.y = app.screen.height / 2 - 50;
levelText.alpha = 0;
app.stage.addChild(levelText);

// add level info
var levelInfoText = new PIXI.Text("Level: " + curretLevels, {
	fontSize: 30
});
levelInfoText.x = app.screen.width - 160;
levelInfoText.y = 40;
app.stage.addChild(levelInfoText);

// instruction text before the game starts
var instructionText = new PIXI.Text("			        			          The game is easy \n Avoid the read objects by sliding on the screen \n		     For extra points capture the green objects", {
		fontWeight: 'bold',
		fontSize: 30
});
instructionText.alpha = 0;
app.stage.addChild(instructionText);

instructionText.x = app.screen.width / 2 - 300;
instructionText.y = app.screen.height / 2 - 80;

var sanText = new PIXI.Text("3 San", {
		fontWeight: 'bold',
		fontSize: 75
});
sanText.alpha = 0;
app.stage.addChild(sanText);

var erText = new PIXI.Text("2 Er", {
		fontWeight: 'bold',
		fontSize: 75
});
erText.alpha = 0;
app.stage.addChild(erText);

var yiText = new PIXI.Text("1 Yi", {
		fontWeight: 'bold',
		fontSize: 75
});
yiText.alpha = 0;
app.stage.addChild(yiText);

sanText.x = app.screen.width / 2 - 30;
sanText.y = app.screen.height / 2 -30;
erText.x = app.screen.width / 2 - 30;
erText.y = app.screen.height / 2 - 30;
yiText.x = app.screen.width / 2 - 30;
yiText.y = app.screen.height / 2 - 30;

instructionDisplay = displayText(instructionText, instructionDisplayTime, 0);

sanTextDisplay = displayText(sanText, countdownDisplayTime, instructionDisplayTime);
erTextDisplay = displayText(erText, countdownDisplayTime, instructionDisplayTime + countdownDisplayTime);
yiTextDisplay = displayText(yiText, countdownDisplayTime, instructionDisplayTime + 2 * countdownDisplayTime);

// add functions to each frame
//app.ticker.add(instructionDisplay);
PIXI.loader
		.add("/dodgeball-test-version/img/bird.json")
    .add("/dodgeball-test-version/img/boomBaloon.json")
		.add("/dodgeball-test-version/img/starAlive.json")
		.load(setup);

/* Helper functions
-----------------------------------------------------
*/
function setup() {
	// reward
	let textureArrayReward = [];

	for (let i=0; i < 6; i++)
	{
			 let textureReward = PIXI.Texture.from("FLOURISH-_BoomBaloon-_StarAssets_0" + (i+1) + ".png");
			 textureArrayReward.push(textureReward);
	};

	// create an animated sprite
	window.animatedReward = new PIXI.extras.AnimatedSprite(textureArrayReward);
	// set speed, start playback and add it to the stage
	animatedReward.animationSpeed = 0.167;
	animatedReward.play();

  // set the pivot to the center of the reward
  animatedReward.pivot.x = 12;
  animatedReward.pivot.y = 15;

  // set the starting position
	animatedReward.x = 50;
	animatedReward.y = 50;
	app.stage.addChild(animatedReward);

	// baloon
	let textureArrayBaloon = [];

	for (let i=0; i < 7; i++)
	{
			 let textureBaloon = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BaloonAssets_0" + (i+1) + ".png");
			 textureArrayBaloon.push(textureBaloon);
	};

	// create an animated sprite
	window.animatedBoomBaloon = new PIXI.extras.AnimatedSprite(textureArrayBaloon);
	// set speed, start playback and add it to the stage
	animatedBoomBaloon.animationSpeed = 0.167;
	animatedBoomBaloon.play();

  // set the pivot to the center of the baloon
  animatedBoomBaloon.pivot.x = 53;
  animatedBoomBaloon.pivot.y = 65;

  // set the starting position
	animatedBoomBaloon.x = xPlayerStart;
	animatedBoomBaloon.y = yPlayerStart;
	app.stage.addChild(animatedBoomBaloon);


	// bird
	window.textureArrayBird = [];

	for (let i= 0; i < 8; i++)
	{
			 let textureBird = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BirdAssets_0" + (i+1) + ".png");
			 textureArrayBird.push(textureBird);
	};

  announcementDisplay = "";
  app.ticker.add(instructionDisplay);
  app.ticker.add(sanTextDisplay);
  app.ticker.add(erTextDisplay);
  app.ticker.add(yiTextDisplay);

	initializeBallsAndDraw();
  app.ticker.add(motion);
  app.ticker.add(nextLevel);
  app.ticker.add(end);

  // Add three events (mousemove, touchmove) listener to our document
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener("touchmove", onTouchMove);
}


// function that displayes text in a given time
function displayText(textToDisplay, duration, startTime) {
	function helper() {
		// update time
		let date = new Date();
		let timeElapsed = date.getTime() - n;

		//console.log("time passed: " + timeElapsed);
		//console.log("time supposed to stop: " + startTime + duration);

		if ((startTime < timeElapsed) && (timeElapsed < startTime + duration)) {
			textToDisplay.alpha = 100;
		}
		else {
			textToDisplay.alpha = 0;
		}
	}
	return helper;
}


// initialize balls and their random velocity
function initializeBallsAndDraw() {
	// store all balls graphics to allGraphic, velocity to allGraphicVelocity
	allGraphic = [];
	allGraphicVelocity = [];

	// create balls
	for (let i = 0; i < ballNumber; i++) {
		// create an animated sprite
		let animatedBird = new PIXI.extras.AnimatedSprite(textureArrayBird);

		// set speed, start playback and add it to the stage
		//animatedBird.position.x = 100
		//let newBall = animatedBird;
		allGraphic.push(animatedBird);
		app.stage.addChild(animatedBird);
		xv = Math.floor(Math.random() * 30) - 15;
		yv = Math.floor(Math.random() * 30) - 15;
		allGraphicVelocity.push([xv, yv]);
		animatedBird.animationSpeed = 0.167;
		// set the pivot to the center of the baloon
	  animatedBird.pivot.x = 45;
	  animatedBird.pivot.y = 40;
		animatedBird.x = xStart;
		animatedBird.y = yStart;
		animatedBird.play();
	};
};

// the core function for animation
function motion() {
	// update time
	let d = new Date();
	let timeElapsed = d.getTime() - n - allTextDisplayTime;

	if (timeElapsed > 0) {

		// check if need to display text (130000 means 13s, 10s for each
		// level, 3s for display text)
		if (timeElapsed > (levelTime - 50) + curretLevels*(levelTime + waitLevelTime)) {
			// console.log("movingballs called curretLevels: " + curretLevels)
			levelText.alpha = 100;
		};

		// playerBall blinks to show invincibility
		let levelOngoingTime = timeElapsed - curretLevels*(levelTime + waitLevelTime);
		if (levelOngoingTime < 3000){
			if (levelOngoingTime / 400 % 2 <= 1) {
				animatedBoomBaloon.alpha = 0.1;
			} else {
				animatedBoomBaloon.alpha = 1;
			}

		} else{
			animatedBoomBaloon.alpha = 100;
		}

		if (rewardCollided() && rewardPresent){
			app.stage.removeChild(animatedReward);
			rewardScore = rewardScore + 10 + 2*curretLevels;
			rewardPresent = false;
			announcementDisplay = displayText(announcementText, announcementTime, d.getTime() - n);
			app.ticker.add(announcementDisplay);
			announcementText.alpha = 100;
		};

		//update score and time
		score = rewardScore + Math.floor((timeElapsed - curretLevels*waitLevelTime) / scale)
		scoreText.text = "Score: " + score;
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
		rewardXPos = animatedReward.x;
		rewardYPos = animatedReward.y;
		//console.log("x: ", rewardXPos);
		//console.log("y: ", rewardYPos);
		if (rewardXPos > xSize || rewardXPos < 0) {
			rewardXSpeed = -rewardXSpeed;
		};
		if (rewardYPos > ySize || rewardYPos < 0) {
			rewardYSpeed = -rewardYSpeed;
		};
		animatedReward.x += rewardXSpeed;
		animatedReward.y += rewardYSpeed;
	};
};

// return if the palyer collided with the balls
function collided() {
	for (let j = 0; j < allGraphic.length; j++) {
		let ball = allGraphic[j];
		let dis = Math.sqrt((animatedBoomBaloon.x - ball.x) ** 2
		+ (animatedBoomBaloon.y - ball.y) ** 2);
		if (dis <= collidedSize) {
			return true;
		};
	};
	return false;
};

// function that terminates the game (when the player collide with the red balls)
function end() {

	// find elapsed time from the game starts
	let d = new Date();
	let timeElapsed = d.getTime() - n - allTextDisplayTime;

	if (timeElapsed > invincibleTime +
		curretLevels*(levelTime + waitLevelTime) && collided()) {
		app.ticker.stop();
		scoreText.alpha = 0;
		// playerInfoText.alpha = 0;

		/*// clean the screen
		for (var i = app.stage.children.length - 1; i >= 0; i--) {
			app.stage.removeChild(app.stage.children[i]);
		};*/
		var endText = new PIXI.Text("Game Over", {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 90,
			//fontFamily: 'Arvo',
			//fill: '#3e1707',
			//align: 'center',
			//stroke: '#a4410e',
			//strokeThickness: 7
		});

		var endTextScore = new PIXI.Text("  Score: "+
		score, {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: 50,
		});

		endText.x = app.screen.width / 2 - 200;
		endText.y = app.screen.height / 2 - 50;
		endTextScore.x = app.screen.width / 2 - 150;
		endTextScore.y = app.screen.height / 2 - 105;
		app.stage.addChild(endText);
		app.stage.addChild(endTextScore);
	};
	// return score, time
};

// if the player survive more than 10s, game goes to next level
function nextLevel() {
	let d = new Date();
	let timeElapsed = d.getTime() - n - allTextDisplayTime;

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

		// consider remove this line in the future?
		app.ticker.remove(instructionDisplay);
		app.ticker.remove(announcementDisplay);

		// make levelInfoText invisible during the game
		levelText.alpha = 0;
		repeat();
	};
};

// repeat the game process after finishing one level
function repeat() {
	app.stage.addChild(animatedReward);
	let rewardXSpeed = Math.floor(Math.random() * 2) + 3;
	let rewardYSpeed = Math.floor(Math.random() * 2) + 3;
	rewardPresent = true;
	announcementText.alpha = 0;
	app.stage.addChild(animatedBoomBaloon);
	app.stage.addChild(scoreText);
	//app.stage.addChild(playerInfoText);
	app.stage.addChild(announcementText)
	app.stage.addChild(timeText);
	app.stage.addChild(levelText);
	app.stage.addChild(levelInfoText);
	initializeBallsAndDraw();
};

function rewardCollided() {
	//let d = new Date();
	//let timeElapsed = d.getTime() - n - instructionDisplayTime;
	let dis = Math.sqrt((animatedBoomBaloon.x - animatedReward.x) ** 2
		+ (animatedBoomBaloon.y - animatedReward.y) ** 2);
	if (dis <= collidedSize) {
		return true;
	};
	return false;
};

/* mouse and touch screen operations
-----------------------------------------------------
*/
// touch screen control method
function onTouchMove(touchData){
	app.renderer.plugins.interaction.on('pointerdown', function(event) {
		MouseCoordinates = event.data.global;
		});

	currentmouseX = MouseCoordinates.x;
	currentmouseY = MouseCoordinates.y;
	let noActionStartingTime = 0;
	let noActionDuration = 0;

	let d = new Date();
	let timeElapsed = d.getTime() - n;

	if (timeElapsed > allTextDisplayTime) {

		// inactivative detection
		if ((currentmouseX == lastmouseX) &&
		(currentmouseY == lastmouseY) &&
		(noActionStartingTime == 0)){
			let dtime = new Date();
			noActionStartingTime = dtime.getTime() - n;
		} else if ((currentmouseX == lastmouseX) &&
		(currentmouseY == lastmouseY)) {
			let dtime = new Date();
			noActionDuration = dtime.getTime() - noActionStartingTime;
		} else {
			noActionStartingTime = 0;
			noActionDuration = 0;
		}

		if (noActionDuration > 500) {
			lastmouseX = -1;
			lastmouseY = -1;
		}

		// the factor that controls how fast the ball moves
		let distScalar = 0.5;
		if (((animatedBoomBaloon.x + (currentmouseX - lastmouseX) / distScalar) >= 0 + baloonRadius) &&
			 ((animatedBoomBaloon.x + (currentmouseX - lastmouseX) / distScalar) <= xSize - baloonRadius)){
			animatedBoomBaloon.x += (currentmouseX - lastmouseX) / distScalar;
		};

		if (((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) >= 0 + baloonRadius) &&
			 ((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) <= ySize - baloonRadius)){
			animatedBoomBaloon.y += (currentmouseY - lastmouseY) / distScalar;
		};
	};
	lastmouseX = currentmouseX;
	lastmouseY = currentmouseY;
};

// mouse control method
function onMouseMove(mouseData) {
	currentmouseX = mouseData.x;
	currentmouseY = mouseData.y;

	let d = new Date();
	let timeElapsed = d.getTime() - n;
	let noActionStartingTime = 0;
	let noActionDuration = 0;

	if (timeElapsed > allTextDisplayTime) {

		// inactivative detection
		if ((currentmouseX == lastmouseX) &&
		(currentmouseY == lastmouseY) &&
		(noActionStartingTime == 0)){
			let dtime = new Date();
			noActionStartingTime = dtime.getTime() - n;
		} else if ((currentmouseX == lastmouseX) &&
		(currentmouseY == lastmouseY)) {
			let dtime = new Date();
			noActionDuration = dtime.getTime() - noActionStartingTime;
		} else {
			noActionStartingTime = 0;
			noActionDuration = 0;
		}

		if (noActionDuration > 1000) {
			lastmouseX = -1;
			lastmouseY = -1;
		}

		// the factor that controls how fast the ball moves
		let distScalar = 0.5;
		if (((animatedBoomBaloon.x + (currentmouseX - lastmouseX) / distScalar) >= 0 + baloonRadius) &&
			 ((animatedBoomBaloon.x + (currentmouseX - lastmouseX) / distScalar) <= xSize - baloonRadius)){
			animatedBoomBaloon.x += (currentmouseX - lastmouseX) / distScalar;
		};

		if (((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) >= 0 + baloonRadius) &&
			 ((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) <= ySize - baloonRadius)){
			animatedBoomBaloon.y += (currentmouseY - lastmouseY) / distScalar;
		};
	};
	lastmouseX = currentmouseX;
	lastmouseY = currentmouseY;
};
