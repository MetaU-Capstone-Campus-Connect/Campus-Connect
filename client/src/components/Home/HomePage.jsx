import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";
import SetLocation from "./SetLocation";
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
  //{ lat: 37.48026943463089, lng: -122.15979710343754 };
  //37.29325940807385, -121.9491001477052;
  const [allLocations, setAllLocations] = useState([]);
  const [open, setOpen] = useState(null);

  const handleOpen = (mapId) => {
    setOpen((prev) => (prev === mapId ? null : mapId));
  }

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
  }, []);

  const currentHour = new Date().getHours();
  let greetingMessage;

  if (currentHour > 4 && currentHour < 12) {
    greetingMessage = "Good Morning, ";
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingMessage = "Good Afternoon, ";
  } else {
    greetingMessage = "Good Evening, ";
  }

  return (
    <>
      <Header userName={userName} />
      <div className="homePageWelcome">
        {greetingMessage}
        {userName}
      </div>

      <div className="setLocationButton">
        <SetLocation userName={userName} getLocations={getLocations} />
      </div>

      <div className="mapContainer">
        <APIProvider apiKey={apiKey}>
          <div className="heatMap">
            <Map
              zoom={14}
              center={defaultPosition}
              mapId={apiMapId}
              zoomControl={true}
              gestureHandling="auto"
              disableDefaultUI={false}
            >
              {allLocations.map((location) => (
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
                      onClick={() => handleOpen(null)}
                    >
                      <div className="userPopUp">
                        <h1>{location.mapUserName}</h1>
                        <p>Location Set: {showTime(location.createTime)}</p>
                        <p>
                          Status Message: {location.message}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </div>
              ))}
            </Map>
          </div>
        </APIProvider>
      </div>

      <Footer />
    </>
  );
}

export default HomePage;
