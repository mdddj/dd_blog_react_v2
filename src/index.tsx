import * as React from "react"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import {RecoilRoot} from "recoil";
import {createRoot} from "react-dom/client";

import {NextUIProvider} from "@nextui-org/react";
const container = document.getElementById('root')!!;
const root = createRoot(container)
root.render(
  <NextUIProvider>
      <React.StrictMode>
          <RecoilRoot>
              <App />
          </RecoilRoot>
      </React.StrictMode>
  </NextUIProvider>,
)

serviceWorker.unregister()
reportWebVitals()
