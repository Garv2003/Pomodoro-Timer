export function playAudio(url: string) {
    const audio = new Audio(url);
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, 10000);
}


