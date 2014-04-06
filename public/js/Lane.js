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
    this.dyingUnits = []

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
		var cell = new Cell(this.scene, loader, this, i);
		cell.scene.translateX( i )
		this.cells.push(cell)

		if (i < Game.config.nature.initOwnedCells) {
			cell.setOwner("nature")
		} else if (i >= Game.config.lane.cellNumber - Game.config.newYork.initOwnedCells) {
			cell.setOwner("newYork")
		}
	}
	
	this.board.hud.refreshBuildMonitor(this.unitsCreationQueues)

}

Lane.prototype.buildNextUnit = function(type){
	if (this.unitsCreationQueues[type].length > 0) {
		this.unitsCreationQueues[type][0].startBuild();
		console.log("Start building next "+type+"...")
	}
}

Lane.prototype.runUnit = function(unit){
	unit.lane = this
	this.units.push(unit);
	this.unitsCreationQueues[unit.type].splice(0,1)
	unit.runUnit();
	this.board.hud.refreshBuildMonitor(this.unitsCreationQueues)
	console.log("Unit ready!")
}

Lane.prototype.createUnit = function(player, type, position){
	var unit = new Unit(this.scene, player, type, this.loader, null)
	unit.runUnit();
	unit.setPosition(position)
	unit.activate()
	unit.lane = this
	this.units.push(unit)
}

