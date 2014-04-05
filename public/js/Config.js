Game.config = {
    board : {
      height: 720,
      width:1280
    },
	antialiasing : true,
	lane : {
		cellNumber : 8,
		spacing : 2,
		marginLeft : 2,
		marginRight : 2,
		marginTop : 1,
		marginBottom : 1
	},
    hotKeys : {
        keyboard : {
          start : "U+0050"
        }     
    },
    nature : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0.05
	},
	newYork : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0
	},
	objectMapping : {
		"stupid" : {
			file : "data/root.js"
		}
	},
    unit : {
		speed : 1
	}
}

