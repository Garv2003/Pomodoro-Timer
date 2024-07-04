import {createEffect, createSignal, onCleanup, onMount} from "solid-js";
import {Redo, Settings} from "lucide-solid";
import Modal from "./components/Modal";
import Button from "./components/Button";
import Footer from "./components/Footer.tsx";
import {createStore} from "solid-js/store";

function App() {

    const [type, setType] = createSignal<string>("pomodoro");
    const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = createSignal<boolean>(false);
    const [isFullScreen, setIsFullScreen] = createSignal<boolean>(false);
    const [timeState, setTimeState] = createStore({
        pomodoro: 1/60,
        shortBreak: 5,
        longBreak: 10
    });
    const [modalState, setModalState] = createStore({
        theme: 'Seoul Sunrise',
        background: '/img/Seoul_Sunrise.jpg',
        audioUrl: '/audio/bell.wav',
        audio: 'Bell',
        cycle: false,
        cycleTime: 4
    });
    const [time, setTime] = createSignal(timeState.pomodoro * 60);

    onMount(() => {
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();
            e.returnValue = "";
        });

        window.addEventListener("fullscreenchange", () => {
            setIsFullScreen(document.fullscreenElement !== null);
        });
    })

    createEffect(() => {
        setTimeBasedOnType(type());
    });

    onCleanup(() => {
        window.removeEventListener("beforeunload", function (e) {
            e.preventDefault();
            e.returnValue = "";
        });
        window.removeEventListener("fullscreenchange", () => {
            setIsFullScreen(document.fullscreenElement !== null);
        })
    })

    function handleTimeEnd() {
        setIsPlaying(false);
        pomodoroCycle();
        setTimeBasedOnType(type());
    }

    function pomodoroCycle() {
        if (modalState.cycle) {
            if (type() === "pomodoro") {
                if (modalState.cycleTime === 1) {
                    setType("long break");
                    setModalState({cycleTime: 4});
                } else {
                    setType("short break");
                    setModalState({cycleTime: modalState.cycleTime - 1});
                }
            } else {
                setType("pomodoro");
            }
        }
    }

    function update() {
        setTime(time() - 1);
        document.title = `${Math.floor(time() / 60).toString().padStart(2, "0")}:${(time() % 60).toString().padStart(2, "0")} | Pomodoro Timer`;
    }

    function tick() {
        let timer = setInterval(() => {
            if (!isPlaying()) {
                clearInterval(timer);
                return;
            }
            if (time() === 0) {
                handleTimeEnd();
                playAudio();
                return;
            }
            update();
        }, 1000);
    }

    function setTimeBasedOnType(type: string) {
        setIsPlaying(false)
        document.title = "Pomodoro Timer"
        if (type === "pomodoro") {
            setTime(timeState.pomodoro * 60);
        } else if (type === "short break") {
            setTime(timeState.shortBreak * 60);
        } else {
            setTime(timeState.longBreak * 60);
        }
    }

    function selectType(type: string) {
        setType(type);
        setTimeBasedOnType(type);
    }

    function startTimer() {
        setIsPlaying(!isPlaying());
        isPlaying() && tick();
    }


    function onClose() {
        setIsSettingsOpen(false);
    }

    function toggleFullScreen() {
        if (isFullScreen()) {
            document.exitFullscreen();
            setIsFullScreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);

        }
    }

    function playAudio(){
        let audio = new Audio(modalState.audioUrl);
        audio.play();
        audio.loop = true;
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 15000);
    }

    return (
        <>
            <div
                class="flex flex-col justify-center items-center h-screen bg-center bg-cover bg-no-repeat text-white transition-[background-image] duration-500"
                style={modalState.background != 'black' ? `background-image: url(${modalState.background})` : 'background-color: black'}
            >
                <h1 class="font-bold text-8xl mb-10">Pomodoro Timer</h1>
                <header class="flex flex-col justify-center items-center">
                    <div class="flex space-x-4 mb-4">
                        <Button selectType={selectType} type={type} name="pomodoro"/>
                        <Button selectType={selectType} type={type} name="short break"/>
                        <Button selectType={selectType} type={type} name="long break"/>
                    </div>
                    <h2 class="font-bold text-9xl">
                        {Math.floor(time() / 60)
                            .toString()
                            .padStart(2, "0")}
                        :{(time() % 60).toString().padStart(2, "0")}
                    </h2>
                    <div class="flex space-x-4 mt-4">
                        <button
                            class="hover:bg-white hover:text-black text-white border border-white text-3xl font-bold py-2 px-4 rounded-2xl"
                            onClick={() => startTimer()}
                        >
                            {isPlaying() ? "Pause" : "Start"}
                        </button>
                        <button onClick={() => handleTimeEnd()}>
                            <Redo size="45"/>
                        </button>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen())}>
                            <Settings size="45"/>
                        </button>
                    </div>
                </header>
                <Footer toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen}/>
            </div>
            {isSettingsOpen() &&
                <Modal onClose={onClose} modalState={modalState} setModalState={setModalState} timeState={timeState}
                       setTimeState={setTimeState}/>}
        </>
    );
}

export default App;
