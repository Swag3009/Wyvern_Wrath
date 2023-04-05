//  States of game
const START = 0;
const PLAY = 1;
const END  = 2;
const WON  = 3;
let gameState = START;

//  Player choice to use keyboard or mouse
const MOUSE = 10;
const KEYBOARD = 11;
let userChoice = MOUSE;

//  Images used in the game
let mrHeroImg, backgroundImg, fireImg, lifeImg;
let dragonImg = [];

//  Sounds used in the game
let fireSound, lifeReduceSound, levelUpSound, dragonScreech, btnClickSound;
let startBgSound, overBgSound, playBgSound;

//  Font
let font = [];

//  Game characters
let fires, dragons, mrHero;

//  Feeedback
let lives = [];
let score = 0;
let level = 1;

//  LevelUp
let difficultyLevel = {
    level1:{
        rateOfDragonCreation: 0.03,
        speedOfDragons: -5
    },
    level2:{
        rateOfDragonCreation: 0.04,
        speedOfDragons: -8
    },
    level3:{
        rateOfDragonCreation: 0.06,
        speedOfDragons: -10
    },
    level4:{
        rateOfDragonCreation: 0.08,
        speedOfDragons: -13
    },
    level5:{
        rateOfDragonCreation: 0.1,
        speedOfDragons: -16
    },
}

//  START gamestate
let mouseCheckbox, keyboardCheckbox, soundPermission;
let startBtn;

//  End gamestate
let retryBtn;

//  Won gamestate
let replayBtn

function preload(){
    //  Images
    mrHeroImg = loadImage("assets/mrHero.png");
    backgroundImg = loadImage("assets/background.png");
    lifeImg = loadImage("assets/life.png");
    for(let i = 0; i < 9; i++){
        dragonImg[i] = loadImage(`assets/dragon${i+1}.png`);
    }

    //  Loading Font
    font[0] = loadFont("assets/nature-spirit-font/NatureSpiritRough-z8mJD.otf");
    font[1] = loadFont("assets/nature-spirit-font/NatureSpirit-jE7RM.otf");
    font[2] = loadFont("assets/nature-spirit-font/HerrVonMuellerhoff-Regular.ttf");

    //  Animations
    fireImg = loadAnimation("assets/fire1.png", "assets/fire2.png", "assets/fire3.png", "assets/fire4.png");

    //  Sounds
    fireSound = loadSound("assets/sounds/fireSound.mp3");
    levelUpSound = loadSound("assets/sounds/levelUpSound.wav");
    lifeReduceSound = loadSound("assets/sounds/lifeReduceSound.wav");
    playBgSound = loadSound("assets/sounds/playBgSound.mp3");
    overBgSound = loadSound("assets/sounds/overBgSound.mp3");
    startBgSound = loadSound("assets/sounds/startBgSound.mp3");
    dragonScreech = loadSound("assets/sounds/dragonScreech.mp3");
    btnClickSound = loadSound("assets/sounds/btnClickSound.mp3");
}

function setup(){
    new Canvas(0, 0, windowWidth, windowHeight);
    playSetup();
    startSetup();
}

function draw(){
    background(backgroundImg);
    textFont(font[2], 25);
    text("Swagatika", width -50, height-15);
    fill(255, 255, 255);

    if(gameState === PLAY){
        playState();
    }else if(gameState === END){
        endState();
    }else if(gameState === WON){
        wonState();
    }else if(gameState === START){
        startState();
    }
}

//  Start State functions
function startSetup(){
    mouseCheckbox = createCheckbox('   Mouse', true);
    mouseCheckbox.changed(userChoiceCheckedEvent);
    mouseCheckbox.position(width - 170, 30);
    mouseCheckbox.class('mouseCheckbox');

    keyboardCheckbox = createCheckbox('   Keyboard', false);
    keyboardCheckbox.changed(userChoiceCheckedEvent);
    keyboardCheckbox.position(width - 170, 55);
    keyboardCheckbox.class('keyboardCheckbox');

    soundPermission = createCheckbox('   Sound', false);
    soundPermission.changed(soundCheckedEven);
    soundPermission.position(width - 170, 80);
    soundPermission.class('soundPermission');

    startBtn = createElement('button', "START");
    startBtn.position(width/2 - 132, height/2+80);
    startBtn.class('startBtn')
    startBtn.mouseClicked(()=>{
        btnClickSound.play();
        startBtn.remove();
        mouseCheckbox.remove();
        keyboardCheckbox.remove();
        soundPermission.remove();
        gameState = PLAY;
    })    
}

function startState(){
    //startBgSound.loop();
    textFont(font[1], 170);
    textAlign(CENTER);
    textStyle(BOLD);
    text("W Y V E R N  W R A T H", width/2, height/2);
    fill(255, 255, 255);
}

