function Lane(board, loader) {
    this.board = board;
	this.scene = new THREE.Object3D()
	board.scene.add(this.scene)
	this.cells = [];
    this.units = [];
	laneWidth = Game.config.lane.cellNumber
	this.naturePosition = Game.config.nature.initOwnedCells;
	this.newYorkPosition = Game.config.newYork.initOwnedCells;
	laneHeight = 1
	//this.laneCube = new THREE.Mesh( new THREE.CubeGeometry(laneWidth,0.1,laneHeight),  new THREE.MeshBasicMaterial( { color: 0x0000ff } ) )
	//this.laneCube.position.x = laneWidth/2
	//this.laneCube.position.z = -1/2
	//this.scene.add(this.laneCube)

	this.unitsCreationQueue = [];

	//this.position = position
	for (var i = 0; i < Game.config.lane.cellNumber; i++ ){
		var cell = new Cell(this.scene, loader);
		cell.scene.translateX( i )
		this.cells.push(cell)

		if (i < this.naturePosition) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - this.newYorkPosition) {
			cell.setOwner("newYork")
		}
	}
	
}

Lane.prototype.buildNextUnit = function(){
	if (this.unitsCreationQueue.length > 0) {
		this.unitsCreationQueue[0].startBuild();
		console.log("Start building next unit...")
	}
}

Lane.prototype.runUnit = function(unit){
	this.units.push(unit);
	this.unitsCreationQueue.splice(0,1)
	unit.runUnit();
	console.log("Unit ready!")
}

Lane.prototype.addUnitInQueue = function(unit){
	this.unitsCreationQueue.push(unit)
	if (this.unitsCreationQueue.length==1) {
		this.buildNextUnit()
	}
}

Lane.prototype.processCreationQueue = function(time, dt){
	for (var i = 0; i < this.unitsCreationQueue.length; i++){
		var unit = this.unitsCreationQueue[i]
		unit.update(time, dt)
		if (i==0 && unit.isBuilt()){
			this.runUnit(unit)
			this.buildNextUnit()
		}
	}
}


Lane.prototype.popBuilding = function(button, playerName){
	if (playerName == HQ.typesEnum.NATURE){
		for (var i = 0; i <= this.naturePosition; i++){
			if (this.cells[i].building == null){
				this.cells[i].build(button, playerName)
			}
		}
	} else {
		for (var i = this.cells.length -1 ; i >= this.cells.length - this.newYorkPosition ; i--){
			if (this.cells[i].building == null){
				this.cells[i].build(button, playerName)
			}
		}
	}
}

Lane.prototype.capture = function(type, value){
	if (type == HQ.typesEnum.NATURE) {
		for (var i = 0; i < Game.config.lane.cellNumber; i++) {
			var cell = this.cells[i]
			if (cell.owner == null || cell.owner != "nature" && cell.building == null) {
				cell.capture(value)
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
        
        if(unit.player === HQ.typesEnum.NATURE) {
            if(unitPositionX > Game.config.lane.cellNumber) {
                console.log('Nature hit NYC');
                this.board.hitEnemy(unit.player);
                unit.destroy();
                unitToRemove.push(i);
            }
        } else if(unit.player === HQ.typesEnum.NEW_YORK) {
            if(unitPositionX < 0) {
                console.log('NYC hit Nature');
                this.board.hitEnemy(unit.player);
                unit.destroy();
                unitToRemove.push(i);
            }
        }
        
	}
	
	this.processCreationQueue(time, dt)
    for(i = unitToRemove.length - 1; i >= 0; i--) {
        this.units.splice(i, 1);
    }
}
