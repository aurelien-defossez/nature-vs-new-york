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
    	captureSpeed: 0.05,
    	actions : {
    		'input0' : 'manaTree',
    		'input1' : 'protectorTree',
    		'input2' : 'rootTree',
    		'input3' : 'bramble'
    	},
    	buildings : {
    		'manaTree' : {
    			modelFile : "data/root.js"
    		}
    	}
	},
	newYork : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0,
    	actions : {
    		'input0' : 'bank',
    		'input1' : 'policeStation',
    		'input2' : 'workShop',
    		'input3' : 'armedConcrete'
    	},
    	buildings : {
    		'bank' : {
    			modelFile : "data/rails.js"
    		}
    	}
	},
	objectMapping : {
		"stupid" : {
			file : "data/root.js"
		}
	},
    unit : {
		speed : 1
	},
	controls : {
		'gamepad' :{
			'A' : 'input0',
			'B' : 'input1',
			'X' : 'input2',
			'Y' : 'input3'
		}
	}
}

