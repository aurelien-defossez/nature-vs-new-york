function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;
	// Time in ms between two actions
    this.timeBetweenActions = 200;
}

Player.prototype.createUnit = function(button, laneIndex) {
	var lane = this.board.lanes[laneIndex]
	var unit = new Unit(lane.scene, this.name, button)
	
	lane.addUnitInQueue(unit)
}

Player.prototype.controlAction = function() {
    this.controller.checkAction(this)
}