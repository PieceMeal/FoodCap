import React from 'react';
import { Image, Card, Icon, Grid, Form, Input, Button } from 'semantic-ui-react';
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
  handleDelete = async uuid => {
    //this will be a thunk for deleting the lists.
    await this.props.deleteListThunk(uuid);
  };
  render() {
    return (
      <div className="listcontainer">
        <Card className="addlist">
          <Card.Content>
            <Card.Header>
              <Image centered size="tiny" src='/logo.png' />
              <Form onSubmit={this.props.handleSubmit}>
                <Input
                  size="large"
                  icon="add"
                  placeholder="create new list..."
                  onChange={this.props.handleChange}
                  value={this.props.value}
                />
              </Form>
            </Card.Header>
          </Card.Content>
        </Card>
        <Grid columns={8} className="listgrid">
          <Grid.Row>
            {this.props.lists.map(list => {
              const path = '/lists/' + list.uuid
              return (
                <Grid.Column key={list.uuid}>
                  <Card className="listcard" href={path} >
                    <Card.Content>
                      <Image src='/List Icon.svg' height='50px' />
                      <br />
                      <small style={{fontFamily: 'Arial Black, Gadget, sans-serif'}}>
                        {list.name}
                      </small>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        size="mini"
                        negative
                        floated="right"
                        onClick={() => this.handleDelete(list.uuid)}
                        icon={<Icon name="remove circle" />}
                      />
                    </Card.Content>
                  </Card>
                </Grid.Column>
              )
            })}
          </Grid.Row>
        </Grid>
      </div>
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
