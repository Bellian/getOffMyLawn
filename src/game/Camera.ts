import {quat, vec3} from 'gl-matrix';
import {Game as GameClass} from './Game';

export class Camera {

    public CameraElement!: HTMLDivElement;

    private Rotation: quat = quat.create();
    private Position: vec3 = vec3.create();

    constructor(private Game: GameClass) {
        this.CameraElement = document.createElement('div');
        this.CameraElement.classList.add('camera');
        this.Game.BaseElement.appendChild(this.CameraElement);
    }

    public move(x: number, y: number) {
        return;
    }
}
