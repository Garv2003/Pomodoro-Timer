import { createSignal, For } from "solid-js";
import { audios, themes } from "../utils/theme.ts";
import Button from "./Button.tsx";
import { X } from "lucide-solid";

type ModalProps = {
  onClose: () => void;
  modalState: any;
  timeState: any;
  setModalState: (state: any) => void;
  setTimeState: (state: any) => void;
};

function Modal(props: ModalProps) {
  const [selectTab, setSelectTab] = createSignal<string>("General");

  function changeBackground(name: string) {
    props.setModalState({ theme: name });
    const theme = themes.find((theme) => theme.name === name);
    if (theme) {
      props.setModalState({ background: theme.url });
    }
  }

  function changeAudio(name: string) {
    props.setModalState({ audio: name });
    const audio = audios.find((audio) => audio.name === name);
    if (audio) {
      props.setModalState({ audioUrl: audio.url });
    }
  }

  function resetToDefault() {
    props.setModalState({
      theme: "Seoul Sunrise",
      background: "/img/Seoul_Sunrise.jpg",
      audioUrl: "/audio/Bell.mp3",
      audio: "Bell",
      cycle: false,
    });
    props.setTimeState({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 10,
    });
  }

  function changeTab(tab: string) {
    switch (tab) {
      case "General":
        return (
          <div class="flex flex-col space-y-4 w-full">
            <h2 class="text-2xl">Select Theme</h2>
            <select
              class="bg-white text-black text-xl rounded-lg p-2"
              onChange={(e) => changeBackground(e.target.value)}
            >
              <For each={themes}>
                {(theme) => (
                  <option selected={theme.name === props.modalState.theme}>
                    {theme.name}
                  </option>
                )}
              </For>
            </select>
          </div>
        );
      case "Timers":
        return (
          <div class="flex flex-col space-y-4 w-full">
            <h2 class="text-2xl">Timers</h2>
            <div class="flex space-x-4 w-full">
              <div class="flex flex-col space-y-2">
                <label class="">Pomodoro</label>
                <input
                  type="number"
                  class="text-white border border-white bg-transparent text-xl rounded-lg w-16 py-1 px-3"
                  value={props.timeState.pomodoro}
                  onInput={(e) =>
                    props.setTimeState({
                      ...props.timeState,
                      pomodoro: parseInt(e.currentTarget.value),
                    })
                  }
                  min={1}
                  step={1}
                  max={90}
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="">Short Break</label>
                <input
                  type="number"
                  class="text-white border border-white bg-transparent text-xl rounded-lg w-16 py-1 px-3"
                  value={props.timeState.shortBreak}
                  onInput={(e) =>
                    props.setTimeState({
                      ...props.timeState,
                      shortBreak: parseInt(e.currentTarget.value),
                    })
                  }
                  min={1}
                  step={1}
                  max={90}
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="">Long Break</label>
                <input
                  type="number"
                  class="text-white border border-white bg-transparent text-xl rounded-lg w-16 py-1 px-3"
                  value={props.timeState.longBreak}
                  onInput={(e) =>
                    props.setTimeState({
                      ...props.timeState,
                      longBreak: parseInt(e.currentTarget.value),
                    })
                  }
                  min={1}
                  step={1}
                  max={90}
                />
              </div>
            </div>
            <div class="flex space-x-3">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  onClick={() =>
                    props.setModalState({ cycle: !props.modalState.cycle })
                  }
                  checked={props.modalState.cycle}
                />
                <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <div class="flex flex-col space-x-1">
                <span>
                  Use the Pomodoro sequence: Pomodoro → short break, repeat 4x,
                  then one long break
                </span>
                <span class="text-gray-500">
                  Number of Pomodoros complete is indicated with dots under
                  'Pomodoro'
                </span>
              </div>
            </div>
          </div>
        );
      case "Sounds":
        return (
          <div class="flex flex-col space-y-4 w-full">
            <h2 class="text-2xl">Sounds</h2>
            <select
              class="bg-white text-black text-xl rounded-lg p-2"
              onChange={(e) => changeAudio(e.target.value)}
            >
              <For each={audios}>
                {(audio_item) => (
                  <option selected={audio_item.name === props.modalState.audio}>
                    {audio_item.name}
                  </option>
                )}
              </For>
            </select>
          </div>
        );
    }
  }

  return (
    <div
      class="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-10 transition-[background-color] duration-500"
      onClick={props.onClose}
    >
      <div
        class="bg-black text-white p-5 flex flex-col justify-center items-center rounded-xl w-[500px] h-[480px] space-y-4 z-10 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button class="flex justify-end w-full" onClick={props.onClose}>
          <X />
        </button>
        <header class="w-full flex justify-between space-x-10 p-2 h-full">
          <div class="flex flex-col space-y-4">
            <Button
              selectType={setSelectTab}
              type={selectTab}
              name="General"
              small={true}
            />
            <Button
              selectType={setSelectTab}
              type={selectTab}
              name="Timers"
              small={true}
            />
            <Button
              selectType={setSelectTab}
              type={selectTab}
              name="Sounds"
              small={true}
            />
          </div>
          {changeTab(selectTab())}
        </header>
        <footer class="w-full flex justify-end mt-4 space-x-4">
          <button
            class="border border-red-600 text-red-600 p-2 rounded-lg"
            onClick={resetToDefault}
          >
            Reset to default
          </button>
          <button
            onClick={props.onClose}
            class="bg-gray-600 text-white p-2 rounded-lg"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Modal;
