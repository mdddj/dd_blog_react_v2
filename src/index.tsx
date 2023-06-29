import * as React from "react"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import {RecoilRoot} from "recoil";
import {createRoot} from "react-dom/client";


const container = document.getElementById('root')!!;
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <RecoilRoot>
        <App />
    </RecoilRoot>
  </React.StrictMode>,
)

serviceWorker.unregister()
reportWebVitals()
