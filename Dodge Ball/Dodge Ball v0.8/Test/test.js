var app = new PIXI.Application(800, 600, {backgroundColor : 0xe0e4ff});
document.body.appendChild(app.view);

/*PIXI.loader
    .add("../img/boomBaloon.json")
    .load(setup);*/

PIXI.loader
    //.add("/dodgeball-test-version/img/boomBaloon.json")
    //.add("/dodgeball-test-version/img/bird.json")
    .add("/dodgeball-test-version/img/starAlive.json")
    .load(setup);

function setup() {
    /*let textureArrayBaloon = [];

    for (let i=0; i < 7; i++)
    {
         let textureBaloon = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BaloonAssets_0" + (i+1) + ".png");
         textureArrayBaloon.push(textureBaloon);
    };

    // create an animated sprite
    let animatedBoomBaloon = new PIXI.extras.AnimatedSprite(textureArrayBaloon);
    animatedBoomBaloon.animationSpeed = 0.167;
    animatedBoomBaloon.play();
    app.stage.addChild(animatedBoomBaloon);


    // bird
    let textureArrayBird = [];

    for (let i= 0; i < 8; i++)
    {
         let textureBird = PIXI.Texture.from("FLOURISH-_BoomBaloon-_BirdAssets_0" + (i+1) + ".png");
         textureArrayBird.push(textureBird);
    };

    // create an animated sprite
    let animatedBird = new PIXI.extras.AnimatedSprite(textureArrayBird);

    // set speed, start playback and add it to the stage
    animatedBird.position.x = 100
    animatedBird.animationSpeed = 0.167;
    animatedBird.play();
    app.stage.addChild(animatedBird);*/

    // reward
  	let textureArrayReward = [];

  	for (let i=0; i < 6; i++)
  	{
  			 let textureReward = PIXI.Texture.from("FLOURISH-_BoomBaloon-_StarAssets_0" + (i+1) + ".png");
  			 textureArrayReward.push(textureReward);
  	};

  	// create an animated sprite
  	let animatedReward = new PIXI.extras.AnimatedSprite(textureArrayReward);
  	// set speed, start playback and add it to the stage
  	animatedReward.animationSpeed = 0.167;
  	animatedReward.play();

    // set the pivot to the center of the reward
    //animatedBoomBaloon.pivot.x = 53;
    //nimatedBoomBaloon.pivot.y = 65;

    // set the starting position
  	animatedReward.x = 50;
  	animatedReward.y = 50;
  	app.stage.addChild(animatedReward);
  }
