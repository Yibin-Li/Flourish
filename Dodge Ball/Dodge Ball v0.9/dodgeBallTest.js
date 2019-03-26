PIXI.utils.sayHello();

var xSize = Math.min(window.innerWidth - 20, 1080); // 800 originally
var ySize = Math.min(window.innerHeight - 20, 2048); // 600 originally

// current time
var d = new Date();
var n = d.getTime();

// -------------Balls Variables-----------------
// starting position of other balls
var xStart = 800;
var yStart = 400;

// startign position of the player's ball
var xPlayerStart = 300;
var yPlayerStart = 400;

// radius of the baloon
var baloonRadius = 50;

// radius of the ball
var ballRadius = 30;

// the size of valid collision
var collidedSize = 60;

// number of balls in the screen
var ballNumber = 2;

// current game level
var curretLevels = 0;

// reward moving speed
var rewardXSpeed = Math.floor(Math.random() * 8) - 4;
var rewardYSpeed = Math.floor(Math.random() * 8) - 4;

// background cloud moving speed
var smallCloudSpeed = 0.5;
var medianCloudSpeed = 1;
var largeCloudSpeed = 2;

var lightSpeed = 0.1;

// -------------Time Variables-------------------
// wait time between each level (in milliseconds)
var waitLevelTime = 1000;

// the time player is invincible (in milliseconds)
var invincibleTime = 3000;

// the time to play for each level (in milliseconds)
var levelTime = 10000;

// the time to display the instruction (in milliseconds)
var instructionDisplayTime = 500;

// the time to display countdown text (in milliseconds)
var countdownDisplayTime = 1000;

// the time to display all text before the game starts
var allTextDisplayTime = countdownDisplayTime * 4 + instructionDisplayTime;

// ------------------Other Variables---------------------
// the scale for the score (update when capture the reward)
var scale = 1000;
var rewardScore = 0;

// number of star captured
var starCount = 0;

// height of hud bar
var hudBarHeight = 60;

// set reward present in the screen
var rewardPresent = true;

// variables that control after
var endGame = false;
var timefromEnd = Infinity;

// initialize mouse/touch reading
var lastmouseX = -1;
var lastmouseY = -1;
var currentmouseX = -1;
var currentmouseY = -1;

// speed of boom animation
var boomAnimationSpeed = 0.12;
var boomAnimationTime = 112 / boomAnimationSpeed;
// ----------------Elements Variables----------------
// set up current game environment
var app = new PIXI.Application(xSize, ySize, {backgroundColor: 0x1099bb});
document.body.appendChild(app.view);

// ------------ background elements -----------------
var light = new PIXI.Sprite.fromImage('/dodgeball-test-version/img/light.png');
light.x = app.screen.width - 400;
light.scale.y = 3;
app.stage.addChild(light);

var light2 = new PIXI.Sprite.fromImage('/dodgeball-test-version/img/light.png');
light2.x = (app.screen.width - 400) + app.screen.width;
light2.scale.y = 3;
app.stage.addChild(light2);

var dotContainer = new PIXI.Container();
app.stage.addChild(dotContainer);

var dotTexture = PIXI.Texture.fromImage('/dodgeball-test-version/img/dot.png');
for (let i=0; i < 121; i++) {
	var dot = new PIXI.Sprite(dotTexture);
	dot.anchor.set(0.5);
  dot.x = (i % 11) * 128;
  dot.y = Math.floor(i / 11) * 128;
	dotContainer.addChild(dot);
}
// Center on the screen
dotContainer.x = (app.screen.width - dotContainer.width) / 2;
dotContainer.y = (app.screen.height - dotContainer.height) / 2;

//-------needs to modified below for more efficient----------
smallCloudPosition = [[700, 100],
										[200, 1000],
										[600, 1100]];
medianCloudPosition = [[800, 1200],
										[500, 500],
										[900, 950]];
largeCloudPosition = [[150, 900],
										[300, 1300]];

