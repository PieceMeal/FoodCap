import React, { Component } from 'react'
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings'
import { createReview } from '../store/reviews'

//the form to submit a review that lives on the single item page
class ReviewForm extends Component {
    constructor(props) {
      super(props)
      this.state = {
          review: '',
          rating: 0
      }
    }

    handleTextChange = evt => {
      this.setState({
        review: evt.target.value
      })
    }

    changeRating = newRating => {
      this.setState({
        rating: newRating
      })
    }

    handleSubmit = evt => {
      evt.preventDefault()
      const review = {
          rating: this.state.rating,
          text: this.state.review,
          userId: this.props.user.id,
          productId: this.props.selectedProduct.id
      }
      this.props.createReview(review)
      this.setState({
        review: '',
        rating: 0
      })
    }

    render() {
        return (
            <div>
                <br />
                <form
                  className="ui form"
                  onSubmit={this.handleSubmit}>
                    <div className="field">
                        <label>Review This Product</label>
                        <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={5}
                        starDimension='20px'
                        starSpacing='5px'
                        name="rating"
                      />
                        <input
                          type="text"
                          name="review"
                          placeholder="Write your review..."
                          onChange={this.handleTextChange}
                          value={this.state.review}
                        />
                    </div>
                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
        )

    }
}

const mapState = state => {
  return {
    user: state.user,
    selectedProduct: state.selectedProduct
  }
}

export default connect(mapState, {createReview})(ReviewForm)
