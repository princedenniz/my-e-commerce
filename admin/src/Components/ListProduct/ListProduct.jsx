import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  console.log(allproducts);

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts");

      //   console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setAllProducts(data.products);
    } catch (error) {
      console.error("Error Fetching Products", error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch("http://localhost:4000/removeproduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Specify content type as JSON
          Accept: "application/json", // Expect JSON response
        },
        body: JSON.stringify({ id }), // Send the product ID in the request body

      });
      const data = await response.json();

      if (data.success) {
        setAllProducts(allproducts.filter((product) => product.id !== id));
        alert("Product Removed Successfully");
      } else {
        alert(data.message, "Product failed to remove");
      }
    } catch (error) { 
      console.error("Error removing product:", error.message);
      alert("An error occurred while removing the product");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          // console.log(product.image)
          return (
            <>
              <div
                className="listproduct-format-main listproduct-format"
                key={index}
              >
                <img
                  src={product.image}
                  alt="image"
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  className="list product-remove-icon"
                  src={cross_icon}
                  alt=""
                  onClick={() => removeProduct(product.id)}
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