var smallCloudContainer = new PIXI.Container();
var medianCloudContainer = new PIXI.Container();
var largeCloudContainer = new PIXI.Container();
var smallCloudContainer2 = new PIXI.Container();
var medianCloudContainer2 = new PIXI.Container();
var largeCloudContainer2 = new PIXI.Container();
var cloudTexture = PIXI.Texture.fromImage('/dodgeball-test-version/img/cloud.png');
for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = smallCloudPosition[i][0];
	cloud.y = smallCloudPosition[i][1];
	cloud.scale.x = 0.5;
	cloud.scale.y = 0.5;
	cloud.alpha = 0.5;
	smallCloudContainer.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = smallCloudPosition[i][0];
	cloud.y = smallCloudPosition[i][1];
	cloud.scale.x = 0.5;
	cloud.scale.y = 0.5;
	cloud.alpha = 0.5;
	smallCloudContainer2.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = medianCloudPosition[i][0];
	cloud.y = medianCloudPosition[i][1];
	cloud.scale.x = 0.75;
	cloud.scale.y = 0.75;
	cloud.alpha = 0.8;
	medianCloudContainer.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = medianCloudPosition[i][0];
	cloud.y = medianCloudPosition[i][1];
	cloud.scale.x = 0.75;
	cloud.scale.y = 0.75;
	cloud.alpha = 0.8;
	medianCloudContainer2.addChild(cloud);
};

for (let i = 0; i<2; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = largeCloudPosition[i][0];
	cloud.y = largeCloudPosition[i][1];
	largeCloudContainer.addChild(cloud);
};

for (let i = 0; i<2; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = largeCloudPosition[i][0];
	cloud.y = largeCloudPosition[i][1];
	largeCloudContainer2.addChild(cloud);
};

smallCloudContainer2.x = app.screen.width;
medianCloudContainer2.x = app.screen.width;
largeCloudContainer2.x = app.screen.width;

app.stage.addChild(smallCloudContainer);
app.stage.addChild(medianCloudContainer);
app.stage.addChild(largeCloudContainer);
app.stage.addChild(smallCloudContainer2);
app.stage.addChild(medianCloudContainer2);
app.stage.addChild(largeCloudContainer2);
//-------needs to modified above for more efficient----------

// ----------------- HUD elements --------------------------
// HUD bar
var hudBar = new PIXI.Graphics();
hudBar.beginFill(0x1099bb);
hudBar.drawRect(0, 0, app.screen.width, hudBarHeight);
app.stage.addChild(hudBar);

// star image
var starImg = new PIXI.Sprite.from('/dodgeball-test-version/img/star.png');
starImg.x = 20;
starImg.y = 0;
starImg.scale.x = 1.3;
starImg.scale.y = 1.3;
app.stage.addChild(starImg);

// number of star captured in text
var starText = new PIXI.Text("X" + " " + starCount, {fontSize: 35});
starText.x = 70;
starText.y = 10;
app.stage.addChild(starText);

// currect score text
var scoreText = new PIXI.Text(0 + "pts", {
	fontSize: 50,
	fontFamily: 'Nunito',
	fontWeight: 'bold',
	fill: '0xfaff07'});
scoreText.x = app.screen.width / 2 - 80;
scoreText.y = 0;
app.stage.addChild(scoreText);

// time of survival
var timeText = new PIXI.Text("00:00", {
	fontSize: 30
});
timeText.x = app.screen.width - 160;
timeText.y = 0;
app.stage.addChild(timeText);

// level info
var levelInfoText = new PIXI.Text("Level: " + curretLevels, {
	fontSize: 30});
levelInfoText.x = app.screen.width - 160;
levelInfoText.y = 30;
app.stage.addChild(levelInfoText);

// ----------------- end screen ---------------------------
var gameOver = new PIXI.Sprite.from('/dodgeball-test-version/img/gameOver.png');
gameOver.x = app.screen.width / 2 - 330;
gameOver.y = app.screen.height / 2 - 50;
gameOver.scale.x = 2;
gameOver.scale.y = 2;

var scoreBar = new PIXI.Sprite.from('/dodgeball-test-version/img/scoreBar.png');
scoreBar.x = app.screen.width / 2 - 330;
scoreBar.y = app.screen.height / 2 - 550;
scoreBar.scale.x = 2;
scoreBar.scale.y = 2;

