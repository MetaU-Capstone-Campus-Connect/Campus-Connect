import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";
import SetLocation from "./SetLocation";
import BarChart from "./BarChart";
import MapClickModal from "./MapClickModal";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

function HomePage({ userName }) {
  const apiKey = import.meta.env.VITE_GOOGLE_API;
  const apiMapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  const defaultPosition = { lat: 37.48026943463089, lng: -122.15979710343754 };
  const [allLocations, setAllLocations] = useState([]);
  const [highLowLocations, sethighLowLocations] = useState({});
  const [open, setOpen] = useState(null);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [lowestPopulationOpen, setLowestPopulationOpen] = useState(false);
  const [dayCounts, setDayCounts] = useState(null);
  const [chartMode, setChartMode] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [locationPercentage, setLocationPercentage] = useState(null);

  const handleOpen = (mapId) => {
    setOpen((prev) => (prev === mapId ? null : mapId));
  };

  const getLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/getLocations", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setAllLocations(data);
    } catch (error) {
      console.error("Error: Fetching locations", error);
    }
  };

  const getHighLowLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/gridCluster", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      sethighLowLocations(data);
    } catch (error) {
      console.error("Error: Fetching high and low locations", error);
    }
  };

  function showTime(time) {
    const currentTime = new Date();
    const pastTime = new Date(time);
    const timeDiff = currentTime - pastTime;
    const diffMinutes = Math.floor(timeDiff / (1000 * 60));
    const diffHhours = Math.floor(diffMinutes / 60);
    const minutesRemain = diffMinutes % 60;

    if (diffHhours > 0 && minutesRemain > 0) {
      return `${diffHhours} Hours ${minutesRemain} Minutes Ago`;
    } else if (diffHhours > 0) {
      return `${diffHhours} Hours Ago`;
    } else if (minutesRemain > 0) {
      return `${minutesRemain} Minutes Ago`;
    } else {
      return "Just Now";
    }
  }

  useEffect(() => {
    getLocations();
    getHighLowLocations();
  }, []);

  const handleMapClick = async (event) => {
    if (!chartMode) return;
    const mapLat = event.detail.latLng.lat;
    const mapLong = event.detail.latLng.lng;
    try {
      const res = await fetch("http://localhost:3000/checkCellLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapLat, mapLong }),
      });
      const data = await res.json();
      setDayCounts(data.dayCounts);
      setLocationPercentage(data.percentage);
      setModalStatus(true);
    } catch (error) {
      console.error("Error: User click location", error);
    }
  };

  const isInsideCluster = (lat, lng) => {
    const bounds = highLowLocations?.biggestCluster?.cells?.[0]?.bounds;
    if (!bounds) return false;
    return (
      lat >= bounds.minLat &&
      lat <= bounds.maxLat &&
      lng >= bounds.minLng &&
      lng <= bounds.maxLng
    );
  };

  const clusteredUsers = allLocations.filter((loc) =>
    isInsideCluster(loc.mapLat, loc.mapLong),
  );

  return (
    <>
      <Header userName={userName} />
      <div className="homePageWelcome">
        Welcome Back, {userName}
      </div>

      <div className="setLocationButton">
        <SetLocation userName={userName} getLocations={getLocations} />
        <button onClick={() => setChartMode((prev) => !prev)}>
          {chartMode ? "Exit Map History Mode" : "Map History Mode"}
        </button>
      </div>

      <div className="mapContainer">
        <APIProvider apiKey={apiKey}>
          <Map
            className="heatMap"
            defaultZoom={16}
            defaultCenter={defaultPosition}
            mapId={apiMapId}
            onClick={handleMapClick}
          >
            {allLocations
              .filter(
                (location) =>
                  !isInsideCluster(location.mapLat, location.mapLong),
              )
              .map((location) => (
                <div key={location.mapId}>
                  <AdvancedMarker
                    position={{
                      lat: location.mapLat,
                      lng: location.mapLong,
                    }}
                    onClick={() => handleOpen(location.mapId)}
                  >
                    <div className="userPin">
                      <i className="fa fa-user"></i>
                    </div>
                  </AdvancedMarker>
                  {open === location.mapId && (
                    <InfoWindow
                      position={{
                        lat: location.mapLat,
                        lng: location.mapLong,
                      }}
                      onCloseClick={() => handleOpen(null)}
                    >
                      <div className="userPopUp">
                        <h1>{location.mapUserName}</h1>
                        <p>Location Set: {showTime(location.createTime)}</p>
                        <p>Status Message: {location.message}</p>
                      </div>
                    </InfoWindow>
                  )}
                </div>
              ))}
            {highLowLocations.highestPopulated && clusteredUsers.length > 0 && (
              <AdvancedMarker
                position={highLowLocations.highestPopulated}
                onClick={() => setClusterOpen((prev) => !prev)}
              >
                <div className="highestPopulatedMarker">
                  <i className="fa fa-users" />
                </div>
                {clusterOpen && (
                  <InfoWindow
                    position={highLowLocations.highestPopulated}
                    onCloseClick={() => setClusterOpen(false)}
                  >
                    <div className="userPopUp">
                      <h2>Clustered Users</h2>
                      {clusteredUsers.map((user) => (
                        <div>
                          {user.mapUserName} - {showTime(user.createTime)}
                        </div>
                      ))}
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            )}
            {highLowLocations.leastPopulated && (
              <AdvancedMarker
                position={highLowLocations.leastPopulated}
                onClick={() => setLowestPopulationOpen((prev) => !prev)}
              >
                <div className="leastPopulatedMarker">
                  <i className="fa fa-map-pin"></i>
                </div>
                {lowestPopulationOpen &&
                (
                  <InfoWindow
                    position={highLowLocations.leastPopulated}
                    onCloseClick={() => setLowestPopulationOpen(false)}
                  >
                    <div className="lowestPopUp">
                      <h2>Suggested Lowest Populated Area</h2>
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>
      </div>
      <MapClickModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
        locationPercentage={locationPercentage}
      />
      <BarChart counts={dayCounts} />

      <Footer />
    </>
  );
}

export default HomePage;
