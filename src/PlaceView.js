import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, Icon, Button} from 'semantic-ui-react';
import './PlaceView.css';
import RestaurantPlaceholder from './placeholder_restaurant.png';

class PlaceView extends Component{


  render(){
    const {name, photoURL, category, tip, priceTier, distance} = this.props.venueDetails,
      {getNextPlace, gettingNextPlace, handleLunchClick} = this.props;

    return (
      <div>
        <Card>
          {/* <div style={{height:'20rem', backgroundImage: `url(${this.props.photoURL})`, backgroundSize: 'cover'}}> */}
          <div style={{height:'20rem',}}>
            <img style={{objectFit: 'cover', width:'100%', height:'100%'}} src={photoURL || RestaurantPlaceholder} alt="restaurant"/>
          </div>
          <Card.Content>
            <Card.Header>
              {name}
            </Card.Header>
            <Card.Meta>
              <span className="restaurant-category">
                {category}
              </span>
            </Card.Meta>
            <Card.Meta>
              <span className="price">
                {
                  [...Array(priceTier)].map((e, i) => <Icon key={i} name="dollar"/>)
                }
              </span>
            </Card.Meta>
            <Card.Meta>
              <span className="restaurant-category">
                {distance + ' mi'}
              </span>
            </Card.Meta>
            <Card.Description>
              {tip}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className="ui two buttons">
              <Button target="_blank" onClick={handleLunchClick} basic color="green">Let's Lunch!</Button>
              <Button basic color="red" onClick={getNextPlace} disabled={gettingNextPlace}>Get Another</Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

PlaceView.propTypes = {
  venueDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    category: PropTypes.string,
    tip: PropTypes.string,
    priceTier: PropTypes.number,
    distance: PropTypes.string,
  }),
  getNextPlace: PropTypes.func.isRequired,
  gettingNextPlace: PropTypes.bool.isRequired,
  handleLunchClick: PropTypes.func.isRequired,

};

PlaceView.defaultProps = {
  gettingNextPlace: 'false',
};

export default PlaceView;
