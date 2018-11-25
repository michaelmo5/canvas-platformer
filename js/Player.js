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

		this.in_air = false;

		this.duck = false;

		this.move_with_platform = false;
		this.moving_platform_index = 0;

		this.prevPOS = {x: this.x, y: this.y};
	}

	update(deltaTime){
		this.prevPOS = {x: this.x, y: this.y};

		this.in_air = true;

		// Jumping control
		if(!this.jumping && 32 in KEYS){ this.jumping = true; delete KEYS[32]; }

		// Jumping
		if(this.jumping && this.jumpCount < 2){
			this.speedY = -800;
			this.jumpCount++;
			this.jumping = false;

			WORLD.moving = true;
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
		let base = WORLD.objects[0];
		if(this.y >= base.y){
			this.y = base.y;
			this.jumpCount = 0;
			this.jumping = false;

			this.in_air = false;
			this.move_with_platform = false;
		}

		if(this.in_air){
			this.move_with_platform = false;

			// Jump on other platforms
			let playerObj = this;
			WORLD.objects.forEach((p, index) => {
				if(p.type == 'platform' && index > 0){
					if(
						playerObj.x < p.x + p.width &&
						playerObj.x + playerObj.a.width > p.x &&
						playerObj.y >= p.y &&
						playerObj.prevPOS.y <= p.y
					){
						playerObj.y = p.y;
						playerObj.speedY = playerObj.speedY < 0 ? playerObj.speedY : 0;
						playerObj.jumpCount = 0;
						playerObj.jumping = false;

						playerObj.in_air = false;
						playerObj.move_with_platform = true;
						playerObj.moving_platform_index = index;
					}
				}
			});
		}

		if(this.move_with_platform && this.speedX == 0 && this.moving_platform_index > 0){
			let movingPlatform = WORLD.objects[this.moving_platform_index];
			if(movingPlatform.moving){
				if(movingPlatform.dir){
					// Right
					this.x += movingPlatform.move_speed * deltaTime;
				} else {
					// Left
					this.x -= movingPlatform.move_speed * deltaTime;
				}

				this.y = movingPlatform.y;
			}
		}

		// Asset change on move
		if(this.speedX != 0 && !this.in_air){
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
		if(this.in_air){
			this.a = ASSETS.get('P1_JUMP');
		}

		if(this.duck){
			this.a = ASSETS.get('P1_DUCK');
		}

		// Screen borders cap
		if(this.x <= 0){
			this.x = 0;
		}

		if(this.x >= resolution.x - this.a.width){
			this.x = resolution.x - this.a.width;
		}

		// GameOver
		if(this.y > resolution.y){
			gameON = false;
			alert('Game Over! Score: ' + WORLD.score);
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