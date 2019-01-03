import React, { Component } from 'react';
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker } from "react-google-maps"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import logo from './Hello_world_logo.png';
var ReactSuperSelect = require('react-super-select');

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

var housingData = [
//   {
//     "id": 1,
//     "details_url": "http://www.hbs.edu",
//     "post_town": "London",

//     "Latitude": 51.5074,
//     "Longitude": 0.1278,
//     "avg_price": 0,
//     "Distance_to_School": 0,
//     "Store_Num": 0
// }
  // },{
  //   "id": 2,
  //   "details_url": "www.southampton.com",
  //   "post_town": "Southampton",

  //   "Latitude": 52.03,
  //   "Longitude": -2.2,
  //   "avg_price": 30,
  //   "Distance_to_School": 10000,
  //   "Store_Num": 20
  // }
].sort(function(a,b) {
    var x = a.post_town.toLowerCase();
    var y = b.post_town.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
});

var uni_overall_info = [
  {
    'min(avg_price)': 0,
    'max(avg_price)': 0,
    'min(Distance_to_School)': 0,
    'max(Distance_to_School)': 0,
    'min(Store_Num)': 0,
    'max(Store_Num)': 0,
  }
];

var uni_name = {
  'University of Birmingham': 'uni_birmingham',
  'University of Bristol': 'uni_bristol',
  'University of Cambridge': 'uni_cambridge',
  'Durham University': 'uni_durham',
  'University of Edinburgh': 'uni_edinburgh',
  "University of Glasgow": 'uni_glasgow',
  "Imperial College London": 'uni_london_imperial',
  "King's College London": 'uni_london_kcl',
  "University of Leeds": 'uni_leeds',
  "University of Liverpool": 'uni_liverpool',
  "London School of Economics": 'uni_london_lse',
  "University of Manchester":'uni_manchester',
  "Newcastle University": 'uni_newcastle',
  "University of Nottingham": 'uni_nottingham', 
  "University of Oxford": 'uni_oxford',
  "University of Sheffield": 'uni_sheffield',
  "University of Southampton": 'uni_southampton', 
  "University College London": 'uni_london_ucl',
  "University of York": 'uni_york'
}

var uni_loc = {
  'University of Birmingham': {lat: 52.448986, lng: -1.930855},
  'University of Bristol': {lat: 51.459064, lng: -2.603292},
  'University of Cambridge': {lat: 52.205317, lng: 0.116642},
  'Durham University': {lat: 54.768149, lng: -1.571868},
  'University of Edinburgh': {lat: 55.948003, lng: -3.188111},
  "University of Glasgow": {lat: 55.871746, lng: -4.288345},
  "Imperial College London": {lat: 51.500506, lng: -0.178194},
  "King's College London": {lat: 51.510734, lng: -0.116912},
  "University of Leeds": {lat: 53.808494, lng: -1.552797},
  "University of Liverpool": {lat: 53.406416, lng: -2.975554},
  "London School of Economics": {lat: 51.513968, lng: -0.116707},
  "University of Manchester": {lat: 53.467943, lng: -2.233222},
  "Newcastle University": {lat: 54.980327, lng: -1.615727},
  "University of Nottingham": {lat: 52.941271, lng: -1.186477}, 
  "University of Oxford": {lat: 51.757644, lng: -1.262868},
  "University of Sheffield": {lat: 53.381409, lng: -1.488709},
  "University of Southampton": {lat: 50.93418, lng: -1.395675}, 
  "University College London": {lat: 51.524774, lng: -0.133401},
  "University of York": {lat: 53.948437, lng: -1.053553}
}

var postcode_info = []

// var first_get = true;