Lane.prototype.addUnitInQueue = function(unit){
	this.unitsCreationQueues[unit.type].push(unit)
	this.board.hud.refreshBuildMonitor(this.unitsCreationQueues)
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

Lane.prototype.popBuilding = function(button, playerName, hq){
	if (playerName == HQ.typesEnum.NATURE){
		for (var i = 0; i < this.cells.length; i++){
			if (this.cells[i].building == null && this.cells[i].captureProgress == 1){
				this.cells[i].build(button, playerName, hq)
				break;
			}
		}
	} else {
		for (var i = this.cells.length - 1 ; i >= 0; i--){
			if (this.cells[i].building == null && this.cells[i].captureProgress == -1){
				this.cells[i].build(button, playerName, hq)
				break;
			}
		}
	}
}

Lane.prototype.capture = function(type, value){
	var remaining = value
	if (type == HQ.typesEnum.NATURE) {
		for (var i = 0; i < Game.config.lane.cellNumber; i++) {
			var cell = this.cells[i]
			var hasBuilderOnCell = false;
			for (var j = 0; j< this.units.length; j++)
			{
				var unit = this.units[j];
				if (unit.type == "builder"){
					var index = Math.floor(unit.xPosition);
					
					if (index == i || (index == i+1 )) 
					{
						//console.log("STOP")
						hasBuilderOnCell = true;
					}	

				}
			}
			if (hasBuilderOnCell)
				break;

			
			if (remaining > 0 && cell.captureProgress < 1 && cell.building == null) {
				remaining = cell.capture(value)
			}

		}
	} else {
		for (var i = Game.config.lane.cellNumber - 1; i >= 0; --i) {
			var cell = this.cells[i]
			
			if (remaining > 0 && cell.captureProgress > -1 && cell.building == null) {
				remaining = -cell.capture(-value)
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
   	var builderTarget
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

	if (!natureTarget) {
		natureTarget = {
			index: (this.cells.length + 1) * 3 - 1
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

	if (!newYorkTarget) {
		newYorkTarget = {
			index: 0
		}
	}

    for (i = this.cells.length - 1; i >= 0; --i) {
    	var cell = this.cells[i]

    	if (!cell.owner || cell.owner == "nature" && cell.captureProgress > -1 ) {
    		builderTarget = {
    			index: (i + 1) * 3
    		}
    		break
    	}
	}

	// Find farthest units
	var farthestUnit = {}
	this.farthestUnit = farthestUnit
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
    if (farthestUnit.newYork && farthestUnit.newYork.xPosition - 1 / 6 < natureTarget.index / 3) {
    	natureTarget = {
    		index: Math.floor(farthestUnit.newYork.xPosition * 3) - 1
    	}
    }

    if (newYorkTarget && farthestUnit.nature && farthestUnit.nature.xPosition > newYorkTarget.index / 3) {
    	newYorkTarget = {
    		index: Math.ceil(farthestUnit.nature.xPosition * 3)
    	}
    }

    // Find next available spot
	for (j = natureTarget.index; j >= 0; --j) {
		if (!this.waitingLine[j]) {
			natureTarget = {
				index: j
			}
			break
		}
	}

	for (j = newYorkTarget.index; j < this.cells.length * 3; j++) {
		if (!this.waitingLine[j]) {
			newYorkTarget = {
				index: j
			}
			break
		}
	}

	if (!builderTarget) {
		builderTarget = {
			index: newYorkTarget.index
		}
	} else if (newYorkTarget.index > builderTarget.index) {
		builderTarget.index = newYorkTarget.index
	}

    // Compute target positions
    natureTarget.position = natureTarget.index / 3 + 1 / 6
    newYorkTarget.position = newYorkTarget.index / 3 + 1 / 6
   	builderTarget.position = builderTarget.index / 3 + 1 / 6

    for (i = 0; i < this.cells.length; i++) {
		this.cells[i].update(time, dt);
	}

    for (i = 0; i < this.units.length; i++) {
    	this.units[i].index = i
    }

    for (i = 0; i < this.units.length; i++) {
		unit = this.units[i];
		var opponent = unit.player == "nature" ? "newYork" : "nature"

		if (unit.phase == "walk") {
	        if (unit.type == "builder" && unit.xPosition > builderTarget.position - 1/3) {
	        	if (builderTarget.index < 0 || unit.xPosition < builderTarget.position) {
		        	if (builderTarget) {
		        		unit.setPosition(builderTarget.position)
		        		this.waitingLine[builderTarget.index] = unit
		        		unit.waitingLineIndex = builderTarget.index
			        	builderTarget.index ++
			        	builderTarget.position += 1 / 3
		        	} else {
		        		unit.hide()
		        	}

		        	unit.switchAnimation("build")
		        }
	        } else if (unit.player == "nature") {
	        	if (natureTarget.index < 0 || unit.xPosition > natureTarget.position) {
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
	        } else if (unit.player == "newYork") {
	        	if (!newYorkTarget || newYorkTarget.index < 0 || unit.xPosition < newYorkTarget.position) {
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
	        }
	    } else if (unit.isReady()) {
	    	// Enemy unit in sight: Attack the nearest
	    	var direction = unit.player == "nature" ? 1 : -1
	    	var actionDone = false
    		for (j = unit.waitingLineIndex + direction; j > unit.waitingLineIndex - 3 && j < unit.waitingLineIndex + 3; j += direction) {
    			var potentialUnit = this.waitingLine[j]
    			if (potentialUnit && potentialUnit.player != unit.player) {
    				actionDone = true
    				if (potentialUnit.hit(unit.attack)) {
	    				this.waitingLine[potentialUnit.waitingLineIndex] = null
	    				unitToRemove.push(potentialUnit.index)
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
    				unitToRemove.push(i)
				}
			}

			if (!actionDone) {
				// Next spot is free: Move
				if (!this.waitingLine[unit.waitingLineIndex + direction]
				&& (!farthestUnit[opponent] || Math.abs(farthestUnit[opponent].xPosition - unit.xPosition) > 1 / 2)) {
					actionDone = true
    				this.waitingLine[unit.waitingLineIndex] = null
    				unit.waitingLineIndex = null
					unit.switchAnimation("walk")
				}
			}

			// Wait
			// Nothing special to code, woopy!

			// Something has been done: Start cooldown
			if (actionDone) {
				unit.startCooldown()
			}
	    } else if (unit.phase == "build") {
	    	var cellId = Math.floor(unit.waitingLineIndex / 3) - 1

	    	if (cellId >= 0 && this.cells[cellId].captureProgress == -1) {
	    		unit.switchAnimation("walk")
	    	}
	    }

        unit.update(time, dt);
	}

	this.processCreationQueue(time, dt)
    for(i = unitToRemove.length - 1; i >= 0; i--) {
    	this.dyingUnits.push(this.units[unitToRemove[i]]);
        this.units.splice(unitToRemove[i], 1);
        
    }

    var realyDeadUnits = []
    for(i = this.dyingUnits.length - 1; i >= 0; i--) {
    	if (this.dyingUnits.deathAnimationFinished)
    	{
    		realyDeadUnits.push(this.dyingUnits[i]);
    	}
    	debugger;
        this.dyingUnits[i].update(time, dt);
    }
    for(i = realyDeadUnits.length - 1; i >= 0; i--) {
        this.dyingUnits.splice(realyDeadUnits[i], 1);
    }

}
