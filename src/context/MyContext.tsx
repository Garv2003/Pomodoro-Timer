import { createContext, createSignal, useContext, JSX } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { createStore } from "solid-js/store";

interface Context {
  type: Accessor<string>;
  setType: Setter<string>;
  timeState: { [key: string]: number };
  setTimeState: Setter<{ [key: string]: number }>;
  time: Accessor<number>;
  setTime: Setter<number>;
  setTimeBasedOnType: (type: string) => void;
  selectType: (type: string) => void;
  startTimer: () => void;
  modalState: { [key: string]: string | number | boolean };
  setModalState: Setter<{ [key: string]: string | number | boolean }>;
  isPlaying: Accessor<boolean>;
  handleTimeEnd: () => void;
}

const MyContext = createContext<Context | undefined>(undefined);

export const Provider = (props: { children: JSX.Element }) => {
  const [type, setType] = createSignal<string>("pomodoro");
  const [timeState, setTimeState] = createStore({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
  });
  const [modalState, setModalState] = createStore({
    theme: "Seoul Sunrise",
    background: "/img/Seoul_Sunrise.jpg",
    audioUrl: "/audio/bell.wav",
    audio: "Bell",
    cycle: false,
    cycleTime: 4,
  });
  const [time, setTime] = createSignal(timeState.pomodoro * 60);
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

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
          setModalState({ cycleTime: 4 });
        } else {
          setType("short break");
          setModalState({ cycleTime: modalState.cycleTime - 1 });
        }
      } else {
        setType("pomodoro");
      }
    }
  }

  function update() {
    setTime(time() - 1);
    document.title = `${Math.floor(time() / 60)
      .toString()
      .padStart(2, "0")}:${(time() % 60)
      .toString()
      .padStart(2, "0")} | Pomodoro Timer`;
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
    setIsPlaying(false);
    document.title = "Pomodoro Timer";
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

  function playAudio() {
    let audio = new Audio(modalState.audioUrl);
    audio.play();
    audio.loop = true;
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 15000);
  }
  return (
    <MyContext.Provider
      value={{
        type,
        setType,
        timeState,
        setTimeState,
        time,
        setTime,
        setTimeBasedOnType,
        selectType,
        startTimer,
        modalState,
        setModalState,
        isPlaying,
        handleTimeEnd,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContext.Provider");
  }
  return context;
};