// App Main Component
class App extends Component {
  constructor(props) {
    super(props);


    // this.cheapestHousing = housingData.reduce( (prev, curr) => {
    //   return prev.avg_price <= curr.avg_price ? prev : curr;
    // })

    // this.mostExpensiveHousing = housingData.reduce( (prev, curr) => {
    //   return prev.avg_price >= curr.avg_price ? prev : curr;
    // })

    // this.closestHousingToUni = housingData.reduce( (prev, curr) => {
    //   return prev.Distance_to_School <= curr.Distance_to_School ? prev : curr;
    // })

    // this.farestHousingToUni = housingData.reduce( (prev, curr) => {
    //   return prev.Distance_to_School >= curr.Distance_to_School ? prev : curr;
    // })

    // this.closestHousingToRetail = housingData.reduce( (prev, curr) => {
    //   return prev.Store_Num <= curr.Store_Num ? prev : curr;
    // })

    // this.farestHousingToRetail = housingData.reduce( (prev, curr) => {
    //   return prev.Store_Num >= curr.Store_Num ? prev : curr;
    // })


    // I need: alphabetically sorted university lists
    this.university_list = ["University of Birmingham", "University of Bristol", "University of Cambridge", "Durham University", "University of Edinburgh", "University of Glasgow", "Imperial College London", "King's College London", "University of Leeds", "University of Liverpool", "London School of Economics", "University of Manchester", "Newcastle University", "University of Nottingham", "University of Oxford", "University of Sheffield", "University of Southampton", "University College London", "University of York"].sort(),
    this.universities = []
    for (var i=0; i < this.university_list.length; i++) {
      this.universities.push({id:i, name: this.university_list[i]})
    }

    this.state = {
      // maxP: 0,
      // minP: 0,
      // maxDU: 0,
      // minDU: 0,
      // maxS: 0,
      // minS: 0,  
      displayHousings: housingData,
      filterState: {
        // minPrice: this.cheapestHousing.avg_price,
        // maxPrice: this.mostExpensiveHousing.avg_price,
        // minDistanceUni: this.closestHousingToUni.Distance_to_School,
        // maxDistanceUni: this.farestHousingToUni.Distance_to_School,
        // minDistanceRetail: this.closestHousingToRetail.Store_Num,
        // maxDistanceRetail: this.farestHousingToRetail.Store_Num,
        // uniName: this.university_list,

        // rentPreference:0,
        // safetyPreference:0,
        // distanceUniPreference:0,
        // distanceRetailPreference:0,
        // alphabeticalSort: true,
        minPrice: 0,
        maxPrice: 100,
        minDistanceUni: 0,
        maxDistanceUni: 0,
        minDistanceRetail: 0,
        maxDistanceRetail: 0,
        uniName: this.university_list,
        loc_zoom:{lat:53.03, lng:-2.1},
        zoom:6,

        rentPreference:0,
        safetyPreference:0,
        distanceUniPreference:0,
        distanceRetailPreference:0,
        alphabeticalSort: true,
      },
      uni: null,
      school:''
    }
  };

  update() {
    var cheapestHousing = housingData.reduce( (prev, curr) => {
      return prev.avg_price <= curr.avg_price ? prev : curr;
    })

    var mostExpensiveHousing = housingData.reduce( (prev, curr) => {
      return prev.avg_price >= curr.avg_price ? prev : curr;
    })

    var closestHousingToUni = housingData.reduce( (prev, curr) => {
      return prev.Distance_to_School <= curr.Distance_to_School ? prev : curr;
    })

    var farestHousingToUni = housingData.reduce( (prev, curr) => {
      return prev.Distance_to_School >= curr.Distance_to_School ? prev : curr;
    })

    var closestHousingToRetail = housingData.reduce( (prev, curr) => {
      return prev.Store_Num <= curr.Store_Num ? prev : curr;
    })

    var farestHousingToRetail = housingData.reduce( (prev, curr) => {
      return prev.Store_Num >= curr.Store_Num ? prev : curr;
    })

    var tempState = {...this.state.filterState}
    tempState.minPrice = cheapestHousing.avg_price;
    tempState.maxPrice = mostExpensiveHousing.avg_price;
    tempState.minDistanceUni = closestHousingToUni.Distance_to_School;
    tempState.maxDistanceUni = farestHousingToUni.Distance_to_School;
    tempState.minDistanceRetail = closestHousingToRetail.Store_Num;
    tempState.maxDistanceRetail = farestHousingToRetail.Store_Num
    // var universityQuery = tempState.uniName[0];
    //   //if all university show all
    // console.log(universityQuery);
    // if(universityQuery == "All Universities"){
    //   tempState.uniName = "";
    // }
    // console.log('#############',tempState)

    this.setState({
      filterState: tempState
    })

  }

