/**
 * Actions on Gamepad:
 *
 * faceButton0: Button A
 * faceButton1: Button B
 * faceButton2: Button X
 * faceButton3: Button Y
 * dpadUp: Cursor Up
 * dpadDown: Cursor Down
 */
function PadController(padNumber) {
    this.padNumber = padNumber;

    this.buttons = {
        a: 0,
        b: 0,
        x: 0,
        y: 0
    }
}

PadController.prototype.checkAction = function(player) {

    var pads,
        pad;

    if(Gamepad.supported) {
        pads = Gamepad.getStates();
        pad = pads[this.padNumber];

        if(pad) {
            if(pad.faceButton0 && !this.buttons.a) {
                arrowAction(player, pad, 'A')
            } else if(pad.faceButton1 && !this.buttons.b) {
                arrowAction(player, pad, 'B')
            } else if(pad.faceButton2 && !this.buttons.x) {
                arrowAction(player, pad, 'X')
            } else if(pad.faceButton3 && !this.buttons.y) {
                arrowAction(player, pad, 'Y')
            }

            // Enregistrement du statut du pad
            this.savePadState(pad);
        }
    }
}

PadController.prototype.savePadState = function(pad) {
    this.buttons.a = pad.faceButton0;
    this.buttons.b = pad.faceButton1;
    this.buttons.x = pad.faceButton2;
    this.buttons.y = pad.faceButton3;
}

function arrowAction(player, pad, button) {
    var lane;
    if( pad.dpadUp ) {
        lane = 2;
    } else if ( pad.dpadDown ) {
        lane = 0;
    } else {
        lane = 1;
    }
    player.createUnit(button, lane);
}