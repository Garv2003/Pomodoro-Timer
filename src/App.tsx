import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import {  Header } from "./components";
import {Navbar, Footer} from "./layouts"
import { useMyContext } from "./context/MyContext.tsx";

function App() {
  const { type, setTimeBasedOnType, modalState, setIsVisibility } =
    useMyContext();
  const [isFullScreen, setIsFullScreen] = createSignal<boolean>(false);

  onMount(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });

    window.addEventListener("visibilitychange", async function () {
      if (document.visibilityState === "visible") {
        await wakeScreen();
        setIsVisibility(true);
      }
      if (document.visibilityState === "hidden") {
        setIsVisibility(false);
      }
    });

    window.addEventListener("fullscreenchange", () => {
      setIsFullScreen(document.fullscreenElement !== null);
    });
  });

  createEffect(() => {
    setTimeBasedOnType(type());
  });

  onCleanup(() => {
    window.removeEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });

    window.removeEventListener("visibilitychange", function () {});

    window.removeEventListener("fullscreenchange", () => {
      setIsFullScreen(document.fullscreenElement !== null);
    });
  });

  async function wakeScreen() {
    await navigator.wakeLock.request("screen");
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

  return (
    <div
      class="bg-black flex flex-col justify-center items-center h-screen bg-center bg-cover bg-no-repeat text-white transition-[background-image] duration-500 p-1 md:p-0"
      style={
        modalState.background != "black"
          ? `background-image: url(${modalState.background})`
          : "background-color: black"
      }
    >
      <Navbar />
      <Header />
      <Footer toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen} />
    </div>
  );
}

export default App;
