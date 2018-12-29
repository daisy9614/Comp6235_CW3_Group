import React, { Component } from 'react';
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker } from "react-google-maps"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css'
import Slider,{ Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import logo from './Hello_world_logo.png';
var ReactSuperSelect = require('react-super-select');
var housingData = [{
    "id": 1,
    "website": "http://www.hbs.edu",
    "uniName":"University College London",
    "city": "London",
    "position": {
      lat: 52.33,
      lng: -2.1
    },
    "price": 120,
    "distanceUni": 400,
    "distanceRetail": 750
  },{
    "id": 2,
    "website": "www.southampton.com",
    "uniName":"University of Southampton",
    "city": "Southampton",
    "position": {
      lat: 52.03,
      lng: -2.2
    },
    "price": 150,
    "distanceUni": 700,
    "distanceRetail": 550
  }
].sort(function(a,b) {
    var x = a.city.toLowerCase();
    var y = b.city.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
});

// App Main Component
class App extends Component {
  constructor(props) {
    super(props);

    this.cheapestHousing = housingData.reduce( (prev, curr) => {
      return prev.price <= curr.price ? prev : curr;
    })

    this.mostExpensiveHousing = housingData.reduce( (prev, curr) => {
      return prev.price >= curr.price ? prev : curr;
    })

    this.closestHousingToUni = housingData.reduce( (prev, curr) => {
      return prev.distanceUni <= curr.distanceUni ? prev : curr;
    })

    this.farestHousingToUni = housingData.reduce( (prev, curr) => {
      return prev.distanceUni >= curr.distanceUni ? prev : curr;
    })

    this.closestHousingToRetail = housingData.reduce( (prev, curr) => {
      return prev.distanceRetail <= curr.distanceRetail ? prev : curr;
    })

    this.farestHousingToRetail = housingData.reduce( (prev, curr) => {
      return prev.distanceRetail >= curr.distanceRetail ? prev : curr;
    })


    // I need: alphabetically sorted university lists
    this.university_list = ["All Universities","University of Birmingham", "University of Bristol", "University of Cambridge", "Cardiff University", "Durham University", "University of Edinburgh", "University of Exeter", "University of Glasgow", "Imperial College London", "King's College London", "University of Leeds", "University of Liverpool", "London School of Economics", "University of Manchester", "Newcastle University", "University of Nottingham", "University of Oxford", "Queen's University Belfast", "University of Sheffield", "University of Southampton", "University College London", "University of Warwick", "University of York"].sort()
    this.universities = []
    for (var i=0; i < this.university_list.length; i++) {
      this.universities.push({id:i, name: this.university_list[i]})
    }

    this.state = {
      displayHousings: housingData,
      filterState: {
        minPrice: this.cheapestHousing.price,
        maxPrice: this.mostExpensiveHousing.price,
        minDistanceUni: this.closestHousingToUni.distanceUni,
        maxDistanceUni: this.farestHousingToUni.distanceUni,
        minDistanceRetail: this.closestHousingToRetail.distanceRetail,
        maxDistanceRetail: this.farestHousingToRetail.distanceRetail,
        uniName: this.university_list,

        rentPreference:0,
        safetyPreference:0,
        distanceUniPreference:0,
        distanceRetailPreference:0,
        alphabeticalSort: true,
      }
    }
  };


  // apply filters
  applyFilters = () => {
    var filterState = this.state.filterState;
    var displayHousings = housingData.filter( housing => {

      var universityQuery = filterState.uniName[0];
      //if all university show all
      if(universityQuery == "All Universities"){
        universityQuery = "";
      }
      console.log("here: " + universityQuery);
      // vars for price filter
      var minPrice = filterState.minPrice;
      var maxPrice = filterState.maxPrice;
      //vars for distance uni filter
      var minDistanceUni = filterState.minDistanceUni;
      var maxDistanceUni = filterState.maxDistanceUni;
      //vars for distance retail filter
      var minDistanceRetail = filterState.minDistanceRetail;
      var maxDistanceRetail = filterState.maxDistanceRetail;

      var rentPreference = filterState.rentPreference;
      var safetyPreference = filterState.safetyPreference;
      var distanceUniPreference = filterState.distanceUniPreference;
      var distanceRetailPreference = filterState.distanceRetailPreference;

      return (
        (minPrice <= housing.price && housing.price <= maxPrice)
        &&(minDistanceUni <= housing.distanceUni && housing.distanceUni <= maxDistanceUni)
        &&(minDistanceRetail <= housing.distanceRetail && housing.distanceRetail <= maxDistanceRetail)
        && (housing.uniName.includes(universityQuery))
      )
    })
    this.setState({displayHousings: displayHousings});
  }

  setPriceFilter = (event) => {
    console.log("Price Filter", event[0], event[1]);
    this.state.filterState.minPrice = event[0];
    this.state.filterState.maxPrice = event[1];
    this.applyFilters();
  }

  setUniDistanceFilter = (event) => {
    console.log("UniDistance Filter", event[0], event[1]);
    this.state.filterState.minDistanceUni = event[0];
    this.state.filterState.maxDistanceUni = event[1];
    this.applyFilters();
  }

  setRetailDistanceFilter = (event) => {
    console.log("RetailDistance Filter", event[0], event[1]);
    this.state.filterState.minDistanceRetail = event[0];
    this.state.filterState.maxDistanceRetail = event[1];
    this.applyFilters();
  }

  setUniversityFilter = (item) => {
    if (item) {
      console.log("Set university Filter: ", [item.name]);
      this.state.filterState.uniName = [item.name];
      this.applyFilters();
    } else {
      this.state.filterState.uniName = this.university_list;
      this.applyFilters();
    }
  }

  setRentPreference = (event) => {
    console.log("RentPreference Filter", event);
    this.state.filterState.rentPreference = event;
    this.applyFilters();
  }

  setSafetyPreference = (event) => {
    console.log("safetyPreference Filter", event);
    this.state.filterState.safetyPreference = event;
    this.applyFilters();
  }

  setDistanceUniPreference = (event) => {
    console.log("DistanceUniPreference Filter", event);
    this.state.filterState.distanceUniPreference = event;
    this.applyFilters();
  }

  setdistanceRetailPreference = (event) => {
    console.log("distanceRetailPreference Filter", event);
    this.state.filterState.distanceRetailPreference = event;
    this.applyFilters();
  }

  render() {
    console.log("Render App: ", this.state.displayHousings);
    return (
        <div className="container">
          <div className="logo">
            <img src={logo} width="120" height="60" />
          </div>
          <div className="row col-md-offset-4 ">
            <ReactSuperSelect
              placeholder="Select an University"
              onChange={this.setUniversityFilter}
              //TODO: onClear to check if needed
              onClear={this.setUniversityFilter}
              dataSource={this.universities}
              customClass="dropdown-select"
              customTagClass="dropdown-select-tag"
            />
          </div>

          {/*new row*/}

          <div className="row">
          <div className="col-xs-4 sliderTitle"> Rent</div>
          <div className="col-xs-4 sliderTitle"> Distance to University</div>
          <div className="col-xs-4 sliderTitle"> Distance to Retail</div>
          </div>

          <div className="row">
            <div className="col-xs-4">
              <div className="col-xs-2 default">
                <p>£{this.state.filterState.minPrice}</p>
              </div>
              <div className="col-xs-8">
              <Range
              max={this.mostExpensiveHousing.price}
              min={this.cheapestHousing.price}
              step={5}
              defaultValue={
                [this.cheapestHousing.price, this.mostExpensiveHousing.price]
              }
              onChange={this.setPriceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>£{this.state.filterState.maxPrice}</p>
              </div>
            </div>


            <div className="col-xs-4">
              <div className="col-xs-2 default">
                <p>{this.state.filterState.minDistanceUni}m</p>
              </div>
              <div className="col-xs-8">
              <Range
                max={this.farestHousingToUni.distanceUni}
                min={this.closestHousingToUni.distanceUni}
                step={10}
                defaultValue={
                  [this.closestHousingToUni.distanceUni, this.farestHousingToUni.distanceUni]
                }
                onChange={this.setUniDistanceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>{this.state.filterState.maxDistanceUni}m</p>
              </div>
              </div>


              <div className="col-xs-4">
              <div className="col-xs-2 default">
                <p>{this.state.filterState.minDistanceRetail}m</p>
              </div>
              <div className="col-xs-8">
              <Range
                max={this.farestHousingToRetail.distanceRetail}
                min={this.closestHousingToRetail.distanceRetail}
                step={10}
                defaultValue={
                  [this.closestHousingToRetail.distanceRetail, this.farestHousingToRetail.distanceRetail]
                }
                onChange={this.setRetailDistanceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>{this.state.filterState.maxDistanceRetail}m</p>
              </div>
              </div>
          </div>


          <div className="row">
              {/* Map Component */}
            <div className="col-xs-9  map">
              <MapComponent housings={ this.state.displayHousings} />
            </div>

            {/*new col*/}
            <div className="col-xs-3">
              <div className = "sliderTitle"> Preference </div>
              <div className="row">
                <div className="col-md-offset-1 col-xs-9">
                <div>Rent</div>
                <Slider
                step={1}
                defaultValue={0}
                onChange={this.setRentPreference}
                />
                </div>
                <div className="col-xs-2 default">
                  <p>{this.state.filterState.rentPreference}%</p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-offset-1 col-xs-9">
                <div>Safety</div>
                <Slider
                  step={1}
                  defaultValue={0}
                  onChange={this.setSafetyPreference}
                />
                </div>
                <div className="col-xs-2 default">
                  <p>{this.state.filterState.safetyPreference}%</p>
                </div>
                </div>

                <div className="row">
                <div className="col-md-offset-1 col-xs-9">
                <div>Distance to University</div>
                <Slider
                  step={1}
                  defaultValue={0}
                  onChange={this.setDistanceUniPreference}
                />
                </div>
                <div className="col-xs-2 default">
                  <p>{this.state.filterState.distanceUniPreference}%</p>
                </div>
                </div>

                <div className="row">
                <div className="col-md-offset-1 col-xs-9">
                <div>Distance to Retail</div>
                <Slider
                  step={1}
                  defaultValue={0}
                  onChange={this.setdistanceRetailPreference}
                />
                </div>
                <div className="col-xs-2 default">
                  <p>{this.state.filterState.distanceRetailPreference}%</p>
                </div>
                </div>
            </div>


          </div>


        </div>
    );
  }
}

const MapComponent = compose(

  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCBW4NoLJP651nz9MnszKz9mlftP4VMh1U&callback=initMap",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 53.03, lng: -2.1 },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={6.1}
    defaultCenter={{ lat: 53.03, lng: -2.1 }}
  >
    {props.housings.map((housing) => {
        return(
            <CustomerMarkerAndInfo key={housing.id} housing = { housing }/>
          )
        }
      )
    }
  </GoogleMap>
);

class CustomerMarkerAndInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isOpen: false,
        hovered: false,

    };
  }
  onClickOpen=()=>{
    if(this.state.isOpen === true){
      this.setState({isOpen: !this.state.isOpen, hovered: false});
    }
    else{
      this.setState({isOpen: !this.state.isOpen, hovered: false});
    }
  }
  onHoverOver=()=>{
    if(this.state.isOpen === false && this.state.hovered === false){
      this.setState({isOpen: false, hovered: true});
    }
  }
  onHoverOut=()=>{
    if(this.state.isOpen === false && this.state.hovered === true){
      this.setState({isOpen: false, hovered: false});
    }
  }
  render() {
    return (
      <Marker key={this.state.isOpen}
              position={this.props.housing.position}
              onClick={this.onClickOpen.bind(this)}
              onMouseOver={this.onHoverOver.bind(this)}
              onMouseOut={this.onHoverOut.bind(this)}
              icon ={this.state.icon}
              >
          {this.state.hovered && <InfoWindow>
                                      <span><b>{this.props.housing.city} / {this.props.housing.uniName}</b>
                                      <br/>Click to view more info
                                      </span></InfoWindow>}
          {this.state.isOpen && <InfoWindow onCloseClick={this.onClickOpen.bind(this)}>
                                      <span><b>{this.props.housing.city} / {this.props.housing.uniName}</b>
                                      <br/>{this.props.housing.tel}
                                      <br/><a href={this.props.housing.website} target='_blank'>{this.props.housing.website}</a>
                                      </span></InfoWindow>}
          </Marker>
        )
    }
}

export default App;