// ---------------- text elements --------------------------

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

// --------------Count down screen--------------------
var cloudRedFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/cloudRed.png');
cloudRedFigure.alpha = 0;
app.stage.addChild(cloudRedFigure);

var cloudBlueFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/cloudBlue.png');
cloudBlueFigure.alpha = 0;
app.stage.addChild(cloudBlueFigure);

var cloudYellowFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/cloudYellow.png');
cloudYellowFigure.alpha = 0;
app.stage.addChild(cloudYellowFigure);

var cloudGreenFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/cloudGreen.png');
cloudGreenFigure.alpha = 0;
app.stage.addChild(cloudGreenFigure);

// the scale variables for cloud figure
var cloudFigureScaleX = 1.5;
var cloudFigureScaleY = 1.5;
cloudRedFigure.scale.x = cloudFigureScaleX;
cloudRedFigure.scale.y = cloudFigureScaleY;
cloudBlueFigure.scale.x = cloudFigureScaleX;
cloudBlueFigure.scale.y = cloudFigureScaleY;
cloudYellowFigure.scale.x = cloudFigureScaleX;
cloudYellowFigure.scale.y = cloudFigureScaleY;
cloudGreenFigure.scale.x = cloudFigureScaleX;
cloudGreenFigure.scale.y = cloudFigureScaleY;

var threeFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/threeComplete.png');
threeFigure.alpha = 0;
threeFigure.scale.x = 2;
threeFigure.scale.y = 2;
app.stage.addChild(threeFigure);

var twoFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/twoComplete.png');
twoFigure.alpha = 0;
twoFigure.scale.x = 2;
twoFigure.scale.y = 2;
app.stage.addChild(twoFigure);

var oneFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/oneComplete.png');
oneFigure.alpha = 0;
oneFigure.scale.x = 2;
oneFigure.scale.y = 2;
app.stage.addChild(oneFigure);

var goFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/goComplete.png');
goFigure.alpha = 0;
goFigure.scale.x = 2;
goFigure.scale.y = 2;
app.stage.addChild(goFigure);

// cloud position parameters
var figurePositionX = 30;
var figurePositionY = 50;
cloudRedFigure.x = figurePositionX;
cloudRedFigure.y = figurePositionY;
cloudBlueFigure.x = figurePositionX;
cloudBlueFigure.y = figurePositionY;
cloudYellowFigure.x = figurePositionX;
cloudYellowFigure.y = figurePositionY;
cloudGreenFigure.x = figurePositionX;
cloudGreenFigure.y = figurePositionY;

var numFigPosX = app.screen.width / 2 - 150;
var numFigPosY = app.screen.height / 2 + 50;
threeFigure.x = numFigPosX;
threeFigure.y = numFigPosY;
twoFigure.x = numFigPosX;
twoFigure.y = numFigPosY;
oneFigure.x = numFigPosX;
oneFigure.y = numFigPosY;
goFigure.x = app.screen.width / 2 - 250;
goFigure.y = app.screen.height / 2 + 50;

threeBalloonPosition = [[numFigPosX - 85, numFigPosY + 205],
 												[numFigPosX + 200, numFigPosY - 140],
												[numFigPosX + 300, numFigPosY + 275]];
twoBalloonPosition = [[numFigPosX - 60, numFigPosY - 140],
 											[numFigPosX + 300, numFigPosY + 275]];
oneBalloonPosition = [[numFigPosX + 200, numFigPosY -145]];

var threeBalloonContainer = new PIXI.Container();
threeBalloonContainer.alpha = 0;
app.stage.addChild(threeBalloonContainer);
var twoBalloonContainer = new PIXI.Container();
twoBalloonContainer.alpha = 0;
app.stage.addChild(twoBalloonContainer);
var oneBalloonContainer = new PIXI.Container();
oneBalloonContainer.alpha = 0;
app.stage.addChild(oneBalloonContainer);