  // componentDidMount() {
  //   fetch('http://localhost:5000/test'
  //   // , { 
  //   //   method: 'GET',
  //   //   headers:{
  //   //     'Access-Control-Allow-Origin': '*',
  //   //     'Access-Control-Allow-Credentials':true,
  //   //     'Access-Control-Allow-Methods':'POST, GET'
  //   //   }
  //   // }
  //   )
  //     .then(res => {
  //       console.log(res);
  //       return res.text();
  //     })
  //     .then(data => {
  //       console.log(data);
  //       this.setState({ data });
  //     });
  //     }
  handleGet = event => {
    event.preventDefault();
    console.log('---------------',this.state.filterState)
    this.houseGet(this.state.filterState.uniName,
                  this.state.filterState.rentPreference,
                  this.state.filterState.safetyPreference,
                  this.state.filterState.distanceUniPreference,
                  this.state.filterState.distanceRetailPreference,
                  this.state.filterState.minPrice,
                  this.state.filterState.maxPrice,
                  this.state.filterState.minDistanceUni,
                  this.state.filterState.maxDistanceUni,
                  this.state.filterState.minDistanceRetail,
                  this.state.filterState.maxDistanceRetail)   

  }

  handleGetUni = event => {
      event.preventDefault();
        this.getUniHouse(this.state.filterState.uniName)
    }


  handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

  async getUniHouse (uni) {
    var uniName = uni_name[uni];
    try {
      await fetch(`http://localhost:4000/api/getuni?uni=${uniName}`)
            .then(res => res.json())
            .then(data => (uni_overall_info=data))
    } catch (e) {
      alert(e);
    }
    housingData = [];
    this.applyFilters()

  }

  storePostcodeInfo = (infos) => {
    
    var house_postcode_info = {};
    for(var i =0; i<infos.length; i++){
      if (infos[i].postcode in house_postcode_info) {
        house_postcode_info[infos[i].postcode]['details_url'].push(infos[i].details_url)
      }
      else {
        house_postcode_info[infos[i].postcode] = {}
        house_postcode_info[infos[i].postcode]['id'] = i
        house_postcode_info[infos[i].postcode]['postcode'] = infos[i].postcode
        house_postcode_info[infos[i].postcode]['details_url'] = [infos[i].details_url]
        house_postcode_info[infos[i].postcode]['Latitude'] = infos[i].Latitude
        house_postcode_info[infos[i].postcode]['Longitude'] = infos[i].Longitude
        house_postcode_info[infos[i].postcode]['post_town'] = infos[i].post_town
        house_postcode_info[infos[i].postcode]['avg_price'] = infos[i].avg_price
        house_postcode_info[infos[i].postcode]['Distance_to_School'] = infos[i].Distance_to_School
        house_postcode_info[infos[i].postcode]['Store_Num'] = infos[i].Store_Num

      }
    }
    postcode_info = Object.values(house_postcode_info);
    console.log(postcode_info)
    //console.log(house_postcode_info)

  }
  

  async houseGet (uni, rent, safety, disUni, disRetail, minPrice, maxPrice, minDisUni, maxDisUni, minDisRetail, maxDisRetail){
    // console.log(rent, safety, disRetail, disUni)
    var uniName = uni_name[uni];
    if (rent === 0 && safety === 0 && disUni === 0 && disRetail === 0) {
      rent = safety = disUni = disRetail = 100;
    }
    var total = rent + safety + disRetail + disUni
    var rent_s = rent/total;
    var safety_s = safety/total;
    var disRetail_s = disRetail/total;
    var disUni_s = disUni/total;
    //console.log(total, rent_s, safety_s, disRetail_s, disUni_s);
    try{ 
      await fetch(`http://localhost:4000/api/get?uni=${uniName}&rent=${rent_s}&safety=${safety_s}\
                   &disUni=${disUni_s}&disRetail=${disRetail_s}&minPrice=${minPrice}\
                   &maxPrice=${maxPrice}&minDisUni=${minDisUni}&maxDisUni=${maxDisUni}\
                   &minDisRetail=${minDisRetail}&maxDisRetail=${maxDisRetail}`
      )
      .then(res => res.json()
      )
      .then(uni => 

          //console.log(uni);
          // (this.setState({uni: uni}))
          (housingData = uni)
          //console.log(uni);
      )} 
      catch (e) {
      alert(e);
      }
    console.log(housingData);
    
    this.storePostcodeInfo(housingData);
    this.applyFilters();
      
  }

