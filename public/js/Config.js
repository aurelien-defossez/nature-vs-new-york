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
	alerts : {
		ttl : 1 // in seconds
	},
    nature : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0.05,
    	mapping : {
    		buildings: {
	    		'input0' : 'manaTree',
	    		'input1' : 'protectorTree',
	    		'input2' : 'rootTree',
	    		'input3' : 'bramble'
	    	},
	    	units: {
	    		'input0' : 'sapCarrier',
	    		'input1' : 'wolf',
	    		'input2' : 'bear',
	    		'input3' : 'ent'
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
    	mapping : {
    		buildings: {
	    		'input0' : 'bank',
	    		'input1' : 'policeStation',
	    		'input2' : 'workShop',
	    		'input3' : 'armedConcrete'
	    	},
	    	units: {
	    		'input0' : 'builder',
	    		'input1' : 'lumberjack',
	    		'input2' : 'policeman',
	    		'input3' : 'mecha'
	    	}
    	}
	},
	units: {
		// Porteur de sève
		sapCarrier: {
			attack: 0,
			buildingAttack: 0,
			cooldown: 1,
			hp: 5,
			speed: 0.2,
			cost: 10,
			time: 10,
			repairSpeed: 2
		},
		// Loup
		wolf: {
			attack: 1.5,
			buildingAttack: 1,
			cooldown: 0.5,
			hp: 15,
			speed: 1.0,
			cost: 4,
			time: 4
		},
		// Ours
		bear: {
			attack: 5,
			buildingAttack: 5,
			cooldown: 1,
			hp: 5,
			speed: 0.4,
			cost: 8,
			time: 6
		},
		// Ent
		ent: {
			attack: 20,
			buildingAttack: 20,
			cooldown: 2,
			hp: 50,
			speed: 0.2,
			cost: 20,
			time: 20
		},
		// Constructeur
		builder: {
			attack: 0,
			buildingAttack: 0,
			cooldown: 1,
			hp: 5,
			speed: 0.2,
			cost: 20,
			time: 10,
			captureSpeed: 0.1
		},
		// Bûcheron
		lumberjack: {
			attack: 2,
			buildingAttack: 10,
			cooldown: 1,
			hp: 15,
			speed: 0.4,
			cost: 5,
			time: 5
		},
		// Policier
		policeman: {
			attack: 2,
			buildingAttack: 1,
			cooldown: 1,
			hp: 10,
			speed: 0.5,
			cost: 2,
			time: 2
		},
		// Mécha
		mecha: {
			attack: 10,
			buildingAttack: 10,
			cooldown: 1,
			hp: 50,
			speed: 0.25,
			cost: 20,
			time: 20
		}
	},
	buildings: {
		// Arbre Mana
		manaTree: {
			hp: 100,
			cost: 20,
			time: 20,
			manaPerSecond: 1.0,
			modelFile : "data/manaTree.js"
		},
		// Arbre Protecteur
		protectorTree: {
			hp: 100,
			cost: 20,
			time: 20,
			attack: 9
		},
		// Arbre à Racines
		rootTree: {
			hp: 100,
			cost: 20,
			time: 20,
			captureSpeed: 0.05
		},
		// Ronces
		brambles: {
			cost: 10,
			time: 10,
			attack: 2
		},
		// Banque
		bank: {
			hp: 100,
			cost: 20,
			time: 20,
			manaPerSecond: 1.0,
			modelFile : "data/bank.js"
		},
		// Station de Police
		policeStation: {
			hp: 100,
			cost: 20,
			time: 20,
			policemansPerSecond: 0.2
		},
		// Atelier
		workshop: {
			hp: 100,
			cost: 20,
			time: 20,
			productionBonus: 0.2
		},
		// Béton Armé
		armedConcrete: {
			hp: 50,
			cost: 10,
			time: 10
		},
		// Case nature
		natureCell : {
    			modelFile : "data/root.js"
		},
		// Case newYork
		newYorkCell : {
    			modelFile : "data/rails.js"
		},
	},
	objectMapping : {
		"stupid" : {
			file : "data/root.js"
		}
	},
    unit : {
		speed : 1,
		time : 3, //in seconds
		cost : 10
	},
	controls : {
		'gamepad' :{
			'A' : 'input0',
			'B' : 'input1',
			'X' : 'input2',
			'Y' : 'input3'
		},
        keyboard1 :{
			'U+0051' : 'input0', // Letter Q
			'U+0053' : 'input1', // Letter S
			'U+0041' : 'input2', // Letter A
			'U+005A' : 'input3', // Letter Z
            'U+0044' : 'input4', // Letter D
			'U+0058' : 'input5' // Letter X
		},
        keyboard2 :{
			'U+004A' : 'input0', // Letter J
			'U+004B' : 'input1', // Letter K
			'U+0055' : 'input2', // Letter U
			'U+0049' : 'input3', // Letter I
            'U+004F' : 'input4', // Letter O
			'U+004C' : 'input5' // Letter L
		}
	}
}

