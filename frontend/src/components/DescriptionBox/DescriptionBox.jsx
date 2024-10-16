import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae incidunt eaque expedita modi ipsum corrupti saepe distinctio ratione doloremque consectetur sapiente labore placeat nulla omnis quidem inventore, repellat 
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae incidunt eaque expedita modi ipsum corrupti saepe distinctio ratione doloremque consectetur sapiente labore placeat nulla omnis quidem inventore, repellat molestiae tempore facere enim voluptatem quasi.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit a deleniti ducimus autem eum error asperiores quos dolorem eius, natus corporis esse, aperiam vel! Veritatis!
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox