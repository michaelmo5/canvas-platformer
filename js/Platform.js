class Platform {
	constructor(){
		this.x = 500;
        this.y = 500;
        
        this.mid_count = randomInt(0, 5);

        this.asset_left = ASSETS.get('tile_LEFT');
		this.asset_mid = ASSETS.get('tile_MID');
        this.asset_right = ASSETS.get('tile_RIGHT');
        
        this.width = this.asset_left.width + (this.asset_mid.width * this.mid_count) + this.asset_right.width;
        this.height = Math.max(this.asset_left.height, this.asset_mid.height, this.asset_right.height);
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
		ctx.lineTo(this.x + this.width, this.y);
		ctx.stroke();

        // Draw corners
        ctx.drawImage(this.asset_left, this.x, this.y);
        ctx.drawImage(this.asset_right, this.x + this.width - this.asset_right.width, this.y);

        // Draw middle
        for(let i=0; i<this.mid_count; i++){
            ctx.drawImage(this.asset_mid, this.x + this.asset_left.width + (i * this.asset_mid.width), this.y);
        }
	}
}