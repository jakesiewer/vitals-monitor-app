import React, { Component, useEffect } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

const mapStyles = {
  width: '75%',
  height: '100%'
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: {
        lat: 53.3813477,
        lng: -6.5990704
      }
    };
  }

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    markers: [],
    placeName: ''
  };

  onMapClick = (mapProps, map, clickEvent) => {
    // console.log(this.props);
    this.setState({ markers: [], showingInfoWindow: false });
    const geocoder = new window.google.maps.Geocoder();
    const location = new window.google.maps.LatLng(clickEvent.latLng.lat(), clickEvent.latLng.lng());
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK') {
        this.setState({ placeName: results[0].formatted_address });
      }
    });
    const newMarker = {
      position: {
        lat: clickEvent.latLng.lat(),
        lng: clickEvent.latLng.lng()
      }
    };
    this.setState({ markers: [newMarker] });
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    const { markers, placeName } = this.state;
    // const [ current, setCurrent ] = useState()

    // this.useEffect(() => { 
    //   setCurrent({
    //     lat: 53.3813477,
    //     lng: -6.5990704
    //   })
    //   // console.log(data[0].lat) + ", " + data[0].lng)
    // }, [current]);

    // console.log(this.props)
    if (this.props.data !== undefined) {
      // const data = JSON.parse(this.props.data);
      console.log(this.props.data[0])
      // this.setState(
      //   {
      //     current: {
      //       lat: data[0].lat,
      //       lng: data[0].lng
      //     }
      //   })
      // console.log(this.state.current.lat)
    }

    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={
          {
            lat: 53.3813477,
            lng: -6.5990704
          }
        }
      // onClick={this.onMapClick}
      >
        {/* {markers.map((marker, index) => ( */}
          <Marker
            // key={index}
            // position={marker.position}
            position={
              {
                lat: this.props.data[0],
                lng: this.props.data[1]
              }
            }
          // onClick={this.onMarkerClick}
          />
        {/* ))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{placeName}</h4>
          </div>
        </InfoWindow> */}
      </Map>
    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: 'AIzaSyBBmkL_RfhpTWPPzwZ36sDPTQb1pSERAv4'
  }
  ))(MapContainer)