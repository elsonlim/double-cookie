import React, { useState, useContext } from "react";
import AppContext from "../contexts/AppContext";
import axios from "../utils/axios";
import "./LoginForm.css";

export const LoginForm = () => {
  const [username, setUsername] = useState("apple9");
  const [password, setPassword] = useState("smith");
  const { setIsLogin } = useContext(AppContext);

  return (
    <div className={"form"}>
      <label>username:</label>
      <input
        type="text"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <label>password:</label>
      <input
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <button
        onClick={async () => {
          const res = await axios.post("/user/login", {
            username,
            password,
          });

          if (res.status === 200) {
            localStorage.setItem("XSRF-TOKEN", res.data["XSRF-TOKEN"]);
            setIsLogin(true);
          }
        }}
      >
        Submit
      </button>
    </div>
  );
};
