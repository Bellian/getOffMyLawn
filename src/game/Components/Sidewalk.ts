import { vec3 } from 'gl-matrix';
import {Game as GameClass} from '../Game';
import {SceneComponents} from '../SceneComponent';

export class Sidewalk extends SceneComponents {
    constructor(Game: GameClass) {
        super(Game);
        this.BaseElement.classList.add('sidewalk');
    }

    public tick() {
        // this.Rotation = vec3.add(this.Rotation, this.Rotation, [0, Math.random(), 0] as any);
    }
}
