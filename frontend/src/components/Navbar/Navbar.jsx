import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../Assets/Frontend_Assets/logo.png";
import cart_icon from "../../Assets/Frontend_Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import nav_dropdown from "../../Assets/Frontend_Assets/nav_dropdown.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const navigate = useNavigate();

  const { getTotalItems, handleLogout } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdpwn_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function from context
    navigate("/"); // Navigate to home after logout
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <Link style={{textDecoration:"none"}} to="/">
        <p>SHOPPER</p>
        
        </Link>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdpwn_toggle}
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>{" "}
          {menu === "shop" ? <hr /> : ""}{" "}
        </li>
        <li
          onClick={() => {
            setMenu("mens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "mens" ? <hr /> : ""}{" "}
        </li>
        <li
          onClick={() => {
            setMenu("womens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>{" "}
          {menu === "womens" ? <hr /> : ""}{" "}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>{" "}
          {menu === "kids" ? <hr /> : ""}{" "}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("token") ? (
          <button
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        ) : (
          <Link style={{ textDecoration: "none" }} to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link style={{ textDecoration: "none" }} to="cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{getTotalItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
