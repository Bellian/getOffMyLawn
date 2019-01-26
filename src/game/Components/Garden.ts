import { vec3 } from 'gl-matrix';
import {Game as GameClass} from '../Game';
import {SceneComponents} from '../SceneComponent';

export class Garden extends SceneComponents {
    constructor(Game: GameClass) {
        super(Game);
        this.BaseElement.classList.add('garden');
        this.createGrass();
    }

    private createGrass() {
        for (let i = 0; i < 100; i++) {
            const grass = document.createElement('div');
            grass.classList.add('grass');
            this.BaseElement.appendChild(grass);
            grass.style.left = (Math.random() * 100) + '%';
            grass.style.top = (Math.random() * 100) + '%';

            grass.addEventListener('mouseenter', () => {
                return;
            });
        }
    }

    public tick() {
        // this.Rotation = vec3.add(this.Rotation, this.Rotation, [0, Math.random(), 0] as any);
    }
}
