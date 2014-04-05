function Menu(){
  
    this.container = document.getElementById("menu")
    this.width = Game.config.board.width/2
    this.height = Game.config.board.height/2
    this.container.setAttribute("style", "margin-left:-"+this.width/2+"px;");
    
    this.domElement = document.createElement("div")
    this.domElement.className = "wrapper"
    this.domElement.setAttribute("style", "width:"+this.width+"px;")
    
    this.startBtn = document.createElement("div")
    this.startBtn.className = "options"
    this.startBtn.innerHTML = "<img src='data/StartGame.png' />"
    this.startBtn.setAttribute("style", "margin-left:auto;margin-right:auto;margin-top:"+(this.height/2-104/2)+"px;margin-bottom:"+(this.height/2-104/2)+"px;")
    
    this.endGameScreen = document.createElement("div")
    this.endGameScreen.className = "the-end"
    this.endGameScreen.innerHTML = "<img src='data/EndGame.png' />"
    this.endGameScreen.setAttribute("style", "height:"+this.height+"px;width:"+this.width+"px;")
    
    this.domElement.appendChild(this.startBtn)
    
    this.startBtn.parent = this
    this.startBtn.addEventListener('click', function(event){
      this.parent.hide()
    })
    this.endGameScreen.parent = this
    this.endGameScreen.addEventListener('click', function(event){
      this.parent.show()
	  this.parent.resetGame()
    })
    
}

Menu.prototype.show = function(screenNb) {
    console.log("show")
    this.setScreen(screenNb)
    this.container.appendChild(this.domElement)
    this.shown = true
}

Menu.prototype.hide = function() {
    console.log("hide")
    this.container.removeChild(this.domElement)
    this.shown = false
}

Menu.prototype.isShown = function(){
    return this.shown
}


Menu.prototype.setScreen = function(screenNb){
  switch(screenNb){
      case 100 : //show end screen
        this.removeAllChildren()
        this.domElement.appendChild(this.endGameScreen)
        break;
      default: //show start btn by default
        this.removeAllChildren()
        this.domElement.appendChild(this.startBtn)
  }
  
}

Menu.prototype.removeAllChildren = function(){
    
  while (this.domElement.hasChildNodes()) {
      this.domElement.removeChild(this.domElement.lastChild);
  }

}


Menu.prototype.resetGame = function(){
	//reset game here!
	console.log("Restart Game!")
	window.location.reload()
}


