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

		this.duck = false;
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

		// Duck
		if(17 in KEYS || 83 in KEYS || 40 in KEYS){
			this.duck = true;
		} else {
			this.duck = false;
		}

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

		if(this.duck){
			this.a = ASSETS.get('P1_DUCK');
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
}