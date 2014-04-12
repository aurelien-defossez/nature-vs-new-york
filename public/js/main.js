var game = null
var menu = null

window.onload = function()
{
    game = new Game()
    menu = new Menu()
    requestAnimationFrame(update)
    
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
}

function update(timestamp)
{
	if (game.isStartup){
		menu.show()
		game.isStartup = false
	}
	if (!menu.isShown()) {
      game.update(timestamp * 0.001)
    }
    requestAnimationFrame(update)

}


function onDocumentKeyDown( event ) {
    var keyboardAction; 
    keyboardAction = Game.config.controls.keyboard1[event.keyCode];
    if(keyboardAction) {
        if (game.players.left.controllerType=="keyboard")
            game.players.left.controller.pressKey(keyboardAction);
    } else {
        keyboardAction = Game.config.controls.keyboard2[event.keyCode];
        if(keyboardAction) {
            if (game.players.right.controllerType=="keyboard")
                game.players.right.controller.pressKey(keyboardAction);
        }
    }

}

function onDocumentKeyUp( event ) {
    var keyboardAction;

    keyboardAction = Game.config.controls.keyboard1[event.keyCode];
    if(keyboardAction) {
        if (game.players.left.controllerType=="keyboard")
            game.players.left.controller.releaseKey(keyboardAction);
    } else {
        keyboardAction = Game.config.controls.keyboard2[event.keyCode];
        if(keyboardAction) {
            if (game.players.right.controllerType=="keyboard")
                game.players.right.controller.releaseKey(keyboardAction);
        }
    }

}
