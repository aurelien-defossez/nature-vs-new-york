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

    switch (event.keyIdentifier){
        case Game.config.hotKeys.keyboard.start : 
            if(!menu.isShown()) {
                menu.show()
            } else {
                menu.hide()
            }
            break;
        case "U+0045" : // key "E"
            if(!menu.isShown()) {
                menu.show(100)
            }
            break;
        default:
            break;
    }

    keyboardAction = Game.config.controls.keyboard1[event.keyIdentifier];
    if(keyboardAction) {
        console.log('Player 1 is doing ' + keyboardAction);
        game.players.left.keyboardController.pressKey(keyboardAction);
    } else {
        keyboardAction = Game.config.controls.keyboard2[event.keyIdentifier];
        if(keyboardAction) {
            console.log('Player 2 is doing ' + keyboardAction);
            game.players.right.keyboardController.pressKey(keyboardAction);
        }
    }

}

function onDocumentKeyUp( event ) {
    var keyboardAction;

    keyboardAction = Game.config.controls.keyboard1[event.keyIdentifier];
    if(keyboardAction) {
        console.log('Player 1 is doing ' + keyboardAction);
        game.players.left.keyboardController.releaseKey(keyboardAction);
    } else {
        keyboardAction = Game.config.controls.keyboard2[event.keyIdentifier];
        if(keyboardAction) {
            console.log('Player 2 is doing ' + keyboardAction);
            game.players.right.keyboardController.releaseKey(keyboardAction);
        }
    }

}
