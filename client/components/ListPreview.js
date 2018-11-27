import React from 'react';
import { Image, List, Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setListsThunk, deleteListThunk } from '../store/lists';
import { Link } from 'react-router-dom';
class ListPreview extends React.Component {
  state = {
    lists: []
  };
  //this is just a placeholder now
  //it will be populated from the list file
  componentDidMount() {
    this.props.setListsThunk();
    this.setState({ lists: this.props.lists });
  }
  // componentDidUpdate(){
  //     if(this.state.lists.length !== this.props.lists){
  //         console.log('this is happening??')
  //     this.props.setListsThunk()
  //     }
  // }
  handleDelete = uuid => {
    //this will be a thunk for deleting the lists.
    this.props.deleteListThunk(uuid);
  };
  render() {
    return (
      <List animated horizontal divided>
        {this.props.lists.map(list => {
          const path = '/lists/' + list.uuid;
          return (
            <List.Item key={list.uuid}>
              <List.Content>
                <Link to={path}>
                  <List.Header style={{}}>
                    <img src="/List Icon.svg" height="50px" />
                    <br />
                    <small
                      style={{
                        fontFamily: 'Arial Black, Gadget, sans-serif'
                      }}
                    >
                      {list.name}
                    </small>
                  </List.Header>
                </Link>
              </List.Content>
              <Icon
                onClick={() => this.handleDelete(list.uuid)}
                link
                name="close"
              />
            </List.Item>
          );
        })}
      </List>
    );
  }
}

const mapState = state => ({
  lists: state.lists
});
const mapDispatch = dispatch => ({
  setListsThunk: () => dispatch(setListsThunk()),
  deleteListThunk: uuid => dispatch(deleteListThunk(uuid))
});
export default connect(mapState, mapDispatch)(ListPreview);
