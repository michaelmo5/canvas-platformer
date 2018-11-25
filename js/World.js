class World {
	constructor(){
		this.x = 0;
        this.y = 0;

        // World objects with type parameter
		this.objects = [];

        let base = new Platform(-100, (2/3) * resolution.y, 50);
        base.moving = false;
        this.objects.push(base);

        this.next_dir = randomInt(0, 1) == 1;    // true - Right, false - Left
        this.gen(5);
	}

	update(deltaTime){
		this.objects.forEach((o) => {
			o.update(deltaTime);
		});
    }
    
    gen(count){
        let base = this.objects[0];

        for(let i=0; i<count; i++){
            let new_x = randomInt(0, resolution.x - (2 * base.asset_left.width));
            let new_y =  Math.floor(base.y - this.objects.length * 200);

            let wo = new Platform(new_x, new_y);
            wo.dir = 1*this.next_dir;
            this.next_dir = !this.next_dir;
		    this.objects.push(wo);
        }
    }

	render(){
		this.objects.forEach((o) => {
			o.render();
		});
	}
}