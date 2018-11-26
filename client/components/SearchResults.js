import React, { Component } from 'react'
import Navbar from './navbar'
import { connect } from 'react-redux'
import { Icon, Message, Container, Divider, Grid, Image, Card } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {setPopularRecipesThunk} from '../store/genericRecLists'
class SearchResults extends Component {
    componentDidMount(){
        this.props.fetchPopular()
    }
    render() {
        console.log('this.props', this.props);
        
        
        const searchRec = this.props.searchRecipes
        const popular = this.props.popular
        const query = this.props.location.search.slice(5)
        if (this.props.searchRecipes.length) {
            return (
                <React.Fragment>
                    <Navbar />
                    <Container >
                        <Message>
                            <Message.Header>Showing results for "{query}"</Message.Header>
                        </Message>
                        <Divider horizontal>Recipe</Divider>
                        <Grid columns={3} divided>
                            <Grid.Row stretched>
                                {searchRec.map((rec, i) => {
                                    return (
                                        <Grid.Column width={4} key={i}>
                                            <Card style={{marginTop:"20px"}}>
                                                <Link to={`/recipes/singleview/${rec.name}`}><Image src={rec.image} /></Link>
                                                <Card.Content>
                                                    <Card.Header>{rec.name}</Card.Header>
                                                    <Card.Description>Time: {rec.time}</Card.Description>
                                                </Card.Content>
                                            </Card>

                                        </Grid.Column>
                                    )
                                })}
                            </Grid.Row>
                        </Grid>
                        <Message>
                            <Message.Header>Also check popular recipes for this week</Message.Header>
                        </Message>
                        <Divider horizontal>Popular</Divider>
                        <Grid columns={3} divided>
                            <Grid.Row stretched>
                                {popular.map((rec, i) => {
                                    return (
                                        <Grid.Column width={4} key={i}>
                                            <Card>
                                                <Link to={`/recipes/singleview/${rec.name}`}><Image src={rec.image} /></Link>
                                                <Card.Content>
                                                    <Card.Header>{rec.name}</Card.Header>
                                                    <Card.Meta>
                                                    </Card.Meta>
                                                    <Card.Description>Time: {rec.time}</Card.Description>
                                                </Card.Content>
                                            </Card>

                                        </Grid.Column>
                                    )
                                })}
                            </Grid.Row>
                        </Grid>
                    </Container>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Navbar />
                    <Message>
                        <Message.Header>Nothing was found for "{query}"</Message.Header>
                        <Message.Header>Please try different keyword</Message.Header>
                    </Message>
                </React.Fragment>
            )
        }
    }
}

const mapDispatch = dispatch => ({
    fetchPopular: () => dispatch(setPopularRecipesThunk())
})
const mapState = state => ({
    searchRecipes: state.genericRecLists.searchRecipes,
    popular: state.genericRecLists.popular
})

export default connect(mapState, mapDispatch)(SearchResults)