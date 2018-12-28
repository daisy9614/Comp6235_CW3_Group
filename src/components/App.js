import React, { Component } from 'react';
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker } from "react-google-maps"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css'
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
var ReactSuperSelect = require('react-super-select');
var uniData = [{
    "id": 1,
    "name": "Harvard",
    "subject": {
      "Finance": 2,
      "Manufacturing": 1,
      "Agriculture": 2,
      "Anatomy": 2,
      "American": 2,
    },
    "website": "http://www.hbs.edu",
    "city": "Boston",
    "tel": "+77059997040",
    "position": {
      lat: -34.397,
      lng: 150.644
    },
    "price": 50000,
    "group": "GW4"
  },{
    "id": 2,
    "name": "Univeristy of Southampton",
    "subject": {
      "Agriculture": 1,
      "Manufacturing": 3,
      "Finance": 2,
      "American": 1,
    },
    "website": "www.southampton.com",
    "city": "Southampton",
    "tel": "+77059997040",
    "position": {
      lat: -34.597,
      lng: 150.544
    },
    "price": 10000,
    "group": "Russell Group"
  },{
    "id": 3,
    "name": "Stanford",
    "subject": {
      "Finance": 1,
      "Manufacturing": 2,
      "Agriculture": 1,
      "Anatomy": 1,
    },
    "website": "www.stanford.edu",
    "city": "Stanford",
    "tel": "+77059997040",
    "position": {
      lat: -34.507,
      lng: 150.441
    },
    "price": 30000,
    "group": "Russell Group"
  }
].sort(function(a,b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
});

// App Main Component
class App extends Component {
  constructor(props) {
    super(props);

    this.cheapestUni = uniData.reduce( (prev, curr) => {
      return prev.price < curr.price ? prev : curr;
    })

    this.mostExpensiveUni = uniData.reduce( (prev, curr) => {
      return prev.price > curr.price ? prev : curr;
    })


    // I need: alphabetically sorted group and subject lists
    this.group_list = ["GW4", "1994 Group", "M5 Universities", "White Rose University Consortium", "Oxbridge", "Million Plus", "N8 Research Partnership", "ABSA", "Science and Engineering South", "University Alliane", "NCUK", "Cathedrals Group", "Russell Group"].sort()
    this.groups = []
    for (var i=0; i < this.group_list.length; i++) {
      this.groups.push({id:i, name: this.group_list[i]})
    }

    this.subject_list = ["Overall", "Finance", "Manufacturing", "Agriculture", "American", "Anatomy",
             "Anthropology", "Archeology", "Architecture", "Art", "Aural", "Biological", "Building",
             "Business", "Celtic", "Chemical", "Chemistry", "Civil", "Classics", "Communication", "Complementary", "Computer",
             "Creative", "Drama", "East", "Economics", "Education", "Electrical", "English", "Food",
             "Forensic", "French", "General", "Geography", "Geology", "German", "History", "HistoryArt",
             "Hospitality", "Iberian", "Italian", "Land", "Law", "Librarianship", "Linguistics", "Marketing", "Materials", "Mathematics",
             "MechanicalEngineering", "MedicalTechnology", "Medicine", "Middle",
             "Music", "Nursing", "OccupationalTherapy", "Optometry", "Pharmacology", "Philosophy",
             "Physics", "Physiotherapy", "Politics", "Psychology", "Russian", "SocialPolicy", "SocialWork", "Sociology", "Sports", "Theology", "Town", "Veterinary"].sort()
    this.subjects = []
    for (var i=0; i < this.subject_list.length; i++) {
      this.subjects.push({id:i, name: this.subject_list[i]})
    }

    this.state = {
      displayedUnies: uniData,
      filterState: {
        searchQueryName: "",
        minPrice: this.cheapestUni.price,
        maxPrice: this.mostExpensiveUni.price,
        group: this.group_list,
        subject: this.subject_list,
        alphabeticalSort: true,
      }
    }
  };


  // apply filters
  applyFilters = () => {
    var filterState = this.state.filterState;
    var displayedUnies = uniData.filter( uni => {
      // vars for name filter
      var searchQueryName = filterState.searchQueryName;
      console.log("NameName", searchQueryName);
      var uniName = uni.name.toLowerCase();
      // vars for price filter
      var minPrice = filterState.minPrice;
      var maxPrice = filterState.maxPrice;
      // TODO how it filters after Clearing subj Filter
      var subjectQuery = filterState.subject[0];
      // console.log("Group Includes: " , filterState.group, "looking for a uni group: ", uni.group)
      return (
        (uniName.indexOf(searchQueryName) !== -1)
        && (minPrice <= uni.price && uni.price <= maxPrice)
        && (filterState.group.includes(uni.group))
        && (uni.subject[subjectQuery] !== undefined)
      )
    })
    this.setState({displayedUnies: displayedUnies});
  }

