import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import { generateOSRMUri, getPolylineCoordinates } from "../utils/routeUtils";
import importedOrders from "../samples/orders";

const mapStandardStyle = [
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
];

const MapSimulationTestScreen = () => {
  const [route, setRoute] = useState([]);
  const [orders, setOrders] = useState(importedOrders);
  const [loading, setLoading] = useState(true);
  const [firstRoute, setFirstRoute] = useState([]);

  const [testRoute, setTestRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({});

  useEffect(() => {
    const OSRMUri = generateOSRMUri(orders);

    axios
      .get(OSRMUri)
      .then((routeResponse) => {
        let result = [];
        const encodedPolyline = routeResponse?.data?.routes?.[0]?.geometry;
        const polylineCoordinates = getPolylineCoordinates(encodedPolyline);

        result = polylineCoordinates;
        console.log({ result });
        setRoute(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRoute([]);
        setLoading(false);
      });

    const dummy = [orders[0], orders[1]];
    const uri = generateOSRMUri(dummy);

    axios
      .get(uri)
      .then((routeResponse) => {
        let result = [];
        const encodedPolyline = routeResponse?.data?.routes?.[0]?.geometry;
        const polylineCoordinates = getPolylineCoordinates(encodedPolyline);

        result = polylineCoordinates;
        console.log({ dummyResult: result, l: result.length });
        const initialLocation = [[result[0]]];
        setFirstRoute(result);
        setTestRoute(initialLocation);
      })
      .catch((err) => {
        console.error(err);
        setTestRoute([]);
      });
  }, []);

  const timer = () => {
    console.log("Called timer out");
    console.log({ firstRoute, l: firstRoute.length, currentIndex });
    if (
      firstRoute &&
      firstRoute.length > 0 &&
      currentIndex < firstRoute.length
    ) {
      console.log("Called timer in");
      const newLocation = {
        latitude: firstRoute[currentIndex].latitude,
        longitude: firstRoute[currentIndex].longitude,
      };

      const firstLocation = currentLocation?.latitude
        ? currentLocation
        : route[0];
      const nextLocation = newLocation;
      const newPoly = [firstLocation, nextLocation];
      const newTR = [...testRoute, newPoly];

      console.log({ newTR });
      setTestRoute(newTR);
      setCurrentLocation(newLocation);
      setCurrentIndex((currentIndex) => currentIndex + 1);
    }
  };

  useEffect(() => {
    const id = setInterval(timer, 100);
    return () => clearInterval(id);
  }, [currentIndex, firstRoute]);

  return (
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      rotateEnabled
      customMapStyle={mapStandardStyle}
      initialRegion={BangaloreCoordinates}
    >
      {orders.map((order, i) => {
        return (
          <Marker
            key={order.AWB}
            identifier={String(order.AWB)}
            coordinate={{
              latitude: order.location.lat,
              longitude: order.location.lng,
            }}
            title="Test Title"
            description="This is the test description"
          >
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>
                    {i + 1} {order.names}
                  </Text>
                  <Text>{order.address}</Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
        );
      })}

      {!loading && route?.length > 0 ? (
        <Polyline coordinates={route} strokeWidth={3} />
      ) : null}

      {!loading &&
      currentLocation?.latitude &&
      currentLocation?.longitude &&
      firstRoute?.length > 0 ? (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="My location"
          pinColor="#ADD8E6"
        ></Marker>
      ) : null}

      {testRoute.map((r, i) => {
        return (
          <Polyline
            key={i}
            coordinates={r}
            strokeColor="blue"
            strokeWidth={4}
          />
        );
      })}
    </MapView>
  );
};

export default MapSimulationTestScreen;

const BangaloreCoordinates = {
  latitude: 12.9063958,
  longitude: 77.5886106,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const styles = StyleSheet.create({
  map: {
    height: "80%",
    width: "100%",
    flex: 1,
  },
  // Callout bubble
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: "100%",
    height: 80,
  },
});
