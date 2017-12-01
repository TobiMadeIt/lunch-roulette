import React, { Component } from 'react';
import { Sidebar, Card, Grid, Button, Item, Icon, Header } from 'semantic-ui-react';
import PlaceView from './PlaceView';
import SavedPlaceItem from './SavedPlaceItem';
import PizzaLogo from './pizza-logo.png';
import './App.css';

const CLIENT_ID = 'WZJOUGN5SJ310OCCVVORI4GMOEJXBXO0GADFVCNQZVXSKPPR',
  CLIENT_SECRET = 'K1UBCS4AQH2NROU3C4U0MDITXQI4EM0YNKOKRA0OQCH5MEGX',
  CATEGORYID = '4bf58dd8d48988d14e941735,' +
    '4bf58dd8d48988d142941735,4bf58dd8d48988d1df931735,' +
    '4bf58dd8d48988d110941735,4bf58dd8d48988d1c1941735,' +
    '4bf58dd8d48988d10f941735',
  DEFAULTLOCATION = '32.7767,-96.7970'; //DALLAS


const constructVenueDetailsURL = (venueId) => `https://api.foursquare.com/v2/venues/` +
  `${venueId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20170801`;

const constructVenueSearchURL = (parameters) =>{
  let url = `https://api.foursquare.com/v2/venues/search?v=20170801&` +
    `intent=browse&radius=10000&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` +
    `&categoryId=${CATEGORYID}`;
  for (let key in parameters){
    url += `&${key}=${parameters[key]}`;
  }
  return url;
};



class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      venues: [],
      savedPlaces:[],
      currentVenueDetails: undefined,
      currentVenue: 0,
      gettingNextPlace: false,
      sidebarVisibility: false,
    };

    this.loadPlaces = this.loadPlaces.bind(this);
    this.getNextPlace = this.getNextPlace.bind(this);
    this.loadPlaceDetails = this.loadPlaceDetails.bind(this);
    this.handleLocationFailure = this.handleLocationFailure.bind(this);
    this.handleLocationSuccess = this.handleLocationSuccess.bind(this);
    this.handleLunchClick = this.handleLunchClick.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

  }

  componentWillMount(){
    if (!navigator.geolocation)
      console.log("geolocation not supported");
    else {
      navigator.geolocation.getCurrentPosition(this.handleLocationSuccess, this.handleLocationFailure);
    }
    this.loadPlaces({ll: DEFAULTLOCATION})
    .then((venues) => this.loadPlaceDetails(0))
    .catch(console.log);
  }

  handleLocationSuccess = (position) => {
    this.loadPlaces({ll: position.coords.latitude + ',' + position.coords.longitude});
    // this.loadPlaces({li: })
  }

  handleLocationFailure = () => {
    fetch("http://ipinfo.io/json?token=2a3097ff5d6dc8")
    .then((response) =>{
      if (!response.ok)
        throw Error("Couldn't get IP location");
      else
        return response.json();
    })
    .then((location) => this.loadPlaces({ll: location.loc}))
    .catch(console.log);
    alert("Please allow location access. Using rough location");
  }


  loadPlaces(parameters){
    return fetch(constructVenueSearchURL(parameters))
    .then(response => {
      if (!response.ok)
        throw Error(response.statusText);
      return response.json();
    })
    .then(response => {
      return new Promise((resolve, reject) => {
        let venues = response.response.venues;
        if (venues === undefined || venues.length < 1)
          reject("Could not find any places for that query");
        else{
          this.setState({
            venues,
          });
          resolve(venues);
        }
      });
    })
    .catch((reason) => {
      alert("Couldn't load places." + reason);
    });
  }


  loadPlaceDetails(nextVenue){
    this.setState({gettingNextPlace: true});
    fetch(constructVenueDetailsURL(this.state.venues[nextVenue].id))
    .then(response => {
      if (response.ok)
        return response.json();
      else
        throw Error(response.statusText);
      }
    )
    .then(response => {
      const venue = response.response.venue,
        name = venue.name,
        imageSize = 'height500';
      let photoURL, category, priceTier, tip, distance, coordinates;

      // Catch exception in case JSON does not contain required data
      try {photoURL = venue.bestPhoto.prefix + imageSize + venue.bestPhoto.suffix;}
      catch(e){photoURL = undefined;}

      try {category = venue.categories[0].name;}
      catch(e){category = undefined;}

      try {priceTier = venue.price.tier;}
      catch(e){priceTier = 0;}

      try {
        tip = venue.tips.groups[0].items[0].text;
        if (tip.length > 145)
          tip = tip.substring(0, 145) + '...';
      }
      catch(e){tip = '';}

      try {distance = Math.ceil(this.state.venues[nextVenue].location.distance * 0.000621371);}
      catch(e){distance = '';}

      try {coordinates = `${venue.location.lat},${venue.location.lng}`;}
      catch(e){coordinates = '';}

      this.setState({
        gettingNextPlace: false,
        currentVenue: nextVenue,
        currentVenueDetails: {
          name,
          photoURL,
          category,
          priceTier,
          tip,
          distance,
          coordinates,
        },
      });
    })
    .catch((reason) => {
      alert("Please check your network connection " + reason);
      this.setState({gettingNextPlace: false});
    });

  }

  getNextPlace(){
    let nextVenue = (this.state.currentVenue + 1) % this.state.venues.length;
    this.loadPlaceDetails(nextVenue);

  }

  handleLunchClick(){
    const {name, photoURL} = this.state.currentVenueDetails;
    this.setState({
      savedPlaces: [...this.state.savedPlaces, {name, photoURL}],
    });
    window.open('https://www.google.com/maps/dir/?api=1&destination=' +  this.state.currentVenueDetails.coordinates, '_blank');
  }

  toggleSidebar(){
    this.setState({
      sidebarVisibility: !this.state.sidebarVisibility,
    });
  }


  render() {
    return (

          <Sidebar.Pushable className="places-sidebar">
            <Sidebar as={Card} animation="overlay" width="wide" visible={this.state.sidebarVisibility} >
              <a className="sidebar-close-toggle" onClick={this.toggleSidebar}><Icon name="cancel" size="big" color="grey" /></a>
              <Header textAlign="center">Saved Places</Header>
              <Item.Group divided>

                {this.state.savedPlaces.map((place, i) => <SavedPlaceItem name={place.name} photoURL={place.photoURL} key={i} /> )}

              </Item.Group>

            </Sidebar>

            <Sidebar.Pusher>
              <div className="App">
                <header className="App-header">
                  <img src={PizzaLogo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Lunch Roulette</h1>
                  <p>It's Tinder! But for restaurants</p>
                  <Button color="grey" onClick={this.toggleSidebar}>Saved Places</Button>
                </header>
                <Grid centered >
                  <Grid.Column computer={6} tablet={8} mobile={15}>
                    {this.state.currentVenueDetails &&
                      <PlaceView venueDetails = {this.state.currentVenueDetails}
                        getNextPlace = {this.getNextPlace}
                        handleLunchClick = {this.handleLunchClick}
                        gettingNextPlace = {this.state.gettingNextPlace}
                      />
                    }
                  </Grid.Column>
                </Grid>
              </div>
            </Sidebar.Pusher>
          </Sidebar.Pushable>

    );
  }
}

export default App;
