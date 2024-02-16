import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const Map = ({ jobLocations, techLocation, route }) => {
  const [isHovered, setHovered] = useState(false);

  const mapStyles = {
    height: "500px",
    width: "100%",
    float: "right",
    border: "2.5px solid #000",
    boxShadow: isHovered ? "0 0 20px #000" : "0 0 10px #000",
    transition: "box-shadow 0.3s ease-in-out",
  };

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  const mapRef = useRef(null);

  useEffect(() => {
    const getDirections = async () => {
      if (route.length > 1) {
        const waypoints = route.map((location) => ({
          location: new window.google.maps.LatLng(location.lat, location.lng),
        }));

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: waypoints[0].location,
            destination: waypoints[waypoints.length - 1].location,
            waypoints: waypoints.slice(1, -1),
            optimizeWaypoints: true,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") {
              const path = response.routes[0].overview_path;

              const polyline = new window.google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });

              polyline.setMap(mapRef.current.state.map);
            }
          }
        );
      }
    };

    if (mapRef.current && route.length > 1) {
      getDirections();
    }
  }, [route]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBtErQ7ymbpq4YDZNubaISCpSE1eXqF8L4">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={2}
        center={defaultCenter}
        ref={mapRef}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        {jobLocations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            label={`${index + 1}`}
          />
        ))}
        {techLocation && (
          <Marker
            position={{ lat: techLocation.lat, lng: techLocation.lng }}
            label="Tech"
          />
        )}
        {/* Polyline is now created dynamically using Google Maps Directions API */}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
