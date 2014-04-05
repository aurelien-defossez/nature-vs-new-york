function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;
    this.controllerType = "gamepad";

}

Player.prototype.createUnit = function(button, laneIndex) {
	if (this.canCreateUnit()){
    	this.board.popMonster(Game.config.controls[this.controllerType][button], laneIndex, this.name)
	} else {
		console.log("Not enough mana/dollars!")
	}
}

Player.prototype.canCreateUnit = function(){
	return this.board.canCreateUnit(this.name)
}


Player.prototype.createBuilding = function(button, laneIndex) {
    this.board.popBuilding(Game.config.controls[this.controllerType][button], laneIndex, this.name)
	// Time in ms between two actions
    this.timeBetweenActions = 200;
}

Player.prototype.controlAction = function() {
    this.controller.checkAction(this)
}
