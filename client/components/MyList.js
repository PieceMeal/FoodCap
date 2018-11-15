import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setListThunk} from '../store/list'
import {Button, Container, Grid, Segment, Header} from 'semantic-ui-react'

let dummyData = [
  {name: 'turkey', unit: 'lb', quant: 5, id: 1},
  {name: 'smoked streaky bacon', unit: 'pieces', quant: 6, id: 2},
  {name: 'sunflower oil', unit: null, quant: null, id: 3},
  {name: 'flour', unit: 'oz', quant: 8, id: 4},
  {name: 'olive oil', unit: 'tbsp', quant: 8, id: 5}
]

const mapStateToProps = state => {
  return {
    list: state.list
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setList: () => dispatch(setListThunk())
  }
}

const style = {
  h3: {
    marginTop: '2em',
    padding: '2em 0em'
  }
}

class MyList extends Component {
  componentDidMount() {
    // set up back-end
    //this.props.setList()
  }
  render() {
    let {list} = this.props

    //DUMMY VERSION
    list = dummyData
    return (
      <div>
        <Header as="h3" content="List" style={style.h3} textAlign="center" />
        <Grid container columns={2} stackable>
          {list
            ? list.map(ingredient => {
                return (
                  <Grid.Column key={ingredient.id}>
                    <Segment>
                      <h5>
                        <b>{ingredient.name}&emsp;</b>
                        <small>
                          {ingredient.quant}&ensp;{ingredient.unit}
                        </small>
                        &emsp;
                        <button
                          // class="ui icon left labeled button"
                          style={{float: 'right', textAlign: 'center'}}
                          type="button"
                        >
                          Take off shopping list
                        </button>
                        <button style={{float: 'right'}} type="button">
                          <i aria-hidden="true" class="angle down icon" />
                        </button>
                        <button style={{float: 'right'}} type="button">
                          <i aria-hidden="true" class="angle up icon" />
                        </button>
                      </h5>
                    </Segment>
                    {/* <p>NOTES HERE??????</p> */}
                  </Grid.Column>
                )
              })
            : null}
        </Grid>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyList)
