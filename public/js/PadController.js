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
}

PadController.prototype.checkAction = function(player) {

    var pads,
        pad;

    if(Gamepad.supported) {
        pads = Gamepad.getStates();
        pad = pads[this.padNumber];

        if(pad) {
            if(pad.faceButton0) {
                arrowAction(player, pad, 'A')
            } else if(pad.faceButton1) {
                arrowAction(player, pad, 'B')
            } else if(pad.faceButton2) {
                arrowAction(player, pad, 'X')
            } else if(pad.faceButton3) {
                arrowAction(player, pad, 'Y')
            }
        }
    }
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