import {Game} from './Game';

window.addEventListener('load', () => {
    const root: HTMLDivElement = document.getElementById('ggj-game') as HTMLDivElement;
    const game = new Game(root);
});
