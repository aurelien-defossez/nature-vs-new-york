function Player(name, board, controller, type) {

    this.name = name;
    this.board = board;
    this.controller = controller;
    this.controllerType = type;
    disableControl = false;
	
	this.controller.player = this

}

Player.prototype.createUnit = function(button, laneIndex) {
    this.board.popMonster(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}

Player.prototype.createBuilding = function(button, laneIndex) {
    this.board.popBuilding(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}

Player.prototype.controlAction = function() {
    if (this.controllerType == "gamepad")
        this.controller.checkAction(this)
}

Player.prototype.displayManaCount = function(){
    if (this.name == "nature")
    {
        document.getElementById("mana").style.display="block"
    }else{
        document.getElementById("dollars").style.display="block"    
    }
	document.getElementById(this.name+"-build-queue").style.display="block"
}

Player.prototype.hideManaCount = function(){
    if (this.name == "nature")
    {
		document.getElementById("mana").style.display="none"
    }else{
        document.getElementById("dollars").style.display="none"    
    }
	document.getElementById(this.name+"-build-queue").style.display="none"
}

