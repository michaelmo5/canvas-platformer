const PI = Math.PI;
const canvas = document.querySelector('#mainCanvas');
const ctx = canvas.getContext("2d");

var resolution = {x: 1920, y: 1080};

const GRAVITY = 1500;

function clear(){
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, resolution.x, resolution.y);
}

function resizeCanvas() {
	canvas.width = resolution.x = window.innerWidth;
	canvas.height = resolution.y =  window.innerHeight;
}

window.addEventListener('resize', function(){
	resizeCanvas();
});

class Assets {
	constructor(callback){
		// Run callback after all images are loaded
		this.callback = callback;

		this.toLoad = [];	// Temp array of objects to load
		this.list = {};		// List of loaded objects

		this.assetsLoaded = false;
	}

	add(src, name){
		let a = {
			src: src,
			name: name,
			loaded: false
		};

		this.toLoad.push(a);
	}

	get(name){
		return this.list[name];
	}

	load(){
		let thisObj = this;

		this.toLoad.forEach((a) => {
			let img = new Image();
			img.src = a.src;
			img.onload = function() {
				a.loaded = true;
				thisObj.doneLoading();
			};
			this.list[a.name] = img;
		});
	}

	doneLoading(){
		if(!this.assetsLoaded){
			let allLoaded = true;
			this.toLoad.forEach((a) => {
				if(a.loaded == false){
					allLoaded = false;
				}
			});

			if(allLoaded){
				this.assetsLoaded = true;
				this.callback();
			}
		}
	}
};

class Player {
	constructor(){
		this.x = 100;
		this.y = 200;
		this.a = ASSETS.get('PLAYER_1');
		this.keyFrame = 0;
		this.aimationUpdateInterval = 30;
		this.lastAniFrame = 0;

		this.speedY = 0;
		this.speedX = 0;

		this.jumping = false;
		this.jumpCount = 0;
	}

	update(deltaTime){
		// Jumping control
		if(!this.jumping && 32 in KEYS){ this.jumping = true; delete KEYS[32]; }
		// if(this.jumping && !(32 in KEYS)){ this.jumping = false; }

		// Jumping
		if(this.jumping && this.jumpCount < 2){
			this.speedY = -700;
			this.jumpCount++;
			this.jumping = false;
		}

		// Gravity
		this.speedY += deltaTime * GRAVITY;
		this.y += this.speedY * deltaTime;

		// Movement
		if(68 in KEYS || 39 in KEYS){ this.speedX = 500; }
		if(65 in KEYS || 37 in KEYS){ this.speedX = -500; }
		if(!(68 in KEYS || 39 in KEYS || 65 in KEYS || 37 in KEYS)) {
			this.speedX = 0;
			this.a = ASSETS.get('PLAYER_1');
			this.keyFrame = 0;
		}
		this.x += this.speedX * deltaTime;

		// Stop falling
		if(this.y >= 2 * resolution.y / 3){
			this.y = 2* resolution.y / 3;
			this.jumpCount = 0;
			this.jumping = false;
		}

		// Asset change on move
		if(this.speedX != 0 && this.y == 2 * resolution.y / 3){
			// Moving and not in air
			let animDelta = performance.now() - this.lastAniFrame;
			if(animDelta >= this.aimationUpdateInterval){
				if(this.keyFrame == 0 || this.keyFrame >= 11){
					this.keyFrame = 1;
				} else {
					this.keyFrame++;
				}

				this.a = ASSETS.get('p1_walk_'+this.keyFrame);
				this.lastAniFrame = performance.now();
			}
		}

		// Jump asset
		if(this.y < 2* resolution.y / 3){
			this.a = ASSETS.get('P1_JUMP');
		}
	}

	render(){
		if(this.speedX >= 0){
			// Draw image normally
			ctx.drawImage(this.a, this.x, this.y - this.a.height);
		} else {
			// Mirror asset draw
			ctx.save();
			ctx.scale(-1, 1);
			ctx.drawImage(this.a, -this.x - this.a.width, this.y - this.a.height);
			ctx.restore();
		}

		// Draw Player BOX
		ctx.lineWidth = 0.5;
		ctx.rect(this.x, this.y - this.a.height, this.a.width, this.a.height);
		ctx.stroke();

		// Draw position Circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, 2*PI);
		ctx.stroke();
	}
};

var PLAYER;
var ASSETS;
var KEYS = {};

function setup(){
	ASSETS = new Assets(mainLoop);
	ASSETS.add('./assets/bg.jpg', 'BG');

	ASSETS.add('./assets/p1_stand.png', 'PLAYER_1');
	ASSETS.add('./assets/p1_jump.png', 'P1_JUMP');
	ASSETS.add('./assets/p1_duck.png', 'P1_DUCK');

	ASSETS.add('./assets/p1_walk/p1_walk01.png', 'p1_walk_1');
	ASSETS.add('./assets/p1_walk/p1_walk02.png', 'p1_walk_2');
	ASSETS.add('./assets/p1_walk/p1_walk03.png', 'p1_walk_3');
	ASSETS.add('./assets/p1_walk/p1_walk04.png', 'p1_walk_4');
	ASSETS.add('./assets/p1_walk/p1_walk05.png', 'p1_walk_5');
	ASSETS.add('./assets/p1_walk/p1_walk06.png', 'p1_walk_6');
	ASSETS.add('./assets/p1_walk/p1_walk07.png', 'p1_walk_7');
	ASSETS.add('./assets/p1_walk/p1_walk08.png', 'p1_walk_8');
	ASSETS.add('./assets/p1_walk/p1_walk09.png', 'p1_walk_9');
	ASSETS.add('./assets/p1_walk/p1_walk10.png', 'p1_walk_10');
	ASSETS.add('./assets/p1_walk/p1_walk11.png', 'p1_walk_11');

	ASSETS.add('./assets/tiles/stoneHalfLeft.png', 'tile_LEFT');
	ASSETS.add('./assets/tiles/stoneHalfMid.png', 'tile_MID');
	ASSETS.add('./assets/tiles/stoneHalfRight.png', 'tile_RIGHT');

	ASSETS.load();

	PLAYER = new Player();
}

function update(deltaTime){
	// Player
	PLAYER.update(deltaTime);
}

function render(){
	clear();

	// BG
	ctx.globalAlpha = 0.5;
	ctx.drawImage(ASSETS.get('BG'), 0, 0);
	ctx.globalAlpha = 1;

	// Line
	ctx.beginPath();
	ctx.moveTo(0, 2*resolution.y/3);
	ctx.lineTo(resolution.x, 2*resolution.y/3);
	ctx.lineWidth = 2;
	ctx.stroke();

	// Player
	PLAYER.render();
}

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

var then = performance.now();
function mainLoop() {
	var now = performance.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
	requestAnimationFrame(mainLoop);	
}

document.addEventListener('DOMContentLoaded', function(){
    resizeCanvas();
    clear();
    setup();
});

document.addEventListener('keydown', function(e){
	if(e.keyCode != 122 && e.keyCode != 123 && e.keyCode != 116){
		e.preventDefault();
	}
	// console.log(e.keyCode);
	KEYS[e.keyCode] = true;
});

document.addEventListener('keyup', function(e){
	e.preventDefault();
	if(e.keyCode in KEYS){
		delete KEYS[e.keyCode];
	}
});