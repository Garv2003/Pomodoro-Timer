import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Header } from "./components";
import { Navbar, Footer } from "./layouts";
import { useMyContext } from "./context/MyContext.tsx";

function App() {
  const { type, setTimeBasedOnType, modalState, setIsVisibility } = useMyContext();
  const [isFullScreen, setIsFullScreen] = createSignal<boolean>(false);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleVisibilityChange = async () => {
    if (document.visibilityState === "visible") {
      await wakeScreen();
      setIsVisibility(true);
    } else if (document.visibilityState === "hidden") {
      setIsVisibility(false);
    }
  };

  const handleFullScreenChange = () => {
    setIsFullScreen(document.fullscreenElement !== null);
  };

  onMount(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("fullscreenchange", handleFullScreenChange);
  });

  createEffect(() => {
    setTimeBasedOnType(type());
  });

  onCleanup(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("fullscreenchange", handleFullScreenChange);
  });

  async function wakeScreen() {
    try {
      await navigator.wakeLock.request("screen");
      console.log('Wake Lock is active');
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
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
        modalState.background !== "black"
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