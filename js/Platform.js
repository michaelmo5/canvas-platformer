class Platform {
	constructor(){
		this.x = 500;
		this.y = 500;
		this.length = Math.ceil(Math.random() * 300) + 200;
	}

	render(){
		// Draw position Circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2*PI);
		ctx.stroke();

		// Draw length line
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.length, this.y);
		ctx.stroke();

		let t_left = ASSETS.get('tile_LEFT');
		let t_mid = ASSETS.get('tile_MID');
		let t_right = ASSETS.get('tile_RIGHT');

		// Draw middle
		let mid_width = this.length - t_left.width - t_right.width;
		let times_fit = mid_width / t_mid.width;
		let repeat = Math.ceil(times_fit);
		let ratio = times_fit / repeat;

		for(let i=0; i<repeat; i++){
			ctx.drawImage(t_mid, this.x + t_left.width + (i * t_mid.width * ratio), this.y, t_mid.width * ratio + 1, t_mid.height);
		}

		// Draw corners
		ctx.drawImage(t_left, this.x, this.y);
		ctx.drawImage(t_right, this.x + this.length - 70, this.y);
	}
}