for (let i = 0; i < 3; i++) {
	var balloon = new PIXI.Sprite.from('/dodgeball-test-version/img/balloon.png');
	balloon.x = threeBalloonPosition[i][0];
	balloon.y = threeBalloonPosition[i][1];
	threeBalloonContainer.addChild(balloon)
}

for (let i = 0; i < 2; i++) {
	var balloon = new PIXI.Sprite.from('/dodgeball-test-version/img/balloon.png');
	balloon.x = twoBalloonPosition[i][0];
	balloon.y = twoBalloonPosition[i][1];
	twoBalloonContainer.addChild(balloon)
}

for (let i = 0; i < 1; i++) {
	var balloon = new PIXI.Sprite.from('/dodgeball-test-version/img/balloon.png');
	balloon.x = oneBalloonPosition[i][0];
	balloon.y = oneBalloonPosition[i][1];
	oneBalloonContainer.addChild(balloon)
}


// figures to display
threeFigureDisplay = displayText(threeFigure, countdownDisplayTime, instructionDisplayTime);
twoFigureDisplay = displayText(twoFigure, countdownDisplayTime, instructionDisplayTime + countdownDisplayTime);
oneFigureDisplay = displayText(oneFigure, countdownDisplayTime, instructionDisplayTime + 2 * countdownDisplayTime);
goDisplay = displayText(goFigure, countdownDisplayTime, instructionDisplayTime + 3 * countdownDisplayTime);

cloudRedFigureDisplay = displayText(cloudRedFigure, countdownDisplayTime, instructionDisplayTime);
cloudBlueFigureDisplay = displayText(cloudBlueFigure, countdownDisplayTime, instructionDisplayTime + countdownDisplayTime);
cloudYellowFigureDisplay = displayText(cloudYellowFigure, countdownDisplayTime, instructionDisplayTime + 2 * countdownDisplayTime);
cloudGreenFigureDisplay = displayText(cloudGreenFigure, countdownDisplayTime, instructionDisplayTime + 3 * countdownDisplayTime);

threeBalloonDisplay = displayText(threeBalloonContainer, countdownDisplayTime, instructionDisplayTime);
twoBalloonDisplay = displayText(twoBalloonContainer, countdownDisplayTime, instructionDisplayTime + countdownDisplayTime);
oneBalloonDisplay = displayText(oneBalloonContainer, countdownDisplayTime, instructionDisplayTime + 2 * countdownDisplayTime);
// ---------------- Real stuff --------------------------
// add functions to each frame;
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
	animatedReward.x = 500;
	animatedReward.y = 80;
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

  // boomBaloon single animation
	let textureArrayBoom = [];

	for (let i= 8; i < 15; i++)
	{
    let picNumber = 0;
    if (i < 10) {
      picNumber = "0" + i;
    } else {
      picNumber = i;
    }

     let textureBoom = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BaloonAssets_" + picNumber + ".png");
		 textureArrayBoom.push(textureBoom);
	};

	// create an animated sprite
	window.animatedBoom = new PIXI.extras.AnimatedSprite(textureArrayBoom);
	// set speed, start playback and add it to the stage
	animatedBoom.animationSpeed = boomAnimationSpeed;

  // set the pivot to the center of the baloon
  animatedBoom.pivot.x = 53;
  animatedBoom.pivot.y = 63;

  // hide the boom at first
  app.stage.addChild(animatedBoom);
  animatedBoom.alpha = 0;

	// bird
	window.textureArrayBird = [];

	for (let i= 0; i < 8; i++)
	{
			 let textureBird = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BirdAssets_0" + (i+1) + ".png");
			 textureArrayBird.push(textureBird);
	};

	animatedReward.alpha = 0;
	animatedBoomBaloon.alpha = 0;

  // instruction text and count down
  announcementDisplay = "";

	app.ticker.add(cloudRedFigureDisplay);
	app.ticker.add(threeFigureDisplay);
	app.ticker.add(threeBalloonDisplay);
	app.ticker.add(cloudBlueFigureDisplay);
	app.ticker.add(twoFigureDisplay);
	app.ticker.add(twoBalloonDisplay);
	app.ticker.add(cloudYellowFigureDisplay);
	app.ticker.add(oneFigureDisplay);
	app.ticker.add(oneBalloonDisplay);
	app.ticker.add(cloudGreenFigureDisplay);
	app.ticker.add(goDisplay);

  // game core functions
	initializeBallsAndDraw();
  app.ticker.add(motion);
  app.ticker.add(nextLevel);
  app.ticker.add(end);

  // Add three events (mousemove, touchmove) listener to our document
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener("touchmove", onTouchMove);
}

