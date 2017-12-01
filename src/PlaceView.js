import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, Icon, Button, Grid} from 'semantic-ui-react';
import './PlaceView.css';
import RestaurantPlaceholder from './placeholder_restaurant.png';

class PlaceView extends Component{


  render(){
    const {name, photoURL, category, tip, priceTier, distance} = this.props.venueDetails,
      {getNextPlace, gettingNextPlace, handleLunchClick} = this.props;

    return (
      <div>
        <Card className="place-card" fluid centered>
          {/* <div style={{height:'20rem', backgroundImage: `url(${this.props.photoURL})`, backgroundSize: 'cover'}}> */}
          <div style={{height:'20rem',}}>
            <img style={{objectFit: 'cover', width:'100%', height:'100%'}} src={photoURL || RestaurantPlaceholder} alt="restaurant"/>
          </div>
          <Card.Content>
            <Card.Header className="place-header">
              {name}
            </Card.Header>
            <Card.Meta className="place-price">
              <span>
                {
                  [...Array(priceTier)].map((e, i) => <Icon key={i} name="dollar" fitted/>)
                }
              </span>
            </Card.Meta>
            <Card.Meta className="place-category">
              <span>
                {category}
              </span>
            </Card.Meta>
            <Card.Meta className="place-distance">
              <span>
                {distance + ' mi'}
              </span>
            </Card.Meta>
            <Card.Description className="place-description">
              {tip}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Grid columns={2}>
              <Grid.Column>
                <Button fluid target="_blank" onClick={handleLunchClick} primary >
                  <Icon name="rocket"/>
                  Lunch!
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid color="red" onClick={getNextPlace} disabled={gettingNextPlace}>
                  <Icon name="cancel" />
                  Pass
                </Button>
              </Grid.Column>
            </Grid>
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
    distance: PropTypes.number,
  }),
  getNextPlace: PropTypes.func.isRequired,
  gettingNextPlace: PropTypes.bool.isRequired,
  handleLunchClick: PropTypes.func.isRequired,
};

PlaceView.defaultProps = {
  gettingNextPlace: 'false',
};

export default PlaceView;
