import { createSignal } from "solid-js";
import { useMyContext } from "../context/MyContext";
import Button from "./Button";
import Modal from "./Modal";
import { Redo, Settings } from "lucide-solid";

const Header = () => {
  const {
    type,
    selectType,
    time,
    startTimer,
    isPlaying,
    handleTimeEnd,
    modalState,
    setModalState,
    timeState,
    setTimeState,
  } = useMyContext();
  const [isSettingsOpen, setIsSettingsOpen] = createSignal<boolean>(false);

  function onClose() {
    setIsSettingsOpen(false);
  }

  return (
    <>
      <header class="flex flex-col justify-center items-center">
        <div class="flex space-x-4 mb-4">
          <Button selectType={selectType} type={type} name="pomodoro" />
          <Button selectType={selectType} type={type} name="short break" />
          <Button selectType={selectType} type={type} name="long break" />
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
            <Redo size="45" />
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen())}>
            <Settings size="45" />
          </button>
        </div>
      </header>
      {isSettingsOpen() && (
        <Modal
          onClose={onClose}
          modalState={modalState}
          setModalState={setModalState}
          timeState={timeState}
          setTimeState={setTimeState}
        />
      )}
    </>
  );
};

export default Header;
