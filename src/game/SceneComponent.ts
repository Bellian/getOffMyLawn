import {quat, vec3} from 'gl-matrix';
import {Game as GameClass} from './Game';

export class SceneComponents {
    public BaseElement: HTMLDivElement;
    public TransformElement: HTMLDivElement;
    private location: vec3 = vec3.create();
    private scale: vec3 = vec3.fromValues(1, 1, 1);
    private rotation: vec3 = vec3.create();

    constructor(public Game: GameClass) {
        this.BaseElement = document.createElement('div');
        this.TransformElement = document.createElement('div');
        this.TransformElement.classList.add('transform');
        this.TransformElement.appendChild(this.BaseElement);

        Game.Scene.add(this);
    }

    public destroy() {
        this.Game.Scene.remove(this);
    }

    get Location() {
        return vec3.clone(this.location);
    }
    set Location(value: vec3) {
        vec3.copy(this.location, value);
        this.update();
        return;
    }
    get Scale() {
        return vec3.clone(this.scale);
    }
    set Scale(value: vec3) {
        vec3.copy(this.scale, value);
        this.update();
        return;
    }
    get Rotation() {
        return vec3.clone(this.rotation);
    }
    set Rotation(value: vec3) {
        vec3.copy(this.rotation, value);
        this.update();
        return;
    }

    private update() {
        this.TransformElement.style.transform =
            `translate(${this.location[0]}px,${this.location[1]}px) translateZ(${this.location[2]}px)
            rotateX(${this.rotation[0]}deg) rotateY(${this.rotation[1]}deg) rotateZ(${this.rotation[2]}deg)
            scale3d(${this.scale[0]}, ${this.scale[1]}, ${this.scale[2]})`;
    }

    public tick() {
        return;
    }

}
