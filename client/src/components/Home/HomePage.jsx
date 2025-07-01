import "../Home/css/HomePage.css";
import Header from "../Header";
import Footer from "../Footer";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

function HomePage({ userName }) {
  const apiKey = import.meta.env.VITE_GOOGLE_API;
  const apiMapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  const defaultPosition = { lat: 37.48026943463089, lng: -122.15979710343754 };
  const [allLocations, setAllLocations] = useState([]);

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

  const addLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData = {
          mapUserName: userName,
          mapLong: position.coords.longitude,
          mapLat: position.coords.latitude,
          message: "TEST",
        };

        try {
            fetch("http://localhost:3000/setLocation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locationData),
            credentials: "include",
          });

          getLocations()
        } catch (error) {
          console.error("Error: Adding location on the front end", error);
        }
      }
    )
  }

  useEffect(() => {
    getLocations()
  }, []);


  const currentHour = new Date().getHours();
  let greetingMessage;

  if (currentHour >4 && currentHour < 12) {
    greetingMessage = "Good Morning, ";
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingMessage = "Good Afternoon, ";
  } else {
    greetingMessage = "Good Evening, ";
  }
  
  return (
    <>
      <Header userName={userName} />
      <div className="homePageWelcome">{greetingMessage}{userName}</div>

      <div className="setLocationButton">
        <button onClick={addLocation}>Set Location</button>
      </div>

      <div className="mapContainer">
        <APIProvider apiKey={apiKey}>
          <div className="heatMap">
            <Map
              zoom={16}
              center={defaultPosition}
              mapId={apiMapId}
            >
              {allLocations &&
                allLocations.map((location) => (
                  <AdvancedMarker
                    key={location.mapId}
                    position={{
                      lat: location.mapLat,
                      lng: location.mapLong,
                    }}
                  >
                    <Pin
                      background={"orange"}
                      borderColor={"red"}
                      glyphColor={"red"}
                    />
                  </AdvancedMarker>
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
