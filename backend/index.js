const port = 4000;
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cors = require("cors");
const multer = require("multer");
const { type } = require("os");
// const { error } = require("console");

app.use(express.json());
app.use(cors());

// Database MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    // console.error("Error connecting to MongoDB:", err.message);
  });

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  // function to generate the filename
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
// creating upload endpoint for images
app.use("/images", express.static("upload/images"));
// our image will be uploaded from the client to this endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// schema for creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});



app.post("/addproduct", async (req, res) => {
  try {
    // Find the last product and increment the ID
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    // Create a new product instance
    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    // Save the product to the database
    await product.save();

    // Respond with success
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// DELETE endpoint to remove a product by its id
app.delete("/removeproduct", async (req, res) => {
  try {
    const productId = req.body.id; // Extract product ID from the request URL

    // Find the product by ID and delete it
    const result = await Product.deleteOne({ id: productId });

    if (result.deletedCount === 0) {
      // If no product was deleted, send an error response
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });
    }

    // If product was deleted, send a success response
    res.json({
      success: true,
      message: "Product successfully deleted",
    });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
});

// Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});

    // If no products are found, send a 404 response
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    // Send the products in the response
    res.json({
      success: true,
      message: "All products fetched successfully",
      products,
    });
    // console.log(products);
    // res.json(products)

    // console.log("All products fetched");
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// schema creating for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

// JWT Secret
const JWT_SECRET = "secret_ecom";

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists
    const user = await Users.findOne({email});
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    // Create and save new user
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if the user exist
    const user = await Users.findOne({ email });
    
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "invalid email or password" });
    }
     // Compare the hashed password with the plain password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(400).json({ success: false, message: "Invalid email or password" });
     }
 
     // Generate JWT token
     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
 
     // Send the token to the client
     res.json({ success: true, token });
  } catch (error) {
    //handle any errors
    res.status(500).json({success: false, message: "Server error", error: error.message})
  }
});

//creating endpoint for newcollection data
app.get('/newcollection', async (req,res)=>{
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  // console.log("New Collection fetched");
  res.send(newcollection)
})

//creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
  try {
    // Fetch products from the "women" category
    let products = await Product.find({ category: "women" });

    // If no products are found, return a 404 error
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the women's category",
      });
    }

    // Get the top 4 products (or adjust this logic as per your "popular" criteria)
    let popular_in_women = products.slice(0, 4);

    // Send the response with the popular products
    res.status(200).json({
      success: true,
      message: "Popular products in the women's section fetched successfully",
      popular_in_women,
    });

    // console.log("Popular products in the women's section fetched");
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "Error fetching popular products in the women's section",
      error: error.message,
    });
  }
});


//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log("let see", data)
    if (!data.id) {
      return res.status(400).send({ errors: "Invalid user data in token" });
    }
    req.user = {id:data.id};  
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};


//creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
  // console.log("Request Body:", req.body);  // Debugging
  // console.log("User from Token:", req.user);  // Debugging

  if (!req.user || !req.user.id) {
    return res.status(400).send({ errors: "Invalid user data in token" });
  }

  let userData = await Users.findOne({ _id: req.user.id });
  if (!userData) {
    return res.status(404).send({ errors: "User not found" });
  }

  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});


//creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async(req,res)=>{
  // console.log("Request Body:", req.body);  // Debugging
  // console.log("User from Token:", req.user);  // Debugging

  if (!req.user || !req.user.id) {
    return res.status(400).send({ errors: "Invalid user data in token" });
  }

  let userData = await Users.findOne({ _id: req.user.id });
  if (!userData) {
    return res.status(404).send({ errors: "User not found" });
  }

  userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
})


app.post('/getcart', fetchUser, async (req, res) => {
  try {
    // console.log("getcart");
    
    // Fetch user data from the database using the ID provided by fetchUser middleware
    let userData = await Users.findOne({ _id: req.user.id });
    
    // If no user is found, return an error response
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Send the cart data back to the client
    res.json(userData.cartData);
    
  } catch (error) {
    // Return an error response in case of any exceptions
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



// Start the Server
app.listen(port, (error) => {
  if (!error) {
    // console.log("Server Running on Port " + port);
  } else {
    // console.log("Error: " + error);
  }
});

// password: BRqo5cPRXYu84Pih
// mongodb+srv://dennisprince815:<db_password>@cluster0.uemoe.mongodb.net/
// mongodb+srv://dennisprince815:BRqo5cPRXYu84Pih@cluster0.uemoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
