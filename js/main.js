const PI = Math.PI;
const canvas = document.querySelector('#mainCanvas');
const ctx = canvas.getContext("2d");

var resolution = {x: 1920, y: 1080};

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

const GRAVITY = 1500;

var PLAYER;
var ASSETS;
var WORLD;
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
	WORLD = new World();
}

function update(deltaTime){
	// Level
	WORLD.update(deltaTime);

	// Player
	PLAYER.update(deltaTime);
}

function render(){
	clear();

	// BG
	ctx.globalAlpha = 0.5;
	ctx.drawImage(ASSETS.get('BG'), 0, 0);
	ctx.globalAlpha = 1;

	// Level
	WORLD.render();

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