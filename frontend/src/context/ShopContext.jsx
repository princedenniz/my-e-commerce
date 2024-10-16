import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
// import all_product from '../Assets/Frontend_Assets/all_product'

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);

  const [cartItems, setCartItems] = useState(getDefaultCart());
//   const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setAll_product(data.products);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const fetchCartData = () => {
  fetch("http://localhost:4000/getcart", {
    method: "POST",
    headers: {
      "token": localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setCartItems(data); // Update the cart state with the fetched data
    })
    .catch((error) => {
      console.error("Error fetching cart data:", error);
    })
}

  const addToCart = (itemId) => {
    // Update the cart on the frontend first
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found. User must be logged in to add items to the cart."
      );
      return;
    }

    // Make a POST request to add the item to the backend cart
    fetch("http://localhost:4000/addtocart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        token: token, // Use token directly
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }), // Send itemId in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        return response.json(); // Ensure we are expecting and parsing JSON
      })
      .then((data) => {
        if (data.success) {
          console.log("Item successfully added to cart:", data.message);
        } else {
          console.error("Error from backend:", data.message);
        }
      })
      .catch((error) => {
        // console.error("Error adding to cart:", error);
      });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found. User must be logged in to add items to the cart."
      );
      return;
    }

    // Make a POST request to remove the item from the backend cart
    fetch("http://localhost:4000/removefromcart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        token: token, // Use token directly
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }), // Send itemId in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove item to cart");
        }
        return response.json(); // Ensure we are expecting and parsing JSON
      })
      .then((data) => {
        if (data.success) {
          console.log("Item successfully remove to cart:", data.message);
        } else {
          console.error("Error from backend:", data.message);
        }
      })
      .catch((error) => {
        // console.error("Error adding to cart:", error);
      });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      // console.log(item)
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
  
    // Reset the cart to an empty state (or default structure)
    setCartItems(getDefaultCart()); // Assuming getDefaultCart is defined
  
    // Redirect to login page or home
    // navigate("/login"); // Or wherever you want to redirect after logout
  };
  

  const contextValue = {
    getTotalItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    handleLogout,
    fetchCartData,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
