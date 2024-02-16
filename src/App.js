import React, { useState, useEffect } from "react";
import AddressInput from "./components/AddressInput";
import Map from "./components/Map";
import PlanRouteButton from "./components/PlanRouteButton";
import "./App.css";

const App = () => {
  const [jobLocations, setJobLocations] = useState([]);
  const [techLocation, setTechLocation] = useState(null);
  const [techLocationSearchTerm, setTechLocationSearchTerm] = useState("");
  const [route, setRoute] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const [locationStatus, setLocationStatus] = useState({});

  const handleAddAddress = async (address) => {
    try {
      const geocodedLocation = await geocodeAddress(address);
      setJobLocations((prevLocations) => [...prevLocations, geocodedLocation]);
    } catch (error) {
      console.error("Error geocoding job address:", error);
    }
  };

  const handleAddTechLocation = async () => {
    try {
      const geocodedLocation = await geocodeAddress(techLocationSearchTerm);
      setTechLocation(geocodedLocation);
    } catch (error) {
      console.error("Error geocoding technician address:", error);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyBtErQ7ymbpq4YDZNubaISCpSE1eXqF8L4`
      );

      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng, address };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      throw error;
    }
  };

  const nearestNeighborTSP = (locations, startLocation) => {
    const remainingLocations = [...locations];
    const path = [startLocation];
    let currentLocation = startLocation;

    while (remainingLocations.length > 0) {
      let nearestLocation = null;
      let minDistance = Number.MAX_VALUE;

      remainingLocations.forEach((location) => {
        const distance = calculateDistance(currentLocation, location);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLocation = location;
        }
      });

      path.push(nearestLocation);
      remainingLocations.splice(remainingLocations.indexOf(nearestLocation), 1);
      currentLocation = nearestLocation;
    }

    // Check if the last location in the path is the same as the start location
    if (path[path.length - 1] === startLocation) {
      // Remove the last element to eliminate the return trip to the start location
      path.pop();
    }

    return path;
  };

  const calculateDistance = (location1, location2) => {
    const R = 6371;
    const lat1 = location1.lat;
    const lon1 = location1.lng;
    const lat2 = location2.lat;
    const lon2 = location2.lng;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handlePlanRoute = () => {
    if (techLocation && jobLocations.length > 0) {
      const tspRoute = nearestNeighborTSP(jobLocations, techLocation);
      setRoute(tspRoute);

      const routeNames = tspRoute.map((location) => location.address);
      setRouteNames(routeNames);

      // Initialize locationStatus with all locations set to false (not visited)
      const initialLocationStatus = {};
      routeNames.forEach((locationName) => {
        initialLocationStatus[locationName] = false;
      });
      setLocationStatus(initialLocationStatus);
    } else {
      console.warn(
        "Technician location or job locations missing. Cannot calculate route."
      );
    }
  };

  const handleCheckboxChange = (locationName) => {
    setLocationStatus((prevStatus) => ({
      ...prevStatus,
      [locationName]: !prevStatus[locationName],
    }));
  };

  useEffect(() => {}, []);

  return (
    
    <div id="whole">
      {/* Left side (map) */}
      <div id="map">
        <Map
          jobLocations={jobLocations}
          techLocation={techLocation}
          route={route}
        />
      </div>
    <div class="input-box">
      <div id="technician" style={{ flex: 1, paddingRight: "20px" }}>
        <h2 class="title">Job Locations</h2>
        <AddressInput onAddAddress={handleAddAddress} />
        <ul>
          {jobLocations.map((location, index) => (
            <li key={index}>{`Job Location ${index + 1}: ${location.address} (${
              location.lat
            }, ${location.lng})`}</li>
          ))}
        </ul>
        <h2 class="title">Technician Location</h2>
        <div >
          <input
            id="input"
            type="text"
            placeholder="Enter address..."
            value={techLocationSearchTerm}
            onChange={(e) => setTechLocationSearchTerm(e.target.value)}
          />
          <button id="button" onClick={handleAddTechLocation}>
            Set Technician Location
          </button>
        </div>
        {techLocation && (
          <p>{`Technician Location: (${techLocation.lat}, ${techLocation.lng}) - ${techLocation.address}`}</p>
        )}

        <PlanRouteButton onPlanRoute={handlePlanRoute} />

        {routeNames.length > 0 && (
          <div>
            <h2>Route Information:</h2>
            <ul>
              {routeNames.map((locationName, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={locationStatus[locationName]}
                      onChange={() => handleCheckboxChange(locationName)}
                    />
                    {`Step ${index + 1}: ${locationName}`}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default App;
