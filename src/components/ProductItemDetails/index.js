import {Component} from 'react'
import Cookies from 'js-cookie'
import Link from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemData: [],
    similarProducts: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const updatedSimilarProducts = updatedData.similarProducts.map(
        eachItem => ({
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          similarProducts: eachItem.similar_products,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        }),
      )

      this.setState({
        itemData: updatedData,
        similarProducts: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.ok === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductDetails = () => {
    const {itemData, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = itemData
    const {quantity} = this.state

    return (
      <div className="product-item-data-container">
        <div className="product-item-content-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <h1 className="product-item-title">{title}</h1>
          <p className="product-item-price">Rs {price}/- </p>

          <div className="product-item-rating-reviews-row-container">
            <div className="product-item-rating-container">
              <p className="product-item-rating-title">{rating}</p>
              <AiFillStar className="star-icon" />
            </div>
            <p className="product-item-total-reviews">{totalReviews} Reviews</p>
          </div>
          <p className="product-item-description">{description}</p>
          <p className="product-item-availability-title">
            <span className="product-item-availability-count">Available:</span>

            {availability}
          </p>
          <p className="product-item-availability-title">
            <span className="product-item-availability-count"> Brand:</span>
            {brand}
          </p>
          <hr className="hr-tag" />

          <div className="product-item-quantity-row-container">
            <button
              type="button"
              className="quantity-control-button"
              onClick={this.onDecrementQuantity}
              testid="minus"
            >
              <BsDashSquare className="quantity-controller" />
            </button>
            <p className="quantity-title-display">{quantity}</p>
            <button
              type="button"
              className="quantity-control-button"
              onClick={this.onIncrementQuantity}
              testid="plus"
            >
              <BsPlusSquare className="quantity-controller" />
            </button>
          </div>

          <button type="button" className="add-to-cart-button">
            ADD TO CART
          </button>

          <h1 className="similar-products-title">Similar Products</h1>
          <ul className="similar-products-list-container">
            {similarProducts.map(eachSimilar => (
              <SimilarProductItem
                itemDetails={eachSimilar}
                key={eachSimilar.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-desc">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-view-continue-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="main-container">{this.renderSwitch()}</div>
      </>
    )
  }
}

export default ProductItemDetails
