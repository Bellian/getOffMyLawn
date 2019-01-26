import {Game as GameClass} from './Game';
import {SceneComponents} from './SceneComponent';

export class Scene {

    public SceneElement!: HTMLDivElement;
    public Components: Set<SceneComponents> = new Set();

    constructor(private Game: GameClass) {
        this.SceneElement = document.createElement('div');
        this.SceneElement.classList.add('scene');
        this.Game.Camera.CameraElement.appendChild(this.SceneElement);
    }

    public add(element: SceneComponents) {
        this.Components.add(element);
        this.SceneElement.appendChild(element.TransformElement);
        return;
    }

    public remove(element: SceneComponents) {
        this.Components.delete(element);
        this.SceneElement.removeChild(element.TransformElement);
        return;
    }

    public tick() {
        for (const component of this.Components) {
            component.tick();
        }
    }
}
