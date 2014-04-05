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

	this.unitsCreationQueues = {
	    sapCarrier: [],
	    wolf: [],
	    bear: [],
	    ent: [],
	    builder: [],
	    lumberjack: [],
	    policeman: [],
	    mecha: []
	};

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
	
	this.alerts = []
}

Lane.prototype.buildNextUnit = function(type){
	if (this.unitsCreationQueues[type].length > 0) {
		this.unitsCreationQueues[type][0].startBuild();
		console.log("Start building next "+type+"...")
	}
}

Lane.prototype.runUnit = function(unit){
	this.units.push(unit);
	this.unitsCreationQueues[unit.type].splice(0,1)
	unit.runUnit();
	console.log("Unit ready!")
}

Lane.prototype.addUnitInQueue = function(unit){
	this.unitsCreationQueues[unit.type].push(unit)
	if (this.unitsCreationQueues[unit.type].length==1) {
		this.buildNextUnit(unit.type)
	}
}

Lane.prototype.processCreationQueue = function(time, dt){
	for (var type in this.unitsCreationQueues) {
		for (var i = 0; i < this.unitsCreationQueues[type].length; i++){
			var unit = this.unitsCreationQueues[type][i]
			unit.update(time, dt)
			if (i==0 && unit.isBuilt()){
				this.runUnit(unit)
				this.buildNextUnit(unit.type)
			}
		}
	}
}

Lane.prototype.sayNotEnoughMana = function(playerName){
	var alertTexture = THREE.ImageUtils.loadTexture('data/NotEnoughMana.png')
	var alert = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshLambertMaterial( { map: alertTexture } ) )
	this.alerts.push( alert );
	if(playerName === HQ.typesEnum.NATURE) {
		alert.position.x = 0.8;
	} else if(playerName === HQ.typesEnum.NEW_YORK) {
		alert.position.x = Game.config.lane.cellNumber - 0.8;
	}
	alert.position.y = 0.5;
	alert.position.z = -0.3/2;
    alert.castShadow = true;
    alert.receiveShadow = true;
	alert.createDate = new Date()
	alert.ttl = Game.config.alerts.ttl * 1000
    this.scene.add(alert)
}
Lane.prototype.purgeAlerts = function(){
	if (this.alerts.length > 0){
		var currentTime = new Date()
		var alert = this.alerts[0]
		if (currentTime.getTime() - alert.createDate.getTime() > alert.ttl) {
			this.scene.remove(alert)
			this.alerts.splice(0,1)
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
        unitToRemove = [];
    
    for (i = 0; i < this.cells.length; i++){
		this.cells[i].update(time, dt);
	}
    for (i = 0; i < this.units.length; i++){
		unit = this.units[i];
        unit.update(time, dt);
        
        if(unit.player === HQ.typesEnum.NATURE && unit.xPosition > Game.config.lane.cellNumber) {
            this.board.hitEnemy(unit.player);
            unit.destroy();
            unitToRemove.push(i);
        } else if(unit.player === HQ.typesEnum.NEW_YORK && unit.xPosition < 0) {
            this.board.hitEnemy(unit.player);
            unit.destroy();
            unitToRemove.push(i);
        }
        
	}
	
	this.processCreationQueue(time, dt)
    for(i = unitToRemove.length - 1; i >= 0; i--) {
        this.units.splice(unitToRemove[i], 1);
    }
	
	this.purgeAlerts()
}
