import React, { useEffect, useState } from 'react'

// import data_product from '../../Assets/Frontend_Assets/data'
import './Popular.css'
import Items from '../Items/Items'

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
      .then(response => response.json())
      .then(data => {
        // If data has a structure like { success: true, popular_in_women: [...] }, extract the array
        if (data && Array.isArray(data.popular_in_women)) {
          setPopularProducts(data.popular_in_women);
        } else {
          console.error("Unexpected response format:", data);
          setPopularProducts([]); // Ensure it's an array if something goes wrong
        }
      })
      .catch(error => console.error("Error fetching popular products:", error));
  }, []);


  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className='popular-item'>
            {popularProducts.map((item,i)=>{
                return <Items key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular