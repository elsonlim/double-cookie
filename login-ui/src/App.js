import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "./utils/axios";
import { LoginForm } from "./components/LoginForm";
import AppContext from "./contexts/AppContext";
import { Info } from "./components/Info";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    axios.get("/user/info").then(res => {
      if (res.data) {
        setInfo(res.data);
      }
    });
  }, [info, setInfo]);

  return (
    <AppContext.Provider
      value={{
        isLogin,
        setIsLogin: value => setIsLogin(value),
      }}
    >
      <div className="App">
        <LoginForm />
        {!!info && <Info info={info} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
