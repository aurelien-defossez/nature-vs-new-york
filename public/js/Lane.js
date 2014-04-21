function Lane(id, board, loader) {
	this.board = board;
	this.id = id
	this.loader = loader
	this.scene = new THREE.Object3D()
	this.board = board
	board.scene.add(this.scene)
	this.cells = [];
	this.units = [];
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
	
	this.board.hud.refreshBuildMonitor(this.id, this.unitsCreationQueues)
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
	this.board.hud.refreshBuildMonitor(this.id, this.unitsCreationQueues)
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
	this.board.hud.refreshBuildMonitor(this.id, this.unitsCreationQueues)
	if (this.unitsCreationQueues[unit.type].length==1) {
		this.buildNextUnit(unit.type)
	}
}

Lane.prototype.processCreationQueue = function(time, dt){
	for (var type in this.unitsCreationQueues) {
		var unit = this.unitsCreationQueues[type][0]

		if (unit) {
			unit.buildDelay -= dt

			if (unit.isBuilt()) {
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

			if (remaining > 0 && cell.captureProgress < 1 && cell.building == null) {
				var hasBuilderOnCell = false;
				for (var j = 0; j < this.units.length; j++) {
					var unit = this.units[j];
					if (unit.type == "builder") {
						var index = Math.floor(unit.xPosition);
						
						if (index <= i) {
							hasBuilderOnCell = true;
						}	
					}
				}

				if (!hasBuilderOnCell) {
					remaining = cell.capture(value)
				}
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
	var i, j
	var unitToRemove = []

	for (i = 0; i < this.cells.length; i++) {
		this.cells[i].update(time, dt)
	}

	for (i = 0; i < this.units.length; i++) {
		var unit = this.units[i];
		unit.i = i

		if (unit.hp > 0) {
			// Cooldown
			if (unit.cooldownTimer > 0) {
				unit.cooldownTimer -= dt
			}

			// Attack or Move
			if (unit.cooldownTimer <= 0) {
				var actionDone = false
				var blockedByFriend = false

				// Detect collisions with other units
				for (j = 0; j < this.units.length; j++) {
					if (i != j && !actionDone) {
						var otherUnit = this.units[j]

						if (otherUnit.hp > 0 && unit.willCollideWith(otherUnit.getBounds(), dt)) {
							// Collision with enemy: Attack
							if (unit.player != otherUnit.player) {
								if (otherUnit.hit(unit.attack)) {
									unitToRemove.push(otherUnit)
								}

								actionDone = true
								unit.switchAnimation("wait")
								unit.startCooldown()
							}
							// Collision with friend: Stop if friend is also stopped
							else {
								if (!blockedByFriend && otherUnit.phase == "wait") {
									blockedByFriend = true
									unit.switchAnimation("wait")
								}
							}
						}	
					}
				}

				if (blockedByFriend && !actionDone) {
					// Detect collisions with other units (farther)
					for (j = 0; j < this.units.length; j++) {
						if (i != j && !actionDone) {
							var otherUnit = this.units[j]
							var bounds = otherUnit.getBounds()
							bounds.left --
							bounds.right ++

							if (otherUnit.hp > 0 && unit.willCollideWith(bounds, dt)) {
								// Collision with enemy: Attack
								if (unit.player != otherUnit.player) {
									if (otherUnit.hit(unit.attack)) {
										unitToRemove.push(otherUnit)
									}

									actionDone = true
									unit.switchAnimation("wait")
									unit.startCooldown()
								}
							}	
						}
					}

					if (!actionDone) {
						// Detect collisions with buildings (farther)
						for (j = 0; j < this.cells.length; j++) {
							var building = this.cells[j].building

							if (building
							&& building.currentHP > 0
							&& building.player != unit.player) {
								var bounds = building.getBounds()
								bounds.left --
								bounds.right ++

								if (unit.willCollideWith(bounds, dt)) {
									building.hit(unit.buildingAttack)
									actionDone = true
									unit.switchAnimation("wait")
									unit.startCooldown()
								}
							}
						}
					}
				}

				if (!actionDone && !blockedByFriend) {
					// Detect collisions with buildings
					for (j = 0; j < this.cells.length; j++) {
						var building = this.cells[j].building

						if (building
						&& building.currentHP > 0
						&& building.player != unit.player
						&& unit.willCollideWith(building.getBounds(), dt)) {
							building.hit(unit.buildingAttack)
							actionDone = true
							unit.switchAnimation("wait")
							unit.startCooldown()
						}
					}

					if (!actionDone) {
						var walk = true

						if (unit.type == "builder") {
							var cell = this.cells[Math.floor(unit.xPosition)]
							if (cell.captureProgress > -1) {
								walk = false

								// Build
								if (unit.phase != "build") {
									unit.switchAnimation("build")
								}
							}
						}

						if (walk) {
							// Walk
							if (unit.phase != "walk") {
								unit.switchAnimation("walk")
							}

							unit.move(dt)

							// Hit fortress
							if (unit.direction > 0 && unit.xPosition > this.cells.length
							|| unit.direction < 0 && unit.xPosition < 0) {
								var opponent = unit.player == "nature" ? "newYork" : "nature"
								this.board.hqs[opponent].hit(unit.buildingAttack)
								unit.hit(unit.hp)
								unitToRemove.push(unit)
							}
						}
					}
				}
			}
		}

		unit.update(time, dt)
	}

	this.processCreationQueue(time, dt)
	for(i = unitToRemove.length - 1; i >= 0; i--) {
		this.dyingUnits.push(this.units[unitToRemove[i].i]);
		this.units.splice(unitToRemove[i].i, 1);
	}

	var reallyDeadUnits = []
	for(i = this.dyingUnits.length - 1; i >= 0; i--) {
		if (this.dyingUnits.deathAnimationFinished) {
			reallyDeadUnits.push(this.dyingUnits[i]);
		}

		if (this.dyingUnits[i]) {
			this.dyingUnits[i].update(time, dt);
		}
	}

	for(i = reallyDeadUnits.length - 1; i >= 0; i--) {
		this.dyingUnits.splice(reallyDeadUnits[i], 1);
	}

}