function userChoiceCheckedEvent() {
    if(mouseCheckbox.checked() && keyboardCheckbox.checked()){
        userChoice = KEYBOARD;
    }else if(mouseCheckbox.checked()){
        userChoice = MOUSE;
    }else if(keyboardCheckbox.checked()){
        userChoice = KEYBOARD;
    }else{
        userChoice = MOUSE;
    }
}

function soundCheckedEven(){
    if(soundPermission.checked() && gameState !== END){
        playBgSound.loop();
    }else{
        playBgSound.stop();
    }
}

//  Play State functions
function playSetup(){
    //  creating mrHero
    mrHero = new Hero();

    //  Generating 5 lives
    for(let i = 0; i < 5; i++){
        lives[i] = new Life(width - 270 - (i*40), 25, 30);
    }

    //  Creating Fire group & assigning properties
    fires = new Group();
    fires.x = mrHero.x+90;
    fires.vel.x = 10;
    fires.addAni(fireImg);
    fires.scale = 0.07;
    fires.d = 500
    fires.debug = false

    //  Creating Dragon group & assigning properties
    dragons = new Group();
    dragons.x = width + 30;
    dragons.d = 200
    dragons.scale = 0.3;
    dragons.vel.x = difficultyLevel["level"+level].speedOfDragons;
    dragons.debug = false
}

function playState(){
    //  Generating dragons
    if(random(1) < difficultyLevel["level"+level].rateOfDragonCreation){
        createDragons();
    }

    //  Displaying Score
    textFont(font[0], 36);
    text("S c o r e :  "+ score, width - 120, 47);
    text("L e v e l :  "+ level, 100, 47);
    fill(255, 255, 255);

    mrHero.show();
    mrHero.move(userChoice);

    // Displaying lives
    for(let life of lives){
        life.show();
    }

    //  Distroying dragons and fires when collide
    fires.overlaps(dragons, (fire, dragon) => {
        //hitSound.play();
        fire.remove();
        dragon.remove();
        score++;

        //  Increase level with every 20 multiple of score
        if(score > 0 && score % 30 === 0 && level < 5){
            level ++;
            levelUpSound.play();
        }

        //  Changing the state of game to WON if the player scores 100
        if(score === 150){
            if(playBgSound.isPlaying()){
                playBgSound.stop();
                startBgSound.setVolume(0.3);
                startBgSound.play();
            }
            gameState = WON;
            dragons.removeAll();
            fires.removeAll();
            wonSetup()
        }
    })    

    //  Remove sprites if it gets out of the boundary 
    dragons.cull(0, 0, 100, width, (dragon)=>{
        lives.pop();
        lifeReduceSound.play();
        if(lives.length === 0){
            dragonScreech.play();
            if(playBgSound.isPlaying()){
                playBgSound.stop();
                overBgSound.setVolume(0.3);
                overBgSound.play();
            }
            gameState = END;
            endSetup();
        }
        dragon.remove();
    })
}

function mouseClicked(){
    if(gameState === PLAY){
        //  On click of mouse create fire
        let fire = new fires.Sprite();
        fire.y = mrHero.y+40;
        fireSound.play();
    }
}

function createDragons(){
    let randomIndex = Math.floor(random(0, 8));
    let dragon = new dragons.Sprite();
    dragon.y = random(120, height - 50);
    dragon.addAni(dragonImg[randomIndex]);
    dragon.removeColliders()
}

function keyPressed(){
    if(gameState === PLAY && key === ' '){
        //  On click of space button create fire
        let fire = new fires.Sprite();
        fire.y = mrHero.y+40;
        fireSound.play();
    }
}

//  Game Over State functions
function endSetup(){
    retryBtn = createElement('button', 'RETRY');
    retryBtn.position(width/2 - 131, height/2+80);
    retryBtn.class('retryBtn')
    retryBtn.mouseClicked(()=>{
        btnClickSound.play();
        window.location.reload();
    })    
}

function endState(){
    textFont(font[1], 170);
    textAlign(CENTER);
    textStyle(BOLD);
    text("G A M E  O V E R", width/2, height/2);
    fill(255, 255, 255);
}

//  Game Own State functions
function wonSetup(){
    replayBtn = createElement('button', 'REPLAY');
    replayBtn.position(width/2 - 131, height/2+80);
    replayBtn.class('replayBtn');
    replayBtn.mouseClicked(()=>{
        btnClickSound.play();
        window.location.reload();
    })    
}

function wonState(){
    textFont(font[1], 170);
    textAlign(CENTER);
    textStyle(BOLD);
    text("Y O U  W O N ! ! !", width/2, height/2);
    fill(255, 255, 255);
}

