function BuildMonitor(){
	
	this.displayedQueues = {
		nature : {
			input0 : 0,
			input1 : 0,
			input2 : 0,
			input3 : 0
		},
	    newYork : {
			input0 : 0,
			input1 : 0,
			input2 : 0,
			input3 : 0
		}
	};
	
	this.availableMappings = {
		nature : Game.config.nature.mapping.units,
		newYork : Game.config.newYork.mapping.units
	}
	
}

BuildMonitor.prototype.getPlayerTypeFromUnitType = function(unitType){
	for (var input in this.availableMappings.nature){
		if (this.availableMappings.nature[input] == unitType){
			return HQ.typesEnum.NATURE
		}
	}
	for (var input in this.availableMappings.newYork){
		if (this.availableMappings.newYork[input] == unitType){
			return HQ.typesEnum.NEW_YORK
		}
	}
}

BuildMonitor.prototype.getInputFromUnitType = function(unitType){
	for (var input in this.availableMappings.nature){
		if (this.availableMappings.nature[input] == unitType){
			return input
		}
	}
	for (var input in this.availableMappings.newYork){
		if (this.availableMappings.newYork[input] == unitType){
			return input
		}
	}
}

BuildMonitor.prototype.refreshQueue = function(queue){
	for (var type in queue) {
		var playerType = this.getPlayerTypeFromUnitType(type)
		var input = this.getInputFromUnitType(type)
		this.displayedQueues[playerType][input] = queue[type].length
	}
}