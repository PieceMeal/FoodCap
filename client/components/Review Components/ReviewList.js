import React from 'react'
import ReviewListItem from './ReviewListItem'

//renders a list of reviews written by a user: lives on my account page
const ReviewList = props => {
  if (!Array.isArray(props.reviews) || props.reviews.length === 0) {
    return (
      <div>
        <p>You haven't written any reviews!</p>
      </div>
    )
  } else {
    return (
      <div>
        {props.reviews.map(review => {
          return (
            <div key={review.id}>
              <hr />
              <ReviewListItem review={review} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default ReviewList
