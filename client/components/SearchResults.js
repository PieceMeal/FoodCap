import React, { Component } from 'react'
import Navbar from './navbar'
import { connect } from 'react-redux'
import { Icon, Message, Container, Divider, Grid, Image, Card, Popup, Form, Checkbox, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { setPopularRecipesThunk, searchRecipesThunk } from '../store/genericRecLists'
import {addRecipeToListThunk} from '../store/lists'
class SearchResults extends Component {
    state = {
        value:'',
        checked: {}
    }
    componentDidMount() {
        this.props.fetchPopular()
        this.props.searchRecipesThunk(this.props.location.search.slice(5))
    }
    handleChangeList = (e, { value, name }) => {
        //have a thunk that sends information about the list and information about
        this.setState(prevState => {
          return { checked: { ...prevState.checked, [name]: value } };
        });
      };
    handleSubmitList = e => {
        e.preventDefault();
        let recipe = Object.keys(this.state.checked).toString();
        let uuid = this.state.checked[recipe];
        let body = { uuid, recipe };
        //dispatch thank for sending list info, recipe info
        this.props.addRecipeToListThunk(body);
        this.setState({ [recipe]: false, checked: {} });
      };
    handleOpen = name => {
        this.setState({ [name]: true });
      };
      handleClose = name => {
        this.setState({ [name]: false });
      };

    render() {
        const disableSubmitButton = Object.keys(this.state.checked).length;
        const searchRec = this.props.searchRecipes

        const popular = this.props.popular
        const query = this.props.location.search.slice(5)
        if (this.props.searchRecipes.length) {
            return (
                <React.Fragment>
                    <Navbar />
                    <div
          style={{
            marginTop: '5vh',
            marginLeft: '10vw',
            marginRight: '10vw',
            marginBottom: '40px'
          }}
        >
                    <Container >
                        <Message>
                            <Message.Header>Showing results for "{query}"</Message.Header>
                        </Message>
                        <Divider horizontal>Recipes</Divider>
                        <Grid columns={4} centered>
                            <Grid.Row stretched>
                                {searchRec.map((rec, i) => {
                                    return (
                                        <Grid.Column width={4} key={i}>
                                            <Card style={{ marginTop: "20px",padding: '8px',
                        border: '1px solid black' }}>
                                                <Link to={`/recipes/singleview/${rec.name}`}><Image src={rec.image} style={{ height: '150px', width: '100%' }} /></Link>
                                                <Card.Content>
                                                    <Card.Header>{rec.name}</Card.Header>
                                                    <Container textAlign="right">
                                                        {this.props.lists ? (
                                                            <Popup
                                                                on="click"
                                                                open={this.state[rec.name]}
                                                                onOpen={() => this.handleOpen(rec.name)}
                                                                onClose={() => this.handleClose(rec.name)}
                                                                trigger={<Button icon="add" />}
                                                                content={
                                                                    <Form onSubmit={this.handleSubmitList}>
                                                                        {this.props.lists.map(list => {
                                                                            return (
                                                                                <Form.Field key={list.uuid}>
                                                                                    <Checkbox
                                                                                        name={rec.name}
                                                                                        value={list.uuid}
                                                                                        label={list.name}
                                                                                        onChange={this.handleChangeList}
                                                                                        checked={
                                                                                            list.uuid ===
                                                                                            this.state.checked[rec.name]
                                                                                        }
                                                                                    />
                                                                                </Form.Field>
                                                                            );
                                                                        })}

                                                                        <Button
                                                                            disabled={!disableSubmitButton}
                                                                            type="submit"
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    </Form>
                                                                }
                                                                on="click"
                                                            />
                                                        ) : (
                                                                <Button icon="x" />
                                                            )}
                                                    </Container>
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
                        <Grid columns={4} stretched>
                            <Grid.Row stretched>
                                {popular.map((rec, i) => {
                                    return (
                                        <Grid.Column width={4} key={i}>
                                            <Card style={{ marginTop: "20px",padding: '8px',
                        border: '1px solid black' }}>
                                                <Link to={`/recipes/singleview/${rec.name}`}><Image src={rec.image} style={{ height: '150px', width: '100%' }}/></Link>
                                                <Card.Content>
                                                    <Card.Header>{rec.name}</Card.Header>
                                                    <Card.Meta>
                                                    <Container textAlign="right">
                                                        {this.props.lists ? (
                                                            <Popup
                                                                on="click"
                                                                open={this.state[rec.name]}
                                                                onOpen={() => this.handleOpen(rec.name)}
                                                                onClose={() => this.handleClose(rec.name)}
                                                                trigger={<Button icon="add" />}
                                                                content={
                                                                    <Form onSubmit={this.handleSubmitList}>
                                                                        {this.props.lists.map(list => {
                                                                            return (
                                                                                <Form.Field key={list.uuid}>
                                                                                    <Checkbox
                                                                                        name={rec.name}
                                                                                        value={list.uuid}
                                                                                        label={list.name}
                                                                                        onChange={this.handleChangeList}
                                                                                        checked={
                                                                                            list.uuid ===
                                                                                            this.state.checked[rec.name]
                                                                                        }
                                                                                    />
                                                                                </Form.Field>
                                                                            );
                                                                        })}

                                                                        <Button
                                                                            disabled={!disableSubmitButton}
                                                                            type="submit"
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    </Form>
                                                                }
                                                                on="click"
                                                            />
                                                        ) : (
                                                                <Button icon="x" />
                                                            )}
                                                    </Container>
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
                    </div>
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
    fetchPopular: () => dispatch(setPopularRecipesThunk()),
    addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body)),
    searchRecipesThunk: query => dispatch(searchRecipesThunk(query))
})
const mapState = state => ({
    lists: state.lists,
    searchRecipes: state.genericRecLists.searchRecipes,
    popular: state.genericRecLists.popular
})

export default connect(mapState, mapDispatch)(SearchResults)