import "../Home/css/HomePage.css";
import Header from "../Header";
import SetLocation from "./SetLocation";
import BarChart from "./BarChart";
import MapClickModal from "./MapClickModal";
import LoadingState from "../LoadingState";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = (mapId) => {
    setOpen((prev) => (prev === mapId ? null : mapId));
  };

  const getLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/getLocations", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setAllLocations(data);
    } catch (error) {
      console.error("Error: Fetching locations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHighLowLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/gridCluster", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      sethighLowLocations(data);
    } catch (error) {
      console.error("Error: Fetching high and low locations", error);
    } finally {
      setIsLoading(false);
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
    const cells = highLowLocations?.biggestCluster?.cells;
    if (!cells || cells.length === 0) return false;

    return cells.some((cell) => {
      const bounds = cell.bounds;
      return (
        lat >= bounds.minLat &&
        lat <= bounds.maxLat &&
        lng >= bounds.minLng &&
        lng <= bounds.maxLng
      );
    });
  };

  const clusteredUsers = allLocations.filter((loc) =>
    isInsideCluster(loc.mapLat, loc.mapLong),
  );
  const groupedUserMarkers = highLowLocations.groupedMarkers || [];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <Header userName={userName} />
      <div className="homePageWelcome">Welcome Back, {userName}</div>

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
            {groupedUserMarkers.map((group, index) => (
              <div className="activeUserMarkers">
                <AdvancedMarker
                  position={{ lat: group.lat, lng: group.lng }}
                  onClick={() => handleOpen(index)}
                >
                  <div className="userPin">
                    <i
                      className={`fa ${
                        group.users.length > 1 ? "fa-users" : "fa-user"
                      }`}
                    />
                  </div>
                </AdvancedMarker>
                {open === index && (
                  <InfoWindow
                    position={{ lat: group.lat, lng: group.lng }}
                    onCloseClick={() => handleOpen(null)}
                  >
                    <div className="userPopUp">
                      {group.users.map((user) => (
                        <div>
                          <h1>{user.mapUserName}</h1>
                          <p>Location Set: {showTime(user.createTime)}</p>
                          <p>Status Message: {user.message}</p>
                        </div>
                      ))}
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
                {lowestPopulationOpen && (
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
    </>
  );
}

export default HomePage;
