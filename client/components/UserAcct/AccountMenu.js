import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import history from '../../history';

const AccountMenu = props => {
  return (
    <Menu.Item>
      <div className="ui simple dropdown">
        <div className="text">Your Account</div>
        <i className="dropdown icon" />
        <div className="menu">
          <div className="item" onClick={() => history.push('/home')}>
            Home
          </div>
          <div className="divider" />
          <div
            className="item"
            onClick={() => history.push('/home/preferences')}
          >
            Change Preferences
          </div>
          <div className="item" onClick={() => history.push('/user/account')}>
            Account Info
          </div>
        </div>
      </div>
    </Menu.Item>
  );
};

export default AccountMenu;
