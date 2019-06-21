PIXI.utils.sayHello();

// var xSize = Math.min(window.innerWidth - 20, 1080); // 800 originally
// var ySize = window.innerHeight - 20; // 600 originally

// resizing the sprities to phone screen
var nonscaled_xSize = window.innerWidth - 20; // 800 originally
var nonscaled_ySize = window.innerHeight - 20; // 600 originally
if (nonscaled_xSize > nonscaled_ySize) {
	xSize = nonscaled_ySize / 3 * 2;
	ySize = nonscaled_ySize;
}
else {
	ySize = nonscaled_ySize;
	xSize = nonscaled_xSize;
}

// find the propoer factor to resize
xRatio = xSize / 960
yRatio = ySize / 1395
resizingFactor = Math.min(xRatio, yRatio)

// current time
var d = new Date();
var n = d.getTime();

// -------------Balls Variables-----------------
// starting position of other balls
var xStart = Math.round(800 * xRatio);
var yStart = Math.round(400 * yRatio);

// startign position of the player's ball
var xPlayerStart = Math.round(300 * xRatio);
var yPlayerStart = Math.round(400 * yRatio);

// radius of the baloon
var baloonRadius = Math.round(50 * xRatio);

// radius of the ball
var ballRadius = Math.round(30 * xRatio);

// the size of valid collision
var collidedSize = Math.round(60 * xRatio);

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
var scale = 1000 ;
var rewardScore = 0;

// number of star captured
var starCount = 0;

