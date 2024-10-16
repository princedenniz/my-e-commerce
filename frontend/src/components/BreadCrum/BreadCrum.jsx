import React from 'react'
import './BreadCrum.css'
import arrow_icon from '../../Assets/Frontend_Assets/breadcrum_arrow.png'

// const BreadCrum = (props) => {
//     const {product} = props;
//   return (
//     <div className='breadcrum'>
//         Home <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
//     </div>
//   )
// }

const BreadCrum = ({ product }) => {
  return (
    <div>
      {/* Check if product exists and has a category */}
      {product && product.category ? (
        <span>{product.category}</span>
      ) : (
        <span>Category not available</span>
      )}
    </div>
  );
};


export default BreadCrum