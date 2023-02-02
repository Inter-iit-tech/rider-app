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
import testRider from "../samples/riderProfile";

const MapTestScreen = () => {
  const [route, setRoute] = useState([]);
  const [route1, setRoute1] = useState([]);
  const [orders, setOrders] = useState(importedOrders);
  const [tours, setTours] = useState(testRider.tours);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const locations = tours[0].map((order) => {
      return {
        lat: order.orderId.location.lat,
        lng: order.orderId.location.lng,
      };
    });
    const locations1 = tours[1].map((order) => {
      return {
        lat: order.orderId.location.lat,
        lng: order.orderId.location.lng,
      };
    });

    const OSRMUri = generateOSRMUri(locations);
    const OSRMUri1 = generateOSRMUri(locations1);

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

    axios
      .get(OSRMUri1)
      .then((routeResponse) => {
        let result = [];

        const encodedPolyline = routeResponse?.data?.routes?.[0]?.geometry;
        const polylineCoordinates = getPolylineCoordinates(encodedPolyline);
        result = polylineCoordinates;

        console.log({ result });
        setRoute1(result);
        setLoading1(false);
      })
      .catch((err) => {
        console.error(err);
        setRoute1([]);
        setLoading1(false);
      });
  }, []);

  return (
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      rotateEnabled={false}
      customMapStyle={mapStandardStyle}
      initialRegion={BangaloreCoordinates}
      showsUserLocation
    >
      <Marker
        coordinate={{
          latitude: tours[0][0].orderId.location.lat,
          longitude: tours[0][0].orderId.location.lng,
        }}
        pinColor="blue"
        title="depot"
        description="This is the test description"
      ></Marker>

      {tours[0].map((order, i) => {
        return i !== 0 && i !== tours[0].length - 1 ? (
          <Marker
            key={order.orderId.AWB}
            identifier={String(order.orderId.AWB)}
            coordinate={{
              latitude: order.orderId.location.lat,
              longitude: order.orderId.location.lng,
            }}
            title="Test Title"
            description="This is the test description"
          >
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>
                    {i + 1} {order.orderId.names}
                  </Text>
                  <Text>{order.orderId.address}</Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
        ) : null;
      })}

      {tours[1].map((order, i) => {
        return i !== 0 && i !== tours[1].length - 1 ? (
          <Marker
            key={order.orderId.AWB}
            identifier={String(order.orderId.AWB)}
            coordinate={{
              latitude: order.orderId.location.lat,
              longitude: order.orderId.location.lng,
            }}
            title="Test Title"
            description="This is the test description"
          >
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>
                    {i + 1} {order.orderId.names}
                  </Text>
                  <Text>{order.orderId.address}</Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
        ) : null;
      })}

      {!loading && route?.length > 0 ? (
        <Polyline coordinates={route} strokeWidth={3} />
      ) : null}

      {!loading1 && route1?.length > 0 ? (
        <Polyline coordinates={route1} strokeWidth={3} strokeColor="blue" />
      ) : null}
    </MapView>
  );
};

export default MapTestScreen;

const BangaloreCoordinates = {
  latitude: 12.972442,
  longitude: 77.580643,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

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
const styles = StyleSheet.create({
  map: {
    height: "80%",
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
