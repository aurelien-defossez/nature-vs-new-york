var game = null
var menu = null

window.onload = function()
{
	game = new Game()
    menu = new Menu()
	requestAnimationFrame(update)
}

function update(timestamp)
{
	if (!menu.isShown()) {
      game.update(timestamp * 0.001)
    }
	requestAnimationFrame(update)
    
}


function onDocumentKeyDown( event ) {
  
  switch (event.keyIdentifier){
      case Game.config.hotKeys.keyboard.start : 
        if(!menu.isShown()) {
          menu.show()
        } else {
          menu.hide()
        }
        break
      case "U+0045" : // key "E"
        if(!menu.isShown()) {
          menu.show(100)
        }
        break
      default:
      //
      
  }
}
