import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import dayjs from "dayjs";
dayjs.locale("vi");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
