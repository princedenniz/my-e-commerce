
// import './App.css'
// import Navbar from './components/Navbar/Navbar'
// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import Shop from './Pages/Shop'
// import Login from './Pages/Login'
// import Product from './Pages/Product'
// import ShopCategory from './Pages/ShopCategory'
// import Cart from './Pages/Cart'
// import Footer from './components/Footer/Footer'
// import men_banner from './Assets/Frontend_Assets/banner_mens.png'
// import women_banner from './Assets/Frontend_Assets/banner_women.png'
// import kid_banner from './Assets/Frontend_Assets/banner_kids.png'
// import ShopContextProvider from './context/ShopContext'

// function App() {

//   return (
//     <Router>
//       <ShopContextProvider>
//       <Navbar/>
//       <Routes>
//       <Route path='/' element={<Shop/>}/>
//       <Route path='/login' element={<Login/>}/>
//       <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
//       <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
//       <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
//       <Route path='/product/:productId' element={<Product/>}/>
//       <Route path='/cart' element={<Cart/>}/>
//       </Routes>
//       <Footer/>

//       </ShopContextProvider>
//     </Router>
//   )
// }

// export default App

import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import Login from './Pages/Login';
import Product from './Pages/Product';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart';
import Footer from './components/Footer/Footer';
import men_banner from './Assets/Frontend_Assets/banner_mens.png';
import women_banner from './Assets/Frontend_Assets/banner_women.png';
import kid_banner from './Assets/Frontend_Assets/banner_kids.png';
import ShopContextProvider from './context/ShopContext'; // Import ShopContextProvider

function App() {
  return (
    <Router>
      {/* Ensure that ShopContextProvider is inside Router */}
      <ShopContextProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/login' element={<Login />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
        <Footer />
      </ShopContextProvider>
    </Router>
  );
}

export default App;

