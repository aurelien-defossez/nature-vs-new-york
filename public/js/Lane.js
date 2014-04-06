function Lane(id, board, loader) {
    this.board = board;
    this.id = id
    this.loader = loader
	this.scene = new THREE.Object3D()
	this.board = board
	board.scene.add(this.scene)
	this.cells = [];
    this.units = [];
    this.waitingLine = [];

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
		var cell = new Cell(this.scene, loader, this.id);
		cell.scene.translateX( i )
		this.cells.push(cell)

		if (i < Game.config.nature.initOwnedCells) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - Game.config.newYork.initOwnedCells) {
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
	unit.id = this.units.length
	this.units.push(unit);
	this.unitsCreationQueues[unit.type].splice(0,1)
	unit.runUnit();
	console.log("Unit ready!")
}

Lane.prototype.createUnit = function(player, type, position){
	var unit = new Unit(this.scene, player, type, this.loader)
	unit.runUnit();
	unit.setPosition(position)
	unit.activate()
	unit.id = this.units.length
	this.units.push(unit)
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


Lane.prototype.popBuilding = function(button, playerName, hq){
	if (playerName == HQ.typesEnum.NATURE){
		for (var i = 0; i <= this.cells.length -1; i++){
			if (this.cells[i].building == null && this.cells[i].owner == playerName){
				this.cells[i].build(button, playerName, hq)
				break;
			}
		}
	} else {
		for (var i = this.cells.length -1 ; i >= 0; i--){
			if (this.cells[i].building == null && this.cells[i].owner == playerName){
				this.cells[i].build(button, playerName, hq)
				break;
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

   	// Define targets for units using buildings and waiting line
   	var natureTarget
   	var newYorkTarget
    for (i = this.cells.length - 1; i >= 0; --i) {
    	var cell = this.cells[i]

    	// Find first neutral or enemy empty cell
    	if (!cell.owner || cell.owner == "newYork" && !cell.building) {
    		natureTarget = {
    			index: (i + 1) * 3 - 1
    		}

			break
    	}
	}

    for (i = 0; i < this.cells.length; i++) {
    	var cell = this.cells[i]

    	// Find first neutral or enemy empty cell
    	if (!cell.owner || cell.owner == "nature" && !cell.building) {
    		newYorkTarget = {
				index: i * 3
			}

			break
    	}
	}

	// Find farthest units
	var farthestUnit = {
		nature: null,
		newYork: null
	}
    for (i = 0; i < this.units.length; i++) {
    	var unit = this.units[i]
    	var localBest = farthestUnit[unit.player]

    	if (!localBest
    	|| (unit.player == "nature" && unit.xPosition > localBest.xPosition)
    	|| (unit.player == "newYork" && unit.xPosition < localBest.xPosition)) {
    		farthestUnit[unit.player] = unit
    	}
    }

    // Correct targets using farthest units
    if (natureTarget && farthestUnit.newYork && farthestUnit.newYork.xPosition < natureTarget.index / 3 + 1 / 6) {
    	var index = Math.floor(farthestUnit.newYork.xPosition * 3)
    	natureTarget = {
    		index: index
    	}
    }

    if (newYorkTarget && farthestUnit.nature && farthestUnit.nature.xPosition > newYorkTarget.index / 3 + 1 / 6) {
    	var index = Math.ceil(farthestUnit.nature.xPosition * 3)
    	newYorkTarget = {
    		index: index
    	}
    }

    // Find next available spot
    if (natureTarget) {
		for (j = natureTarget.index; j >= 0; --j) {
			if (!this.waitingLine[j]) {
				natureTarget = {
					index: j
				}
				break
			}
		}
	}

	if (newYorkTarget) {
		for (j = newYorkTarget.index; j < this.cells.length * 3; j++) {
			if (!this.waitingLine[j]) {
				newYorkTarget = {
					index: j
				}
				break
			}
		}
	}

    // Compute target positions
    if (natureTarget) {
    	natureTarget.position = natureTarget.index / 3 + 1 / 6
    }

    if (newYorkTarget) {
    	newYorkTarget.position = newYorkTarget.index / 3 + 1 / 6
    }

    for (i = 0; i < this.cells.length; i++) {
		this.cells[i].update(time, dt);
	}

    for (i = 0; i < this.units.length; i++) {
		unit = this.units[i];
		var opponent = unit.player == "nature" ? "newYork" : "nature"

		if (unit.phase == "walk") {
	        if (unit.player == "nature"
	        && (!natureTarget || natureTarget.index < 0 || unit.xPosition > natureTarget.position)) {
	        	if (natureTarget) {
	        		unit.setPosition(natureTarget.position)
	        		this.waitingLine[natureTarget.index] = unit
	        		unit.waitingLineIndex = natureTarget.index
		        	natureTarget.index --
		        	natureTarget.position -= 1 / 3
	        	} else {
	        		unit.hide()
	        	}

	        	unit.switchAnimation("wait")
	        }

	        if (unit.player == "newYork"
	        && (!newYorkTarget || newYorkTarget.index < 0 || unit.xPosition < newYorkTarget.position)) {
	        	if (newYorkTarget) {
	        		unit.setPosition(newYorkTarget.position)
	        		this.waitingLine[newYorkTarget.index] = unit
	        		unit.waitingLineIndex = newYorkTarget.index
		        	newYorkTarget.index ++
		        	newYorkTarget.position += 1 / 3
	        	} else {
	        		unit.hide()
	        	}

	        	unit.switchAnimation("wait")
	        }
	    } else if (unit.isReady()) {
	    	// Enemy unit in sight: Attack the nearest
	    	var direction = unit.player == "nature" ? 1 : -1
	    	var actionDone = false
    		for (j = unit.waitingLineIndex + direction; j < unit.waitingLineIndex + direction * 3; j += direction) {
    			var potentialUnit = this.waitingLine[j]
    			if (potentialUnit && potentialUnit.player != unit.player) {
    				actionDone = true
    				if (potentialUnit.hit(unit.attack)) {
	    				this.waitingLine[potentialUnit.waitingLineIndex] = null
	    				unitToRemove.push(potentialUnit.id)
	    			}
    				break
    			}
    		}

    		if (!actionDone) {
    			// Enemy building on the cell: Attack it
    			var cellId = Math.floor(unit.waitingLineIndex / 3)
    			var cell = this.cells[cellId]
    			var hurt = false
    			if (cell && cell.building && cell.building.player != unit.player) {
    				actionDone = true
    				if (cell.building.hit(unit.buildingAttack)) {
    					cell.building = null
    				}
    			}
    		}

			if (!actionDone) {
				// Enemy building OR the big building on next cell: Attack it
				cellId += direction
				cell = this.cells[cellId]
				if (cell) {
				if (cell.building && cell.building.player != unit.player) {
	    				actionDone = true
					if (cell.building.hit(unit.buildingAttack)) {
						cell.building = null
					}
    			}
				} else {
					this.board.hqs[opponent].hit(unit.buildingAttack)
					unit.hit(unit.hp)
    				this.waitingLine[unit.waitingLineIndex] = null
    				unitToRemove.push(unit.id)
				}
			}

			if (!actionDone) {
				// Next spot is free: Move
				if (!this.waitingLine[unit.waitingLineIndex + direction]
				&& (!farthestUnit[opponent] || Math.abs(farthestUnit[opponent].xPosition - unit.xPosition) < 1 / 5)) {
					actionDone = true
					unit.switchAnimation("walk")
    		}
			}

			// Wait
			// Nothing special to code, woopy!

			// Something has been done: Start cooldown
			if (actionDone) {
				unit.startCooldown()
			}
	    }

        unit.update(time, dt);
	}

	this.processCreationQueue(time, dt)
    for(i = unitToRemove.length - 1; i >= 0; i--) {
        this.units.splice(unitToRemove[i], 1);
    }

	this.purgeAlerts()
}