// function that displayes object in a given time
function displayText(objectToDisplay, duration, startTime) {
	function helper() {
		// update time
		let date = new Date();
		let timeElapsed = date.getTime() - n;

		if ((startTime < timeElapsed) && (timeElapsed < startTime + duration)) {
			objectToDisplay.alpha = 100;
		}
		else {
			objectToDisplay.alpha = 0;
		}
	}
	return helper;
}

// initialize balls and their random velocity
function initializeBallsAndDraw() {
	// store all balls graphics to allGraphic, velocity to allGraphicVelocity
	allGraphic = [];
	allGraphicVelocity = [];

	// create birs
	for (let i = 0; i < ballNumber; i++) {
		// create an animated sprite
		let animatedBird = new PIXI.extras.AnimatedSprite(textureArrayBird);

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
		animatedReward.alpha = 100;
		animatedBoomBaloon.alpha = 100;

		// check if need to display text (130000 means 13s, 10s
		// for each level, 3s for display text)
		if (timeElapsed > (levelTime - 50) + curretLevels*(levelTime + waitLevelTime)) {
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
			// play star dust sound
			var starDust = PIXI.sound.Sound.from('/dodgeball-test-version/assets/sound/starDust.mp3');
			starDust.play();

			app.stage.removeChild(animatedReward);
			rewardScore = rewardScore + 10 + 2*curretLevels;
			rewardPresent = false;
			starCount += 1;
		};

		//update score and time
		score = rewardScore + Math.floor((timeElapsed - curretLevels*waitLevelTime) / scale)
		scoreText.text = score + "pts";

		timePassing = 1 + Math.floor((timeElapsed - curretLevels*waitLevelTime)/ 1000);
		miniutes = Math.floor(timePassing / 60);
		seconds = timePassing % 60;
		if (miniutes < 10) {
			miniutes = "0" + miniutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		timeText.text = miniutes + ":" + seconds;
		starText.text = "X" + " " + starCount;

		levelInfoText.text = "Level: " + (curretLevels + 1);

		// update red balls' position
		for (let j = 0; j < allGraphic.length; j++) {
			let xPos = allGraphic[j].x + allGraphicVelocity[j][0];
			let yPos = allGraphic[j].y + allGraphicVelocity[j][1];
			if (xPos > xSize || xPos < 0) {
				allGraphicVelocity[j][0] = -allGraphicVelocity[j][0];
			};
			if (yPos > ySize || yPos < hudBarHeight) {
				allGraphicVelocity[j][1] = -allGraphicVelocity[j][1];
			};
			allGraphic[j].x += allGraphicVelocity[j][0];
			allGraphic[j].y += allGraphicVelocity[j][1];
		};

		// update reward's position
		rewardXPos = animatedReward.x;
		rewardYPos = animatedReward.y;

//-------needs to modified below for more efficient---------
		// update cloud position
		if (largeCloudContainer.x < -app.screen.width) {
			largeCloudContainer.x = app.screen.width;
		} else if (largeCloudContainer2.x < -app.screen.width) {
			largeCloudContainer2.x = app.screen.width;
		} else {
			largeCloudContainer.x -= largeCloudSpeed;
			largeCloudContainer2.x -= largeCloudSpeed;
		};

		if (medianCloudContainer.x < -app.screen.width) {
			medianCloudContainer.x = app.screen.width;
		} else if (medianCloudContainer2.x < -app.screen.width) {
			medianCloudContainer2.x = app.screen.width;
		} else {
			medianCloudContainer.x -= medianCloudSpeed;
			medianCloudContainer2.x -= medianCloudSpeed;
		};

		if (smallCloudContainer.x < -app.screen.width) {
			smallCloudContainer.x = app.screen.width;
		} else if (smallCloudContainer2.x < -app.screen.width) {
			smallCloudContainer2.x = app.screen.width;
		} else {
			smallCloudContainer.x -= smallCloudSpeed;
			smallCloudContainer2.x -= smallCloudSpeed;
		};

		if (light.x < -app.screen.width) {
			light.x = app.screen.width;
		} else if (light2.x < -app.screen.width) {
			light2.x = app.screen.width;
		} else {
			light.x -= lightSpeed;
			light2.x -= lightSpeed;
		};
//-------needs to modified above for more efficient----------

		if (rewardXPos > xSize || rewardXPos < 0) {
			rewardXSpeed = -rewardXSpeed;
		};
		if (rewardYPos > ySize || rewardYPos < hudBarHeight) {
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
		curretLevels*(levelTime + waitLevelTime) && collided() && !(endGame)) {

		// play balloon boom sound
		var ballonBoom = PIXI.sound.Sound.from('/dodgeball-test-version/assets/sound/balloonBoom.mp3');
		ballonBoom.play();

		animatedBoom.x = animatedBoomBaloon.x;
    animatedBoom.y = animatedBoomBaloon.y;
    animatedBoom.alpha = 100;
    animatedBoomBaloon.alpha = 0;
    animatedBoom.play();

    endGame = true;
    timefromEnd = d.getTime();

    // remove ever motion related functions
    app.ticker.remove(motion);
    app.ticker.remove(nextLevel);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener("touchmove", onTouchMove);
  };
    //app.ticker.add(boom);
  var timeNow = new Date().getTime();
  var timePass = timeNow - timefromEnd;
	if (endGame & (timePass > boomAnimationTime)){
	//if (endGame & (timePass > 1430)){
    animatedBoom.alpha = 0
    app.ticker.stop();　　
		scoreText.alpha = 0;

		/*// clean the screen
		for (var i = app.stage.children.length - 1; i >= 0; i--) {
			app.stage.removeChild(app.stage.children[i]);
		};*/

		// read final score and display to the screen
		var endTextScore = new PIXI.Text("  Score: "+ score, {
			font: 'Nunito',
			fontWeight: 'bold',
			fill: '0xffffff',
			fontSize: 90
		});
		endTextScore.x = app.screen.width / 2 - 203;
		endTextScore.y = app.screen.height / 2 - 525;

		app.stage.addChild(gameOver);
		app.stage.addChild(scoreBar);
		app.stage.addChild(endTextScore);
	// return score, time
  }

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
		app.ticker.remove(announcementDisplay);

		// make levelInfoText invisible during the game
		levelText.alpha = 0;
		repeat();
	};
};

// repeat the game process after finishing one level
function repeat() {
	let rewardXSpeed = Math.floor(Math.random() * 2) + 3;
	let rewardYSpeed = Math.floor(Math.random() * 2) + 3;
	rewardPresent = true;
	app.stage.addChild(light);
	app.stage.addChild(light2);

	app.stage.addChild(dotContainer);
	app.stage.addChild(smallCloudContainer);
	app.stage.addChild(medianCloudContainer);
	app.stage.addChild(largeCloudContainer);
	app.stage.addChild(smallCloudContainer2);
	app.stage.addChild(medianCloudContainer2);
	app.stage.addChild(largeCloudContainer2);

	app.stage.addChild(animatedReward);
	app.stage.addChild(animatedBoomBaloon);
  app.stage.addChild(animatedBoom);

	app.stage.addChild(hudBar);
	app.stage.addChild(scoreText);
	app.stage.addChild(starImg);
	app.stage.addChild(starText);

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

		if (((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) >= hudBarHeight + baloonRadius) &&
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

		if (((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) >= hudBarHeight + baloonRadius) &&
			 ((animatedBoomBaloon.y + (currentmouseY - lastmouseY) / distScalar) <= ySize - hudBarHeight - baloonRadius)){
			animatedBoomBaloon.y += (currentmouseY - lastmouseY) / distScalar;
		};
	};
	lastmouseX = currentmouseX;
	lastmouseY = currentmouseY;
};
