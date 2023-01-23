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

const MapTestScreen = () => {
  const [route, setRoute] = useState([]);
  const [orders, setOrders] = useState(importedOrders);
  const [loading, setLoading] = useState(true);

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
        visibility: "off",
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
