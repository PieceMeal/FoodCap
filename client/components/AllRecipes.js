import React from 'react'
import Navbar from './navbar'
import {connect} from 'react-redux'
import {AllRecipes} from './RecipeList'
export const AllRecipesComp = () => {
    return (
        <React.Fragment>
            <Navbar/>
            <AllRecipes/>
        </React.Fragment>
    )
}

export default AllRecipesComp