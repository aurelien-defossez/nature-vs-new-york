function BuildMonitor(){
	
	this.displayedQueues = {}	

	for (var lane = 0;lane < 3; lane++) {
		this.displayedQueues["lane"+lane] = {}
		this.displayedQueues["lane"+lane][HQ.typesEnum.NATURE] = {}
		this.displayedQueues["lane"+lane][HQ.typesEnum.NEW_YORK] = {}
		for (var i=0; i<4; i++) {
			this.displayedQueues["lane"+lane][HQ.typesEnum.NATURE]["input"+i] = {
				size : 0,
				unit : null
			}
			this.displayedQueues["lane"+lane][HQ.typesEnum.NEW_YORK]["input"+i] = {
				size : 0,
				unit : null
			}
		}
	}
	
	this.availableMappings = {}
	this.availableMappings[HQ.typesEnum.NATURE] = Game.config.nature.mapping.units
	this.availableMappings[HQ.typesEnum.NEW_YORK] = Game.config.newYork.mapping.units
	
	this.progressRefreshInterval = Game.config.buildMonitor.progressRefreshInterval
	
}

BuildMonitor.prototype.getPlayerTypeFromUnitType = function(unitType){
	for (var input in this.availableMappings[HQ.typesEnum.NATURE]){
		if (this.availableMappings[HQ.typesEnum.NATURE][input] == unitType){
			return HQ.typesEnum.NATURE
		}
	}
	for (var input in this.availableMappings[HQ.typesEnum.NEW_YORK]){
		if (this.availableMappings[HQ.typesEnum.NEW_YORK][input] == unitType){
			return HQ.typesEnum.NEW_YORK
		}
	}
}

BuildMonitor.prototype.getInputFromUnitType = function(unitType){
	for (var input in this.availableMappings[HQ.typesEnum.NATURE]){
		if (this.availableMappings[HQ.typesEnum.NATURE][input] == unitType){
			return input
		}
	}
	for (var input in this.availableMappings[HQ.typesEnum.NEW_YORK]){
		if (this.availableMappings[HQ.typesEnum.NEW_YORK][input] == unitType){
			return input
		}
	}
}

BuildMonitor.prototype.refreshQueue = function(index, queue){
	for (var type in queue) {
		var playerType = this.getPlayerTypeFromUnitType(type)
		var input = this.getInputFromUnitType(type)
		if (input) {
			this.displayedQueues["lane"+index][playerType][input].size = queue[type].length
			if (queue[type].length > 0) {
				this.displayedQueues["lane"+index][playerType][input].unit = queue[type][0]
			} else {
				this.displayedQueues["lane"+index][playerType][input].unit = null
			}
		}
	}
}
