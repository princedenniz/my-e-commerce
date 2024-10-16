import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetailsInput, setProductDetailsInput] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "women",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const inputHandler = (e) => {
    setProductDetailsInput({
      ...productDetailsInput,
      [e.target.name]: e.target.value,
    });
  };

  const Add_Product = async () => {
    console.log(productDetailsInput);

    let product = { ...productDetailsInput }; // Clone the product details
    let formData = new FormData();
    formData.append("product", image); // Attach the image

    try {
      // Send the image to the server
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json", // Expect JSON response
        },
        body: formData, // Send the form data with the image
      });

      // Parse the response
      const responseData = await response.json();

      // Check if the image was uploaded successfully
      if (responseData.success) {
        product.image = responseData.image_url; // Assign the image URL to the product
        const responsee = await fetch('http://localhost:4000/addproduct',{
            method:'POST',
            headers:{
                Accept:"applocation/json",
                'content-Type':'application/json',
            },
            body:JSON.stringify(product),
        })
        const responseProduct = await responsee.json();
        if(responseProduct.success){
            alert("Product Added")
        }else{
            alert("failed to Add product")
        }
      } else {
        console.error("Image upload failed:", responseData.message);
        return; // Optionally, you can stop further processing if the image fails to upload
      }

      // Continue with further steps (e.g., save product to database) here...
      console.log("Product ready for database:", product);
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          onChange={inputHandler}
          value={productDetailsInput.name}
          type="text"
          name="name"
          placeholder="type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            onChange={inputHandler}
            value={productDetailsInput.old_price}
            type="text"
            name="old_price"
            placeholder="type here"
          />
        </div>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Offer price</p>
          <input
            onChange={inputHandler}
            value={productDetailsInput.new_price}
            type="text"
            name="new_price"
            placeholder="type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          onChange={inputHandler}
          value={productDetailsInput.category}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
