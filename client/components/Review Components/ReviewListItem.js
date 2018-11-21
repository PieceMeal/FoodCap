import React from 'react'
import {Link} from 'react-router-dom'
import StarRatings from 'react-star-ratings'

//renders a single review card
const ReviewListItem = props => {
  const review = props.review
  return (
    <div>
      <p>
        Review #{review.id} written on {review.createdAt.slice(0, 10)}
      </p>
      <Link to={`/products/${review.product.id}`}>{review.product.title}</Link>
      <br />
      <StarRatings
        rating={review.rating}
        starDimension="15px"
        starSpacing="5px"
      />
      <p>{review.text}</p>
      <br />
    </div>
  )
}

export default ReviewListItem