  setNameFilter = (event) => {
    console.log("Name Filter", event.target.value);
    this.state.filterState.searchQueryName = event.target.value.toLowerCase();
    this.applyFilters();
  }

  setPriceFilter = (event) => {
    console.log("Price Filter", event[0], event[1]);
    this.state.filterState.minPrice = event[0];
    this.state.filterState.maxPrice = event[1];
    this.applyFilters();
  }

  setGroupFilter = (item) => {
    if (item) {
      console.log("Set Group Filter: ", [item.name]);
      this.state.filterState.group = [item.name];
      this.applyFilters();
    } else {
      this.state.filterState.group = this.group_list;
      this.applyFilters();
    }
  }

  setSubjectFilter = (item) => {
    if (item) {
      console.log("Set Subject Filter: ", [item.name]);
      this.state.filterState.subject = [item.name];
      this.state.filterState.alphabeticalSort = false;
      this.applyFilters();
    } else {
      this.state.filterState.alphabeticalSort = true;
      this.state.filterState.subject = this.subject_list;
      this.applyFilters();
    }
  }

  render() {
    console.log("Render App: ", this.state.displayedUnies);
    return (
        <div className="container">
          <div className="row map">
              {/* Map Component */}
            <div className="col-xs-8 map">
              <MapComponent universities={ this.state.displayedUnies} />
            </div>
            <div className="col-xs-4 map">
              <SidePaneInfo
                universities={ this.state.displayedUnies}
                subject={this.state.filterState.subject[0]}
                alphabeticalSort={this.state.filterState.alphabeticalSort}
              />
            </div>
          </div>


        </div>
    );
  }
}

class SidePaneInfo extends Component {
  render() {
    // if a subject is chosen then by rank, otherwise alphabetically
    if (!this.props.alphabeticalSort) {
      var subject = this.props.subject;
      var displayedUnies = this.props.universities.sort((a,b) => {
          return a.subject[subject] - b.subject[subject];
        });
    } else {
      var displayedUnies = this.props.universities;
    }

    return (
      <div>
        {

        }
      </div>
    )
  }
}



const MapComponent = compose(
  //   //TODO: Renew token: AIzaSyDGHHha2rmP8WOTrvDGaEpZlPNtV2m-rs
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCBW4NoLJP651nz9MnszKz9mlftP4VMh1U&callback=initMap",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 25.03, lng: 121.6 },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.universities.map((uni) => {
        return(
            <CustomerMarkerAndInfo key={uni.id} uni = { uni }/>
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
        icon: icon24
    };
  }
  onClickOpen=()=>{
    if(this.state.isOpen === true){
      this.setState({isOpen: !this.state.isOpen, hovered: false, icon: icon24});
    }
    else{
      this.setState({isOpen: !this.state.isOpen, hovered: false, icon: icon64});
    }
  }
  onHoverOver=()=>{
    if(this.state.isOpen === false && this.state.hovered === false){
      this.setState({isOpen: false, hovered: true, icon: icon64});
    }
  }
  onHoverOut=()=>{
    if(this.state.isOpen === false && this.state.hovered === true){
      this.setState({isOpen: false, hovered: false, icon: icon24});
    }
  }
  render() {
    return (
      <Marker key={this.state.isOpen}
              position={this.props.uni.position}
              onClick={this.onClickOpen.bind(this)}
              onMouseOver={this.onHoverOver.bind(this)}
              onMouseOut={this.onHoverOut.bind(this)}
              //icon ={this.state.icon}
              >
          {this.state.hovered && <InfoWindow>
                                      <span><b>{this.props.uni.name}</b>
                                      <br/>Click to view more info
                                      </span></InfoWindow>}
          {this.state.isOpen && <InfoWindow onCloseClick={this.onClickOpen.bind(this)}>
                                      <span><b>{this.props.uni.name}</b>
                                      <br/>{this.props.uni.tel}
                                      <br/><a href={this.props.uni.website} target='_blank'>{this.props.uni.website}</a>
                                      </span></InfoWindow>}
          </Marker>
        )
    }
}

// <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from
// <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by
// <a href="http://creativecommons.org/licenses/by/3.0/"
// title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

export default App;
