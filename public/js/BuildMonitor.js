function BuildMonitor(){
	
	this.displayedQueues = {
		nature : {
			input0 : {
				size : 0,
				unit : null
			},
			input1 : {
				size : 0,
				unit : null
			},
			input2 : {
				size : 0,
				unit : null
			},
			input3 : {
				size : 0,
				unit : null
			}
		},
	    newYork : {
			input0 : {
				size : 0,
				unit : null
			},
			input1 : {
				size : 0,
				unit : null
			},
			input2 : {
				size : 0,
				unit : null
			},
			input3 : {
				size : 0,
				unit : null
			}
		}
	};
	
	this.availableMappings = {
		nature : Game.config.nature.mapping.units,
		newYork : Game.config.newYork.mapping.units
	}
	
	this.progressRefreshInterval = Game.config.buildMonitor.progressRefreshInterval
	
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
		this.displayedQueues[playerType][input].size = queue[type].length
		if (queue[type].length > 0) {
			this.displayedQueues[playerType][input].unit = queue[type][0]
		} else {
			this.displayedQueues[playerType][input].unit = null
		}
	}
}