// height of hud bar
var hudBarHeight = 60 * yRatio;

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
var boomAnimationSpeed = 0.35;
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
for (let i=0; i < 400; i++) {
	var dot = new PIXI.Sprite(dotTexture);
	dot.anchor.set(0.5);
  dot.x = (i % 20) * 128;
  dot.y = Math.floor(i / 20) * 128;
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
	cloud.x = Math.round(smallCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(smallCloudPosition[i][1] * yRatio);
	cloud.scale.x = 0.5 * resizingFactor;
	cloud.scale.y = 0.5 * resizingFactor;
	cloud.alpha = 0.5;
	smallCloudContainer.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = Math.round(smallCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(smallCloudPosition[i][1] * yRatio);
	cloud.scale.x = 0.5 * resizingFactor;
	cloud.scale.y = 0.5 * resizingFactor;
	cloud.alpha = 0.5;
	smallCloudContainer2.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = Math.round(medianCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(medianCloudPosition[i][1] * yRatio);
	cloud.scale.x = 0.75 * resizingFactor;
	cloud.scale.y = 0.75 * resizingFactor;
	cloud.alpha = 0.8;
	medianCloudContainer.addChild(cloud);
};

for (let i = 0; i<3; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = Math.round(medianCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(medianCloudPosition[i][1] * yRatio);
	cloud.scale.x = 0.75 * resizingFactor;
	cloud.scale.y = 0.75 * resizingFactor;
	cloud.alpha = 0.8;
	medianCloudContainer2.addChild(cloud);
};

for (let i = 0; i<2; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = Math.round(largeCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(largeCloudPosition[i][1] * yRatio);
	cloud.scale.x = resizingFactor;
	cloud.scale.y = resizingFactor;
	largeCloudContainer.addChild(cloud);
};

for (let i = 0; i<2; i++){
	let cloud = new PIXI.Sprite(cloudTexture);
	cloud.anchor.set(0.5);
	cloud.x = Math.round(largeCloudPosition[i][0] * xRatio);
	cloud.y = Math.round(largeCloudPosition[i][1] * yRatio);
	cloud.scale.x = resizingFactor;
	cloud.scale.y = resizingFactor;
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
starImg.x = Math.round(20 * xRatio);
starImg.y = 0;
starImg.scale.x = 1.3 * resizingFactor;
starImg.scale.y = 1.3 * resizingFactor;
app.stage.addChild(starImg);

// number of star captured in text
var starText = new PIXI.Text("X" + " " + starCount, {fontSize: 35 * resizingFactor});
starText.x = Math.round(70 * xRatio);
starText.y = Math.round(10 * yRatio);
app.stage.addChild(starText);

// currect score text
var scoreText = new PIXI.Text(0 + "pts", {
	fontSize: Math.round(50 * resizingFactor),
	fontFamily: 'Nunito',
	fontWeight: 'bold',
	fill: '0xfaff07'});
scoreText.x = Math.round(app.screen.width / 2 - 80 * xRatio);
scoreText.y = 0;
app.stage.addChild(scoreText);

// time of survival
var timeText = new PIXI.Text("00:00", {
	fontSize: Math.round(30 * resizingFactor)
});
timeText.x = Math.round(app.screen.width - 160 * xRatio);
timeText.y = 0;
app.stage.addChild(timeText);

// level info
var levelInfoText = new PIXI.Text("Level: " + curretLevels, {
	fontSize: Math.round(30 * resizingFactor)});
levelInfoText.x = Math.round(app.screen.width - 160 * xRatio);
levelInfoText.y = Math.round(30 * yRatio);
app.stage.addChild(levelInfoText);

// ----------------- end screen ---------------------------
var gameOver = new PIXI.Sprite.from('/dodgeball-test-version/img/gameOver.png');
gameOver.x = Math.round(app.screen.width / 2 - 330 * xRatio);
gameOver.y = Math.round(app.screen.height / 2 - 50  * yRatio);
gameOver.scale.x = 2 * resizingFactor;
gameOver.scale.y = 2 * resizingFactor;

var scoreBar = new PIXI.Sprite.from('/dodgeball-test-version/img/scoreBar.png');
scoreBar.x = Math.round(app.screen.width / 2 - 330 * xRatio);
scoreBar.y = Math.round(app.screen.height / 2 - 550 * yRatio);
scoreBar.scale.x = 2 * resizingFactor;
scoreBar.scale.y = 2 * resizingFactor;

// ---------------- text elements --------------------------

// UI text
var levelText = new PIXI.Text("Next Level", {
			fontWeight: 'bold',
			fontStyle: 'italic',
			fontSize: Math.round(80 * resizingFactor)
});
levelText.x = Math.round(app.screen.width / 2 - 180 * xRatio);
levelText.y = Math.round(app.screen.height / 2 - 50 * yRatio);
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

var cloudGreenFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/cloudLarge.png');
cloudGreenFigure.alpha = 0;
app.stage.addChild(cloudGreenFigure);

// the scale variables for cloud figure
var cloudFigureScaleX = 1.5 * resizingFactor;
var cloudFigureScaleY = 1.5 * resizingFactor;
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
threeFigure.scale.x = 2 * resizingFactor;
threeFigure.scale.y = 2 * resizingFactor;
app.stage.addChild(threeFigure);

var twoFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/twoComplete.png');
twoFigure.alpha = 0;
twoFigure.scale.x = 2 * resizingFactor;
twoFigure.scale.y = 2 * resizingFactor;
app.stage.addChild(twoFigure);

var oneFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/oneComplete.png');
oneFigure.alpha = 0;
oneFigure.scale.x = 2 * resizingFactor;
oneFigure.scale.y = 2 * resizingFactor;
app.stage.addChild(oneFigure);

var goFigure = new PIXI.Sprite.from('/dodgeball-test-version/img/goComplete.png');
goFigure.alpha = 0;
goFigure.scale.x = 2 * resizingFactor;
goFigure.scale.y = 2 * resizingFactor;
app.stage.addChild(goFigure);

// cloud position parameters
var figurePositionX = Math.round(30 * xRatio);
var figurePositionY = Math.round(50 * yRatio);
cloudRedFigure.x = figurePositionX;
cloudRedFigure.y = figurePositionY;
cloudBlueFigure.x = figurePositionX;
cloudBlueFigure.y = figurePositionY;
cloudYellowFigure.x = figurePositionX;
cloudYellowFigure.y = figurePositionY;
cloudGreenFigure.x = figurePositionX;
cloudGreenFigure.y = figurePositionY;

// the position of the figures
var numFigPosX = Math.round(app.screen.width / 2 - 150 * xRatio);
var numFigPosY = Math.round(app.screen.height / 2 + 50 * yRatio);
threeFigure.x = numFigPosX;
threeFigure.y = numFigPosY;
twoFigure.x = numFigPosX;
twoFigure.y = numFigPosY;
oneFigure.x = numFigPosX;
oneFigure.y = numFigPosY;
goFigure.x = Math.round(app.screen.width / 2 - 250 * xRatio);
goFigure.y = Math.round(app.screen.height / 2 + 50 * yRatio);

threeBalloonPosition = [[numFigPosX - 85*xRatio, numFigPosY + 205*yRatio],
 												[numFigPosX + 200*xRatio, numFigPosY - 140*yRatio],
												[numFigPosX + 300*xRatio, numFigPosY + 275*yRatio]];
twoBalloonPosition = [[numFigPosX - 60*xRatio, numFigPosY - 140*yRatio],
 											[numFigPosX + 300*xRatio, numFigPosY + 275*yRatio]];
oneBalloonPosition = [[numFigPosX + 200*xRatio, numFigPosY - 145*yRatio]];

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
	balloon.x = Math.round(threeBalloonPosition[i][0]);
	balloon.y = Math.round(threeBalloonPosition[i][1]);
	balloon.scale = new PIXI.Point (resizingFactor, resizingFactor);
	threeBalloonContainer.addChild(balloon)
}

for (let i = 0; i < 2; i++) {
	var balloon = new PIXI.Sprite.from('/dodgeball-test-version/img/balloon.png');
	balloon.x = Math.round(twoBalloonPosition[i][0]);
	balloon.y = Math.round(twoBalloonPosition[i][1]);
	balloon.scale = new PIXI.Point (resizingFactor, resizingFactor);
	twoBalloonContainer.addChild(balloon)
}

for (let i = 0; i < 1; i++) {
	var balloon = new PIXI.Sprite.from('/dodgeball-test-version/img/balloon.png');
	balloon.x = Math.round(oneBalloonPosition[i][0]);
	balloon.y = Math.round(oneBalloonPosition[i][1]);
	balloon.scale = new PIXI.Point (resizingFactor, resizingFactor);
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
	animatedReward.scale = new PIXI.Point (resizingFactor, resizingFactor);
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
	animatedBoomBaloon.scale = new PIXI.Point (resizingFactor, resizingFactor);

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
	animatedBoom.scale = new PIXI.Point (resizingFactor, resizingFactor);

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
		animatedBird.scale = new PIXI.Point (resizingFactor, resizingFactor);

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
			var starDust = PIXI.sound.Sound.from('/dodgeball-test-version/assets/sound/starDust_01.mp3');
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

// return true if the palyer collided with the balls
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
		var ballonBoom = PIXI.sound.Sound.from('/dodgeball-test-version/assets/sound/balloonBoom_01.mp3');
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
			fontSize: Math.round(90 * resizingFactor)
		});

		function getBaseLog(x, y) {
  		return Math.log(y) / Math.log(x);
		};

		// optimize the text pisition according to the socre
		var offPixel = getBaseLog(10, score);
		endTextScore.x = app.screen.width / 2 - 203 * xRatio - 10*offPixel;
		endTextScore.y = app.screen.height / 2 - 525 * yRatio;

		app.stage.addChild(gameOver);
		app.stage.addChild(scoreBar);
		app.stage.addChild(endTextScore);
	 //return [score, time];
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
