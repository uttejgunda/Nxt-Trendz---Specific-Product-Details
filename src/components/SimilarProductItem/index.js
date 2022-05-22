import {AiFillStar} from 'react-icons/ai'

import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  console.log(itemDetails)
  const {brand, imageUrl, price, rating, title} = itemDetails
  return (
    <li className="similar-list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-products-item-image"
      />
      <h1 className="similar-item-title">{title}</h1>
      <p className="similar-brand-name">By {brand}</p>
      <div className="similar-item-cost-rating-row-container">
        <p className="similar-item-price">Rs {price}/- </p>
        <div className="similar-item-rating-container">
          <p className="similar-item-rating-title">{rating}</p>
          <AiFillStar className="similar-star-icon" />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
