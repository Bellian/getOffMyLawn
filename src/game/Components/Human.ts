import { vec3 } from 'gl-matrix';
import {Game as GameClass} from '../Game';
import {SceneComponents} from '../SceneComponent';

export class Human extends SceneComponents {

    public Hit: boolean = false;
    public Arrived: boolean = false;

    private StartPosition: vec3 = vec3.create();
    private DestinationPosition: vec3 = vec3.create();
    private Speed: number = 5;

    constructor(Game: GameClass, start: vec3, end: vec3) {
        super(Game);
        this.BaseElement.classList.add('human');

        const torso = document.createElement('div');
        torso.classList.add('torso');
        this.BaseElement.appendChild(torso);
        torso.style.borderTopColor = `rgba(${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0})`;

        const feet = document.createElement('div');
        feet.classList.add('feet');
        this.BaseElement.appendChild(feet);

        const head = document.createElement('div');
        head.classList.add('head');
        this.BaseElement.appendChild(head);

        const hitbox = document.createElement('div');
        hitbox.classList.add('hitbox');
        this.BaseElement.appendChild(hitbox);

        hitbox.addEventListener('mouseenter', () => {
            if (!this.Hit) {
                this.Hit = true;
                this.Game.HitEnemies++;
            }
        });

        this.StartPosition = start;
        this.DestinationPosition = end;
        this.Location = this.StartPosition;
    }

    public tick() {
        const direction: vec3 = vec3.create();
        const speed = this.Speed * this.Game.GameSpeed;
        if (!this.Hit) {
            vec3.sub(direction, this.DestinationPosition, this.Location);
        } else {
            vec3.sub(direction, this.StartPosition, this.Location);
        }
        if (vec3.length(direction) > speed) {
            this.Arrived = false;
            vec3.normalize(direction, direction);
            vec3.scale(direction, direction, speed);
        } else {
            this.Arrived = true;

            if (this.Hit === true) {
                // console.log('destroy');
                this.destroy();
            }
        }
        this.Location = vec3.add(this.Location, this.Location, direction);
    }
}