  // housePost(school) {
  //       console.log(school);
  //       fetch(`http://localhost:4000/api/post?school=${school}`)
  //           .then(res => res.text())
  //           .then(uni => {
  //               console.log(uni)
  //               this.setState({ uni });
  //           })
  //           .catch(err => console.error(err))
  //   }

  


  // apply filters
  applyFilters = () => {
    //console.log('---------',housingData)
    if (housingData.length != 0) {
      this.update();
    }
    var filterState = this.state.filterState;

    //console.log('++++++++++', housingData);
    // if (first_get == true){
    //   this.setState({
    //     minP: Number(filterState.minPrice.toFixed(0)),
    //     maxP: Number(filterState.maxPrice.toFixed(0)),
    //     minDU: Number(filterState.minDistanceUni.toFixed(0)),
    //     maxDU: Number(filterState.maxDistanceUni.toFixed(0)),
    //     minS: filterState.minDistanceRetail,
    //     maxS: filterState.maxDistanceRetail,
    //   });
    //   first_get = false
    // }

    var displayHousings = housingData.filter( housing => {

      var universityQuery = filterState.uniName[0];
      //if all university show all
      // if(universityQuery == "All Universities"){
      //   universityQuery = "";
      // }
      //console.log("here: " + universityQuery);
      // vars for price filter
      var minPrice = filterState.minPrice;
      var maxPrice = filterState.maxPrice;
      //vars for distance uni filter
      var minDistanceUni = filterState.minDistanceUni;
      var maxDistanceUni = filterState.maxDistanceUni;
      //vars for distance retail filter
      var minDistanceRetail = filterState.minDistanceRetail;
      var maxDistanceRetail = filterState.maxDistanceRetail;

      // var rentPreference = filterState.rentPreference;
      // var safetyPreference = filterState.safetyPreference;
      // var distanceUniPreference = filterState.distanceUniPreference;
      // var distanceRetailPreference = filterState.distanceRetailPreference;

      return (
        (minPrice <= housing.avg_price && housing.avg_price <= maxPrice)
        &&(minDistanceUni <= housing.Distance_to_School && housing.Distance_to_School <= maxDistanceUni)
        &&(minDistanceRetail <= housing.Store_Num && housing.Store_Num <= maxDistanceRetail)
      )
    })
    //console.log('666666', displayHousings)
    this.setState({displayHousings: displayHousings});
  }

  setPriceFilter = (event) => {
    //console.log('++++++', event)
    //console.log("Price Filter", event[0], event[1]);
    this.state.filterState.minPrice = event[0];
    this.state.filterState.maxPrice = event[1];
    
    var tempState = {...this.state.filterState}
    tempState.minPrice = event[0];
    tempState.maxPrice = event[1];
    this.setState({
      filterState: tempState
    })
    console.log(this.state.filterState)
    //this.applyFilters();
  }

  setUniDistanceFilter = (event) => {
    console.log("UniDistance Filter", event[0], event[1]);
    this.state.filterState.minDistanceUni = event[0];
    this.state.filterState.maxDistanceUni = event[1];
    //this.applyFilters();
  }

  setRetailDistanceFilter = (event) => {
    console.log("RetailDistance Filter", event[0], event[1]);
    this.state.filterState.minDistanceRetail = event[0];
    this.state.filterState.maxDistanceRetail = event[1];
    //this.applyFilters();
  }

