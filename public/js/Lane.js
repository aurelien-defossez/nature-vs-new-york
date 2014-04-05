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
	var i,
        unit,
        unitPositionX,
        unitToRemove = [];
    
    for (i = 0; i < this.cells.length; i++){
		this.cells[i].update(time, dt);
	}
    for (i = 0; i < this.units.length; i++){
		unit = this.units[i];
        unitPositionX = unit.xPosition;
        unit.update(time, dt);
        
        if(unit.player === 'nature') {
            if(unitPositionX > Game.config.lane.cellNumber) {
                console.log('Nature hit NYC');
                unit.destroy();
                unitToRemove.push(i);
            }
        } else if(unit.player === 'newYork') {
            if(unitPositionX < 0) {
                console.log('NYC hit Nature');
                unit.destroy();
                unitToRemove.push(i);
            }
        }
        
	}
    for(i = unitToRemove.length - 1; i >= 0; i--) {
        this.units.splice(i, 1);
    }
}
