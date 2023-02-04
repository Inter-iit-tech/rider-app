import React, { useEffect, useState } from "react";
import { Marker, Polyline } from "react-native-maps";

const MapSimulator = ({ paths }) => {
  const [currentPath, setCurrentPath] = useState(paths[0]);
  const [polylineArray, setPolylineArray] = useState([[paths[0][0]]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({});
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  const timer = () => {
    if (currentPath?.length > 0 && currentIndex < currentPath.length) {
      const newLocation = {
        latitude: currentPath[currentIndex].latitude,
        longitude: currentPath[currentIndex].longitude,
      };

      const prevLocation = currentLocation?.latitude
        ? currentLocation
        : currentPath[0];

      const nextLocation = newLocation;
      const newElement = [prevLocation, nextLocation];
      const newPolylineArray = [...polylineArray, newElement];

      setPolylineArray(newPolylineArray);
      setCurrentLocation(newLocation);
      setCurrentIndex((currentIndex) => currentIndex + 1);
    } else {
      console.log("Called Timer else");
      console.log({ currentPathIndex, l: paths.length });
      if (currentPathIndex + 1 < paths.length) {
        const newRoute = paths[currentPathIndex + 1];

        setCurrentPath(newRoute);
        const initialLocation = [[newRoute[0]]];
        setPolylineArray(initialLocation);
        setCurrentPathIndex((currentPathIndex) => currentPathIndex + 1);
        setCurrentIndex(0);

        setTimeout(() => {
          console.log("Order Delivered.....");
        }, 2000);
      } else {
        console.log("Called Timer else else");
      }
    }
  };

  useEffect(() => {
    setTimeout(timer, 2);
  }, [currentIndex]);

  return (
    <>
      {currentLocation?.latitude &&
      currentLocation?.longitude &&
      currentPath?.length > 0 ? (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="My location"
          pinColor="#ADD8E6"
        ></Marker>
      ) : null}

      {polylineArray.map((r, i) => {
        return (
          <Polyline
            key={i}
            coordinates={r}
            strokeColor="blue"
            strokeWidth={4}
          />
        );
      })}
    </>
  );
};

export default MapSimulator;
