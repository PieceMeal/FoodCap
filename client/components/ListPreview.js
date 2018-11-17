import React from 'react'
import { Image, List } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setListsThunk } from '../store/lists'
import {Link} from 'react-router-dom'
class ListPreview extends React.Component {

    //this is just a placeholder now
    //it will be populated from the list file
    componentDidMount() {
        this.props.setListsThunk()
    }
    render() {
        console.log('my lists', this.props.lists)
        
        return (
            <List animated verticalAlign='middle'>
                {this.props.lists.map(list => {
                    const path = '/lists/' + list.uuid;
                    return (
                        <List.Item key={list.uuid}>
                            <List.Content>
                                <Link to={path}><List.Header>{list.name}</List.Header></Link>
                            </List.Content>
                        </List.Item>
                    )
                })}
            </List>)

    }
}

const mapState = state => ({
    lists: state.lists
})
const mapDispatch = dispatch => ({
    setListsThunk: () => dispatch(setListsThunk())
})
export default connect(mapState, mapDispatch)(ListPreview)