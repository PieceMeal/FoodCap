import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';

const AccountMenu = props => {
  return (
    <Menu.Item>
      <Dropdown item icon="user outline" simple>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to="/home/preferences"
          >
            Preferences
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to="/user/account"
          >
            Account Info
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default AccountMenu;
