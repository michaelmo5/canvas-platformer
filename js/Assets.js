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
}