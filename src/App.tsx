import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Navbar, Footer, Header } from "./components";
import { useMyContext } from "./context/MyContext.tsx";

function App() {
  const { type, setTimeBasedOnType, modalState } = useMyContext();
  const [isFullScreen, setIsFullScreen] = createSignal<boolean>(false);

  onMount(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
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
    window.removeEventListener("fullscreenchange", () => {
      setIsFullScreen(document.fullscreenElement !== null);
    });
  });

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
      class="bg-black flex flex-col justify-center items-center h-screen bg-center bg-cover bg-no-repeat text-white transition-[background-image] duration-500"
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
