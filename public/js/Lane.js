function Lane(scene, loader) {
	this.scene = new THREE.Object3D()
	scene.add(this.scene)
	this.cells = [];
    this.units = [];

	//this.position = position
	for (var i = 0; i < Game.config.lane.cellNumber; i++ ){
		var cell = new Cell(this.scene, loader);
		cell.scene.translateX( i )
		this.cells.push(cell)

		if (i < Game.config.nature.initOwnedCells) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - Game.config.newYork.initOwnedCells) {
			cell.setOwner("newYork")
		}
	}
}

Lane.prototype.capture = function(type, value){
	if (type == HQ.typesEnum.NATURE) {
		for (var i = 0; i < Game.config.lane.cellNumber; i++) {
			if (this.cells[i].owner == null) {
				this.cells[i].capture(value)
				break
			}
		}
	}
}

Lane.prototype.update = function(time, dt){
	for (var i = 0; i < this.cells.length; i++){
		this.cells[i].update(time, dt);
	}
    for (var i = 0; i < this.units.length; i++){
		this.units[i].update(time, dt);
	}
}
