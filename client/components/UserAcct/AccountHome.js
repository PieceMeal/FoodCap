import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navbar from '../navbar';
import { LikedList } from '../RecipeList';
// Make new Recipe List
// import RecipeList from '../RecipeList'

class AccountHome extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <h2 className="ui header">Liked</h2>
        <LikedList />
        <h2 className="ui header">Past List Recipes</h2>
      </div>
    );
  }
}

export default AccountHome;
