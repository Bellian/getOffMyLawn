import {Camera} from './Camera';
import {Scene} from './Scene';

import { vec3 } from 'gl-matrix';
import { Garden } from './Components/Garden';
import { Human } from './Components/Human';
import { Sidewalk } from './Components/Sidewalk';
import { Street } from './Components/Street';

export class Game {

    public BaseElement!: HTMLDivElement;
    public Camera!: Camera;
    public Scene!: Scene;

    constructor(public Root: HTMLDivElement) {
        this.Root.classList.add('ggj-game');
        this.BaseElement = document.createElement('div');
        this.initBaseElement();

        const a = this.Root.querySelector('.dummy iframe') as HTMLIFrameElement;
        a.src = "./dummy/get-of-my-lawn.html";

        let initialized = false;
        const  init = (e: any) => {
            e.stopPropagation();
            if (initialized) { return; }
            initialized = true;

            this.createCamera();
            this.createScene();

            this.Root.appendChild(this.BaseElement);
            this.Root.classList.add('gui');
            setTimeout(() => {
                this.Root.classList.add('init');
            }, 1);

            setInterval(() => {
                this.tick();
                this.Scene.tick();
            }, 16);
        };
        this.BaseElement.addEventListener('click', init);
        this.BaseElement.addEventListener('mousewheel', init);
        this.BaseElement.addEventListener('touchend', init);
    }

    private initBaseElement() {
        this.BaseElement = document.createElement('div');
        this.BaseElement.classList.add('base');
        this.Root.appendChild(this.BaseElement);
        this.resize();

        window.addEventListener('resize', () => {
            this.resize();
        });

        const startScreen = document.createElement('div');
        startScreen.classList.add('start');
        startScreen.innerHTML = `<p>Your home is overrun by annoying neighbours.<br>You need to defend it!<br>Send them all away!<p><p><b>Touch and hold to play.</b></p>`;
        this.Root.appendChild(startScreen);

        const lostScreen = document.createElement('div');
        lostScreen.classList.add('lostScreen');
        lostScreen.innerHTML = '';
        this.Root.appendChild(lostScreen);
    }

    private FillLostScreen() {
        const lostScreen = this.Root.querySelector('.lostScreen');
        if (lostScreen === null) { return; }
        lostScreen.innerHTML = `<p>You managed to send away <span class="score">${this.HitEnemies}</span> neighbours.<br>Well done.<p><p><b>Touch and hold to play again.</b></p>`;
    }

    private resize() {
        const rect = this.Root.getBoundingClientRect();
        const size = Math.min(rect.height, rect.width);
        const scale = size / 1024;
        this.BaseElement.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;

        console.log('resize', (rect.height > rect.width) ? '2vw' : '2vh');
        this.Root.style.fontSize = (rect.height > rect.width) ? '2vw' : '2vh';
    }

    private createCamera() {
        this.Camera = new Camera(this);
    }

    private createScene() {
        this.Scene = new Scene(this);

        let a: any = new Garden(this);
        a = new Street(this);
        a = new Sidewalk(this);

        /*
        for (let x = -2; x <= 2; x++) {
            for (let y = -2; y <= 2; y++) {
                const component = new Circle();
                this.Scene.add(component);

                component.Location = vec3.set(component.Location, x * 100, y * 100, 0);

            }
        }*/

        let canstartgame = true;
        const delayStart = () => {
            canstartgame = false;
            setTimeout(() => {
                canstartgame = true;
            }, 1000);
        };

        this.Root.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!canstartgame) { return; }
            this.GameStarted = true;
        });
        this.Root.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.GameStarted = false;
            delayStart();
            this.Root.classList.add('lost');
            this.FillLostScreen();
        });
        this.Root.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (!canstartgame) { return; }
            this.GameStarted = true;
        });
        this.Root.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.GameStarted = false;
            delayStart();
            this.Root.classList.add('lost');
            this.FillLostScreen();
        });
        this.Root.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
            for (let t = 0; t < e.changedTouches.length; t++) {
                const touch = e.changedTouches.item(t);
                if (touch === null) { continue; }
                const touched = document.elementFromPoint(touch.pageX, touch.pageY);
                if (touched === null) { return; }
                const event = new MouseEvent('mouseenter');
                touched.dispatchEvent(event);
            }
        });
    }

    private GameStarted: boolean = false;
    private LastSpawn: number = 0;
    public GameSpeed: number = 1;
    public HitEnemies: number = 0;

    private startGame() {
        setInterval(() => {
            const start = vec3.create();
            const end = vec3.create();
            start[0] = Math.random() > 0.5 ? -1000 : 1000;
            start[1] = (Math.random() - 0.5) * 700;
            end[1] = start[1];
            end[0] = (Math.random() - 0.5) * 700;
            this.Scene.add(new Human(this, start,  end));
        }, 2000);
    }

    private tick() {
        if (this.GameStarted) {
            // perform game logic
            if (!this.Root.classList.contains('active')) {
                this.Root.classList.add('active');
                this.Root.classList.remove('lost');
                this.LastSpawn = 0;
                this.GameSpeed = 1;
                this.HitEnemies = 0;
            }
            if (this.LastSpawn + (2000 / this.GameSpeed) < Date.now()) {
                const start = vec3.create();
                const end = vec3.create();
                start[0] = Math.random() > 0.5 ? -1000 : 1000;
                start[1] = (Math.random() - 0.5) * 700;
                end[1] = start[1];
                end[0] = (Math.random() - 0.5) * 700;
                const human = new Human(this, start,  end);
                this.LastSpawn = Date.now();
                this.GameSpeed += 0.1;
            }

            let count = 0;
            for (const component of this.Scene.Components) {
                if (component instanceof Human && component.Arrived) {
                    count++;
                }
            }
            if (count >= 10) {
                // you lost
                this.GameStarted = false;
                this.Root.classList.add('lost');
                this.FillLostScreen();
            }

        } else {
            // game nit started
            if (this.Root.classList.contains('active')) {
                this.Root.classList.remove('active');

                for (const component of this.Scene.Components) {
                    if (component instanceof Human) {
                        component.Hit = true;
                    }
                }
            }
        }
    }
}
