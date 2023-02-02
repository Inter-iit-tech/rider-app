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

  const getRouteBetweenTwoOrders = (orders) => {
    console.log("Called getRouteBetweenTwoOrders");

    const dummy = orders;
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
  };

  useEffect(() => {
    const locOrders = testRider.tours[0].map((orders) => {
      return orders.orderId;
    });
    setOrders(locOrders);

    const OSRMUri = generateOSRMUri(locOrders);
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

        const o1 = {
          location: { lat: 12.95631342324543, lng: 77.69552272670654 },
        };
        const o2 = {
          location: { lat: 12.956442391181712, lng: 77.69609795192866 },
        };

        const o3 = {
          location: { lat: 12.956909126656685, lng: 77.69927838636734 },
        };
        const o4 = {
          location: { lat: 12.956989867581566, lng: 77.70299159014927 },
        };

        const o5 = {
          location: { lat: 12.956376345849106, lng: 77.70537417172703 },
        };
        const o6 = {
          location: { lat: 12.9562198811429, lng: 77.70862331171095 },
        };

        const o7 = {
          location: { lat: 12.955588885065232, lng: 77.70095405992546 },
        };

        const o8 = {
          location: { lat: 12.950098261419818, lng: 77.69985402407599 },
        };

        const o9 = {
          location: { lat: 12.956094618924002, lng: 77.69391819331283 },
        };

        const o10 = {
          location: { lat: 12.95622074081024, lng: 77.69492603332334 },
        };

        const o11 = {
          location: { lat: 12.956197904510958, lng: 77.69468372922866 },
        };

        getRouteBetweenTwoOrders([o11, o10, o9]);
        // getRouteBetweenTwoOrders(locOrders[0], locOrders[1]);
      })
      .catch((err) => {
        console.error(err);
        setRoute([]);
        setLoading(false);
      });
  }, []);

  const timer = () => {
    console.log("Called timer out " + currentIndex);
    // console.log({ currentIndex });
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
        : testRoute[0];
      const nextLocation = newLocation;
      const newPoly = [firstLocation, nextLocation];
      const newTR = [...testRoute, newPoly];

      setTestRoute(newTR);
      setCurrentLocation(newLocation);
      setCurrentIndex((currentIndex) => currentIndex + 1);
    }
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
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
      <Marker
        coordinate={{
          latitude: orders[0].location.lat,
          longitude: orders[0].location.lng,
        }}
        title="Hub Location"
        description="This is the Hub"
        pinColor="#39E75F"
      >
        <Callout tooltip>
          <View>
            <View style={styles.bubble}>
              <Text style={styles.name}>{orders[0].names}</Text>
              <Text>{orders[0].address}</Text>
            </View>
            <View style={styles.arrowBorder} />
            <View style={styles.arrow} />
          </View>
        </Callout>
      </Marker>

      {/* {orders.map((order, i) => {
        if (i !== 0) {
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
        }
      })} */}

      {/* {testRider.tours[0].map((order, i) => {
        if (i !== 0) {
          return (
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
          );
        }
      })} */}

      {!loading && route?.length > 0 ? (
        <Polyline
          coordinates={route}
          strokeWidth={6}
          strokeColor="#4a89f3"
          tappable
          linecap="butt"
        />
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

      {!loading &&
        testRoute.length > 0 &&
        testRoute.map((r, i) => {
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
