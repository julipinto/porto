/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

const root = document.getElementById("root");

if (root instanceof HTMLElement) {
  root.innerHTML = ""; 

  render(() => <App />, root);
}