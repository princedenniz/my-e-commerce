import React, { useContext, useState } from "react";
import "./CSS/Login.css";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [state, setState] = useState("signup");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const { fetchCartData } = useContext(ShopContext);
  const navigate = useNavigate();

  // Function to toggle between login and signup
  const toggleState = () => {
    setState(state === "signup" ? "login" : "signup");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // console.log(formData)

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        //save token and navigate to the hom page
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert(data.message, "signup failed");
      }
    } catch (error) {
      alert("Server error during signup, pls try again");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json(); // Await the JSON response
      console.log(data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        fetchCartData();
        navigate("/"); // Adjust the route as necessary
      } else {
        alert("email doesn't exist or incorrect password");
      }
    } catch (error) {
      alert("Server Error during login, Please try again");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        {state === "signup" ? <h1> sign up</h1> : <h1>Login</h1>}
        {/* <h1>sign up</h1> */}
        <div className="loginsignup-fields">
          {state === "signup" ? (
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              placeholder="Your Name"
            />
          ) : (
            <></>
          )}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={state === "signup" ? handleSignUp : handleLogin}>
          {state === "signup" ? "Signup" : "Login"}
        </button>

        {state === "signup" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={toggleState}>Login here</span>{" "}
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={toggleState}>Click here</span>{" "}
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms and use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
