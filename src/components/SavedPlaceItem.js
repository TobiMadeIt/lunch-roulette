import React from 'react';
import PropTypes from 'prop-types';
import {Item} from 'semantic-ui-react';

const SavedPlaceItem = ({name, photoURL}) => {
  return (
    <Item>
      <Item.Image size="tiny" src={photoURL} />
      <Item.Content verticalAlign="middle">
        <Item.Header as="a">{name}</Item.Header>
      </Item.Content>
    </Item>
  );
};

SavedPlaceItem.propTypes = {
  name: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
};

export default SavedPlaceItem;
