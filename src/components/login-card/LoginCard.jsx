import React, { useState } from "react";
import "./LoginCard.scss";
import { ReactComponent as Logo } from "../../assets/images/beekeeper_logo.svg";
import CustomButton from "../custom-button/CustomButton";
import IconInput from "../icon-input/IconInput";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

const LoginCard = () => {
  const [userCredentials, setUserCredentials] = useState({
    id: "",
    password: ""
  });

  const { id, password } = userCredentials;

  const handleSubmit = () => {
    console.log(id, password);
    setTimeout(() => {}, 600000);
  };

  const handleChange = event => {
    const { value, name } = event.target;
    console.log("asdsd");
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div className="login-card">
      <div className="logo-container">
        <Logo />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="label-input">
          <label className="label">ID</label>
          <IconInput
            name="id"
            value={id}
            handleChange={handleChange}
            type="text"
            icon={faUser}
          />
        </div>
        <div className="label-input-last">
          <label className="label">Contraseña</label>
          <IconInput
            name="password"
            value={password}
            handleChange={handleChange}
            type="password"
            icon={faKey}
          />
        </div>
        <CustomButton type="submit" text="ACCEDER" width="65%" />
      </form>
    </div>
  );
};
export default LoginCard;
