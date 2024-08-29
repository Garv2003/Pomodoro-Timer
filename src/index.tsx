/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Provider } from "./context/MyContext";

const root = document.getElementById("root");

root &&
  render(
    () => (
      <Provider>
        <App />
      </Provider>
    ),
    root
  );
