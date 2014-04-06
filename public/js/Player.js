function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;
    this.keyboardController = new KeyboardController(this);
    this.controllerType = "gamepad";

}

Player.prototype.createUnit = function(button, laneIndex) {
    this.board.popMonster(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}

Player.prototype.createBuilding = function(button, laneIndex) {
    this.board.popBuilding(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}

Player.prototype.controlAction = function() {
    this.controller.checkAction(this)
}

Player.prototype.displayManaCount = function(){
    if (this.name == "nature")
    {
        document.getElementById("mana").style.display="block"
    }else{
        document.getElementById("dollars").style.display="block"    
    }
}

Player.prototype.hideManaCount = function(){
    if (this.name == "nature")
    {
        document.getElementById("mana").style.display="none"
    }else{
        document.getElementById("dollars").style.display="none"    
    }
}

