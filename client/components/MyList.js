import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setListThunk,
  deleteSingleItemThunk,
  deleteListThunk
} from '../store/list';
import {
  Button,
  Grid,
  Segment,
  Header,
  Divider,
  GridColumn
} from 'semantic-ui-react';

let dummyData = [
  { name: 'turkey', unit: 'lb', quant: 5, id: 1 },
  {
    name: 'smoked streaky bacon',
    unit: 'pieces',
    quant: 6,
    id: 2,
    note: 'high-fat plox'
  },
  { name: 'sunflower oil', unit: null, quant: null, id: 3 },
  {
    name: 'flour',
    unit: 'oz',
    quant: 8,
    id: 4,
    note: '00 baking flour, preferably this brand'
  },
  { name: 'olive oil', unit: 'tbsp', quant: 8, id: 5 }
];

const mapStateToProps = state => {
  return {
    list: state.list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setList: () => dispatch(setListThunk()),
    deleteSingle: info => dispatch(deleteSingleItemThunk(info)),
    deleteAll: uuid => dispatch(deleteListThunk(uuid))
  };
};

const style = {
  h3: {
    padding: '2em 0em'
  },
  listButtons: {
    float: 'right',
    backgroundColor: '#E0E0E0',
    marginLeft: '1vw'
  },
  wholeTray: {
    backgroundColor: '#dd4871',
    marginLeft: '5vw',
    marginRight: '5vw',
    padding: '12px',
    border: '2px solid black',
    borderRadius: '15px'
  }
};

class MyList extends Component {
  // The back end is not hooked up yet!!

  componentDidMount() {
    // set up back-end
    //this.props.setList()
  }
  render() {
    let { ingredients } = this.props;

    //DUMMY VERSION
    ingredients = dummyData;
    return (
      <div style={style.wholeTray}>
        <Header
          as="h3"
          content="Your Tray"
          style={style.h3}
          textAlign="center"
        />
        <Divider />

        <table class="ui inverted olive table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Notes</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length
              ? ingredients.map(ingredient => {
                  return (
                    <tr key={ingredient.id}>
                      <td>
                        <b>{ingredient.name}</b>
                      </td>
                      <td>
                        <small>
                          {ingredient.quant}&ensp;{ingredient.unit}
                        </small>
                      </td>
                      <td>{ingredient.note ? ingredient.note : null}</td>
                      <td>
                        <button style={style.listButtons} type="button">
                          Take off shopping list
                        </button>
                        <button style={style.listButtons} type="button">
                          <i aria-hidden="true" className="angle down icon" />
                        </button>
                        <button style={style.listButtons} type="button">
                          <i aria-hidden="true" className="angle up icon" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
            <tr>
              <td>
                <button style={{ backgroundColor: '#f5f5f5' }}>
                  <i aria-hidden="true" className="plus icon" />
                  &emsp;ADD
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <Divider />
        <span>
          <Button animated style={{ backgroundColor: 'red' }}>
            <Button.Content visible>
              <i aria-hidden="true" className="trash alternate icon" />
            </Button.Content>
            <Button.Content hidden>Delete</Button.Content>
          </Button>
        </span>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