  setUniversityFilter = (item) => {
    if (item) {
      console.log("Set university Filter: ", [item.name]);
      console.log("location Filter: ", uni_loc[item.name].lat);
      this.state.filterState.uniName = [item.name];
      this.state.filterState.loc_zoom = uni_loc[item.name];
      this.state.filterState.zoom = 8;
      this.getUniHouse(this.state.filterState.uniName);
      
      this.applyFilters();
    } else {
      this.state.filterState.uniName = this.university_list;
      this.state.filterState.loc_zoom = {lat:53.03,lng:-2.1};
      this.state.filterState.zoom = 6;
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
    //console.log("Render App: ", this.state.displayHousings);
    return (
        <div className="container">
          <div className="logo">
            <img src={logo} width="120" height="60" />
          </div>
         

          {/* New Row */}
          <br/>
          <br/>
          <div className="row">
              {/* Map Component */}
            <div className="col-xs-9  map">
              <MapComponent housings={ postcode_info} 
                            loc_zoom = {this.state.filterState.loc_zoom}
                            zoom = {this.state.filterState.zoom}/>
            </div>

            {/*new col*/}


            <div className="col-xs-3">

            <div className="row">
            <ReactSuperSelect
              placeholder="&nbsp; Select an University"
              onChange={this.setUniversityFilter}
              //TODO: onClear to check if needed
              onClear={this.setUniversityFilter}
              dataSource={this.universities}
              customClass="dropdown-select"
              customTagClass="dropdown-select-tag"
            />
          </div><br/>

            
            <div className="row sliderTitle"> Rent</div>
            <div className="row">
              <div className="col-xs-2 default">
                <p>£{uni_overall_info[0]['min(avg_price)'].toFixed(0)}</p>
              </div>
              <div className="col-xs-8">
              {/* {console.log(this.state.filterState)} */}
              <Range
                min={uni_overall_info[0]['min(avg_price)']}
                max={uni_overall_info[0]['max(avg_price)']}
                step={5}
                // defaultValue={
                //   // [this.cheapestHousing.avg_price, this.mostExpensiveHousing.avg_price]
                //   //[Number((this.state.filterState.minPrice).toFixed(0)), Number((this.state.filterState.maxPrice).toFixed(0))]
                //   [0, 100]
                // }
                tipFormatter={value => value}
                onChange={this.setPriceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>£{uni_overall_info[0]['max(avg_price)'].toFixed(0)}</p>
              </div>
            </div>

            <div className="row sliderTitle"> Distance to University</div>
            <div className="row">
              <div className="col-xs-2 default">
                <p>{uni_overall_info[0]['min(Distance_to_School)'].toFixed(0)}m</p>
              </div>
              <div className="col-xs-8">
              <Range
                max={uni_overall_info[0]['max(Distance_to_School)']}
                min={uni_overall_info[0]['min(Distance_to_School)']}
                step={2}
                // defaultValue={
                //   [0,0]
                // }
                tipFormatter={value => value}
                onChange={this.setUniDistanceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>{uni_overall_info[0]['max(Distance_to_School)'].toFixed(0)}m</p>
              </div>
              </div>

            <div className="row sliderTitle"> Number of Retails Within 1 km</div>
            <div className="row">
              <div className="col-xs-2 default">
                <p>{uni_overall_info[0]['min(Store_Num)']}</p>
              </div>
              <div className="col-xs-8">
              <Range
                max={uni_overall_info[0]['max(Store_Num)']}
                min={uni_overall_info[0]['min(Store_Num)']}
                step={1}
                tipFormatter={value => value}
                // defaultValue={
                //   [0,0]
                // }
                onChange={this.setRetailDistanceFilter}
              />
              </div>
              <div className="col-xs-2 default">
                <p>{uni_overall_info[0]['max(Store_Num)']}</p>
              </div>
              </div>

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
                <div>Number of Retails Within 1 km</div>
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

            {/* <form>
              <input id='school' value={this.state.school || ''} onChange={this.handleChange}></input>
              <button onClick={this.handlePost}>post</button>
              <button onClick={this.handleGet}>get</button>
            </form> */}
            <button className='button' onClick={this.handleGet}>Submit</button>

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
    zoom={props.zoom}
    center={{lat:props.loc_zoom.lat,lng:props.loc_zoom.lng}}
  >
    {
      props.housings.map((housing) => {
      // console.log('==========')

        return(
            <CustomerMarkerAndInfo key={housing.id} housing = { housing }/>
          )
        }
      )
      
      
    }
  </GoogleMap>
  // if (select_uni == true) {
  //   {console.log('000000000')}
    
  //   <GoogleMap
  //     defaultZoom={6.1}
  //     defaultCenter={{ lat: 53.03, lng: -2.1 }}
  //   >
  //     { 
  //       function (props) {
  //         console.log('1111')
  //         return(
  //           <CustomerMarkerAndInfo key={props.housings.id} housing = { props.housings }/>
  //       )}
  //     }
      
  //   </GoogleMap>
  // }
  // else {
  //   <GoogleMap
  //     defaultZoom={6.1}
  //     defaultCenter={{ lat: 53.03, lng: -2.1 }}
  //   >
  //     {
  //       props.housings.map((housing) => {
  //         console.log('2222')
  //         return(
  //             <CustomerMarkerAndInfo key={housing.id} housing = { housing }/>
  //           )
  //         }
  //       )
  //     }
  //   </GoogleMap>

  // }

);

// class CustomerMarkerAndInfo extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         isOpen: false,
//         hovered: false,

//     };
//   }
//   onClickOpen=()=>{
//     if(this.state.isOpen === true){
//       this.setState({isOpen: !this.state.isOpen, hovered: false});
//     }
//     else{
//       this.setState({isOpen: !this.state.isOpen, hovered: false});
//     }
//   }
//   onHoverOver=()=>{
//     if(this.state.isOpen === false && this.state.hovered === false){
//       this.setState({isOpen: false, hovered: true});
//     }
//   }
//   onHoverOut=()=>{
//     if(this.state.isOpen === false && this.state.hovered === true){
//       this.setState({isOpen: false, hovered: false});
//     }
//   }
//   render() {
//     return (
//       <Marker key={this.state.isOpen}
//               position={this.props.housing.position}
//               onClick={this.onClickOpen.bind(this)}
//               onMouseOver={this.onHoverOver.bind(this)}
//               onMouseOut={this.onHoverOut.bind(this)}
//               icon ={this.state.icon}
//               >
//           {this.state.hovered && <InfoWindow>
//                                       <span><b>{this.props.housing.city} / {this.props.housing.uniName}</b>
//                                       <br/>Click to view more info
//                                       </span></InfoWindow>}
//           {this.state.isOpen && <InfoWindow onCloseClick={this.onClickOpen.bind(this)}>
//                                       <span><b>{this.props.housing.city} / {this.props.housing.uniName}</b>
//                                       <br/>{this.props.housing.tel}
//                                       <br/><a href= '_blank'>{this.props.housing.website}</a >
//                                       </span></InfoWindow>}
//           </Marker>
//         )
//     }
// }


class CustomerMarkerAndInfo extends Component {
  constructor(props) {
    super(props);

    // var pos = {}
    // if (select_uni == true) {
    //   var uniname = this.props.housing.uniName
    //   console.log(uniname)
    //   pos =  uni_loc[uniname]
    // }
    // else{
    //   pos = {
    //     lat: this.props.housing.Latitude,
    //     lng: this.props.housing.Longitude}
    // }

    this.state = {
        isOpen: false,
        hovered: false,
        position: {
        lat: this.props.housing.Latitude,
        lng: this.props.housing.Longitude},

    };

    //console.log(pos)
  }


  // showOnlyUni=()=>{
  //   if (select_uni == ture) {
  //     var uniname = this.props.housing.universityName
  //     this.setState({
  //       position: uni_loc[uniname]
  //     })
  //   }
  // }

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
    // console.log('-------------');
    return (
      <Marker key={this.state.isOpen}
              position={this.state.position}
              onClick={this.onClickOpen.bind(this)}
              onMouseOver={this.onHoverOver.bind(this)}
              onMouseOut={this.onHoverOut.bind(this)}
              icon ={this.state.icon}
              >
          {this.state.hovered && <InfoWindow>
                                      <span><b>{this.props.housing.post_town} / {this.props.housing.postcode}</b>
                                      <br/>Click to view more info
                                      </span></InfoWindow>}
          {this.state.isOpen && <InfoWindow onCloseClick={this.onClickOpen.bind(this)}>
                                      <span><b>{this.props.housing.post_town} / {this.props.housing.postcode}</b>
                                      <br/>Rent Price: £{(this.props.housing.avg_price).toFixed(2)}
                                      <br/>Distance to University: {(this.props.housing.Distance_to_School).toFixed(2)}m
                                      <br/>Retail Number: {this.props.housing.Store_Num}
                                      <br/>Links for Houses' Information in This Postcode: 
                                      {this.props.housing.details_url.map((url, i) => {
                                        return(<div key={i}><a href={url} target='_blank' >{url}</a></div>)
                                      })}
                                      {/* <br/><a href={this.props.housing.details_url} target='_blank'>{this.props.housing.details_url}</a> */}
                                      </span></InfoWindow>}
          </Marker>
        )
    }
}

export default App;
