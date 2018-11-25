class World {
	constructor(){
		this.x = 0;
		this.y = 0;

		this.objects = [];

		let wo = new Platform();
		this.objects.push(wo);
	}

	update(deltaTime){
		// this.objects.forEach((o) => {
		// 	o.update(deltaTime);
		// });
	}

	render(){
		this.objects.forEach((o) => {
			o.render();
		});
	}
}