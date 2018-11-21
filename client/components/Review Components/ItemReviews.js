import React from 'react'
import StarRatings from 'react-star-ratings'

//renders all reviews on a single item page
export const ProductReview = props => {
  const reviews = props.reviews

  if (reviews.length === 0)
    return <section>No reviews to display. Leave a review.</section>

  return (
    <section className="ui celled list">
      {reviews.map((review, idx) => {
        return (
          <div key={review.id}>
            <article key={parseInt(idx, 10)} className='item'>
              <div className='content'>
                <div className='header'>
                  {review.user === null ? 'Anonymous' : review.user.email}
                </div>
                <p>{review.text}</p>
              <StarRatings
                rating={review.rating}
                starDimension='15px'
                starSpacing='5px'
              />
              </div>
              <hr />
            </article>
          </div>
        )
      })}
    </section>
  )
}

export default ProductReview
