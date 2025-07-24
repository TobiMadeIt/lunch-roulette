import React from 'react';
import PropTypes from 'prop-types';
import {Item} from 'semantic-ui-react';

const SavedPlaceItem = ({name, photoURL, coordinates}) => {
  const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
  return (
    <Item>
      <Item.Image size="tiny" src={photoURL} />
      <Item.Content verticalAlign="middle">
        <Item.Header as="a" href={mapsURL} target="_blank">{name}</Item.Header>
      </Item.Content>
    </Item>
  );
};

SavedPlaceItem.propTypes = {
  name: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  coordinates: PropTypes.string.isRequired,
};

export default SavedPlaceItem;
