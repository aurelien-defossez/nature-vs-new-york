Game.config = {
    board : {
      height: 565,
      width:1000
    },
    /*board : {
      height: 450,
      width:800
    },*/
	antialiasing : true,
	lane : {
		cellNumber : 7,
		spacing : 2,
		marginLeft : 2,
		marginRight : 2,
		marginTop : 1,
		marginBottom : 1
	},
	alerts : {
		ttl : 1 // in seconds
	},
    nature : {
		initOwnedCells : 1,
    	hp: 200,
    	startMana: 50,
    	manaPerSecond: 1,
    	captureSpeed: 0.025,
    	mapping : {
    		buildings: {
	    		'input0' : 'manaTree',
	    		'input1' : 'rootTree',
	    		// 'input2' : 'protectorTree',
	    		// 'input3' : 'brambles'
	    	},
	    	units: {
	    		'input0' : 'wolf',
	    		'input1' : 'bear',
	    		// 'input2' : 'sapCarrier',
	    		// 'input3' : 'ent'
	    	}
    	}
	},
	newYork : {
		initOwnedCells : 2,
    	hp: 200,
    	startMana: 50,
    	manaPerSecond: 1,
    	captureSpeed: 0,
    	mapping : {
    		buildings: {
	    		'input0' : 'bank',
	    		'input1' : 'policeStation',
	    		// 'input2' : 'workShop',
	    		// 'input3' : 'armedConcrete'
	    	},
	    	units: {
	    		'input0' : 'policeman',
	    		'input1' : 'lumberjack',
	    		'input2' : 'builder',
	    		// 'input3' : 'mecha'
	    	}
    	}
	},
	units: {
		// Porteur de sève
		sapCarrier: {
			attack: 1,
			buildingAttack: 1,
			cooldown: 1,
			hp: 5,
			speed: 0.2,
			cost: 10,
			time: 10,
			repairSpeed: 2,
			width: 0.3
		},
		// Loup
		wolf: {
			attack: 1.0,
			buildingAttack: 0.75,
			cooldown: 0.5,
			hp: 12,
			speed: 1.0,
			cost: 4,
			time: 3,
			modelFile: "data/wolf.js",
			width: 0.5
		},
		// Ours
		bear: {
			attack: 5,
			buildingAttack: 5,
			cooldown: 1,
			hp: 20,
			speed: 0.4,
			cost: 10,
			time: 5,
			modelFile: "data/bear.js",
			width: 0.5
		},
		// Ent
		ent: {
			attack: 20,
			buildingAttack: 20,
			cooldown: 2,
			hp: 50,
			speed: 0.2,
			cost: 20,
			time: 20,
			width: 0.5
		},
		// Constructeur
		builder: {
			attack: 1,
			buildingAttack: 1,
			cooldown: 1,
			hp: 5,
			speed: 0.2,
			cost: 15,
			time: 5,
			captureSpeed: 0.1,
			modelFile:"data/builder.js",
			width: 0.3
		},
		// Bûcheron
		lumberjack: {
			attack: 5,
			buildingAttack: 10,
			cooldown: 1,
			hp: 15,
			speed: 0.4,
			cost: 10,
			time: 5,
			modelFile:"data/LumberJack.js",
			width: 0.3
		},
		// Policier
		policeman: {
			attack: 1,
			buildingAttack: 1,
			cooldown: 1,
			hp: 10,
			speed: 0.5,
			cost: 3,
			time: 2,
			modelFile:"data/policeman.js",
			width: 0.3
		},
		// Mécha
		mecha: {
			attack: 10,
			buildingAttack: 10,
			cooldown: 1,
			hp: 50,
			speed: 0.25,
			cost: 20,
			time: 20,
			width: 0.5
		}
	},
	buildings: {
		// Scaffolding
		scaffolding: {
			modelFile: "data/scaffolding.js"
		},
		// tree
		tree:{
			modelFile: "data/tree.js"
		},
		// Arbre Mana
		manaTree: {
			hp: 50,
			cost: 20,
			time: 20,
			manaPerSecond: 0.2,
			modelFile : "data/tree_mana.js"
		},
		// Arbre Protecteur
		protectorTree: {
			hp: 100,
			cost: 20,
			time: 20,
			attack: 9,
			modelFile : "data/tree_protector.js"
		},
		// Arbre à Racines
		rootTree: {
			hp: 100,
			cost: 20,
			time: 20,
			captureSpeed: 0.025,
			modelFile : "data/tree_root.js"
		},
		// Ronces
		brambles: {
			cost: 10,
			time: 10,
			attack: 2,
			modelFile : "data/bank.js"
		},
		// Banque
		bank: {
			hp: 50,
			cost: 20,
			time: 20,
			manaPerSecond: 0.2,
			modelFile : "data/bank.js"
		},
		// Station de Police
		policeStation: {
			hp: 100,
			cost: 20,
			time: 20,
			policemansDelay: 10,
			modelFile : "data/police_station.js"
		},
		// Atelier
		workshop: {
			hp: 100,
			cost: 20,
			time: 20,
			productionBonus: 0.2,
			modelFile : "data/bank.js"
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
		'gamepad': {
			'A' : 'input0',
			'B' : 'input1',
			'X' : 'input2',
			'Y' : 'input3'
		},
		'keyboard': {
			'A' : 'input0',
			'B' : 'input1',
			'X' : 'input2',
			'Y' : 'input3'
		},
        keyboard1 :{
        	38: 'up',		// W
        	40: 'down',		// S
        	76: 'input0',	// L
        	79: 'input1',	// O
        	75: 'input2',	// K
        	73: 'input3',	// I
        	57: 'shoulder',	// 9
        	48: 'bumper'	// 0
		},
        keyboard2 :{
        	87: 'up',		// W
        	90: 'up',		// Z
        	83: 'down',		// S
        	49: 'input0',	// 1
        	50: 'input1',	// 2
        	51: 'input2',	// 3
        	52: 'input3',	// 4
        	65: 'shoulder',	// A
        	81: 'shoulder',	// Q
        	69: 'bumper'	// E
		}
	},
	controllerType : 'gamepad',
	buildMonitor : {
		progressRefreshInterval : 300 //in milliseconds
	}
}

