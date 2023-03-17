import React, { Component, useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { mapEventBus } from '../chart/ScrubberChart';


const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

export const MapContainer = () => {
  const [current, setCurrent] = useState({
    lat: 53.3813477,
    lng: -6.5990704
  });

  useEffect(() => {
    // const mapEventBus = new window.EventTarget();
    mapEventBus.on('mapDataUpdated', (location) => {
      console.log(location)
      setCurrent(location);
    });

    return () => {
      mapEventBus.off('mapDataUpdated', () => () => { });
    };
  }, []);

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [placeName, setPlaceName] = useState('');

  const onMapClick = (mapProps, map, clickEvent) => {
    setMarkers([]);
    setShowingInfoWindow(false);
    const geocoder = new window.google.maps.Geocoder();
    const location = new window.google.maps.LatLng(clickEvent.latLng.lat(), clickEvent.latLng.lng());
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK') {
        setPlaceName(results[0].formatted_address);
      }
    });
    const newMarker = {
      position: {
        lat: current.lat,
        lng: current.lng
      }
    };
    setMarkers([newMarker]);
  }

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  }

  const onClose = (props) => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  if (current !== []) {
    console.log(current)
  }

  return (
    <div id="map-wrapper" style={{ height: '500px', width: '100%', position: 'relative' }}>
      <Map
        google={window.google}
        zoom={14}
        style={mapStyles}
        initialCenter={current}
        onClick={onMapClick}
      >
        <Marker
          position={{
            lat: current.lat,
            lng: current.lng
          }}
          onClick={onMarkerClick}
        />
      </Map>
    </div>
  );
}

// export default MapContainer;

// export default MapContainer;
// export class MapContainer extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       current: {
//         lat: 53.3813477,
//         lng: -6.5990704
//       }
//     };
//   }

//   state = {
//     showingInfoWindow: false,
//     activeMarker: {},
//     selectedPlace: {},
//     markers: [],
//     placeName: ''
//   };

//   onMapClick = (mapProps, map, clickEvent) => {
//     // console.log(this.props);
//     this.setState({ markers: [], showingInfoWindow: false });
//     const geocoder = new window.google.maps.Geocoder();
//     const location = new window.google.maps.LatLng(clickEvent.latLng.lat(), clickEvent.latLng.lng());
//     geocoder.geocode({ location }, (results, status) => {
//       if (status === 'OK') {
//         this.setState({ placeName: results[0].formatted_address });
//       }
//     });
//     const newMarker = {
//       position: {
//         lat: clickEvent.latLng.lat(),
//         lng: clickEvent.latLng.lng()
//       }
//     };
//     this.setState({ markers: [newMarker] });
//   }

//   onMarkerClick = (props, marker, e) => {
//     this.setState({
//       selectedPlace: props,
//       activeMarker: marker,
//       showingInfoWindow: true
//     });
//   }

//   onClose = props => {
//     if (this.state.showingInfoWindow) {
//       this.setState({
//         showingInfoWindow: false,
//         activeMarker: null
//       });
//     }
//   };

//   render() {
//     const { markers, placeName } = this.state;
//     // const [ current, setCurrent ] = useState()

//     // this.useEffect(() => { 
//     //   setCurrent({
//     //     lat: 53.3813477,
//     //     lng: -6.5990704
//     //   })
//     //   // console.log(data[0].lat) + ", " + data[0].lng)
//     // }, [current]);

//     // console.log(this.props)
//     if (this.props.data !== undefined) {
//       // const data = JSON.parse(this.props.data);
//       console.log(this.props.data[0])
//       // this.setState(
//       //   {
//       //     current: {
//       //       lat: data[0].lat,
//       //       lng: data[0].lng
//       //     }
//       //   })
//       // console.log(this.state.current.lat)
//     }

//     return (
//       <Map
//         google={this.props.google}
//         zoom={14}
//         style={mapStyles}
//         initialCenter={
//           {
//             lat: 53.3813477,
//             lng: -6.5990704
//           }
//         }
//       // onClick={this.onMapClick}
//       >
//         {/* {markers.map((marker, index) => ( */}
//           <Marker
//             // key={index}
//             // position={marker.position}
//             position={
//               {
//                 lat: this.props.data[0],
//                 lng: this.props.data[1]
//               }
//             }
//           // onClick={this.onMarkerClick}
//           />
//         {/* ))}
//         <InfoWindow
//           marker={this.state.activeMarker}
//           visible={this.state.showingInfoWindow}
//           onClose={this.onClose}
//         >
//           <div>
//             <h4>{placeName}</h4>
//           </div>
//         </InfoWindow> */}
//       </Map>
//     );
//   }
// }

export default GoogleApiWrapper(
  (props) => ({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  }
  ))(MapContainer)