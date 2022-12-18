export default class AudioPlayer {
    element: HTMLAudioElement;
    playing: boolean;

    constructor(src: string) {
        this.element = document.createElement('audio');
        document.body.appendChild(this.element);
        this.element.src = src;
        this.playing = false;
    }

    play() {
        if (!this.playing) {
            this.playing = true;
            this.element.play();
        }
    }

    stop() {
        this.element.pause();
        this.element.currentTime = 0;
        this.playing = false;
    }
}