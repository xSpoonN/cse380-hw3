import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import PlayerState from "./PlayerState";

export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        // If we're falling, the vertical velocity should be >= 0
        this.parent.velocity.y = 0;
    }

    update(deltaT: number): void {

        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            let chealth = this.parent.health;
            this.parent.health -= Math.floor(this.parent.velocity.y / 200);
            if (chealth != this.parent.health) {
                /* this.emitter.fireEvent("DAMAGED", {curhp: this.parent.health, maxhp: this.parent.maxHealth}); */
                console.log("Took Damage");
                let damagedAudio = this.owner.getScene().getDamagedAudioKey();
		        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: damagedAudio, loop: false, holdReference: false});
                this.owner.animation.playIfNotAlready("TAKING_DAMAGE");
                setTimeout(() => {
                    this.owner.animation.playIfNotAlready("IDLE");
                    console.log("Damage done");
                }, 150);
            }
            this.finished(PlayerStates.IDLE);
        } 
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

    }

    onExit(): Record<string, any> {
        return {};
    }
}