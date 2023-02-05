import { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { Button, Icon } from "@rneui/base";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from "react-native-maps";
import axios from "axios";

import useTourContext from "../hooks/useTourContext";
import { BangaloreCoordinates, IITBBSCoordinates } from "../utils/constants";
import { generateOSRMUri, getPolylineCoordinates } from "../utils/routeUtils";

const MapSimulation = () => {
  const { tour, loading, error, synchroniseTourData } = useTourContext();

  const [tourPath, setTourPath] = useState([]);
  const [loadingPath, setLoadingPath] = useState(false);

  const getTourPath = async (tour) => {
    setLoadingPath(true);
    const OSRMUri = generateOSRMUri(tour);
    const routeResponse = await axios.get(OSRMUri);
    const encodedPolyline = routeResponse?.data?.routes?.[0]?.geometry;
    const polylineCoordinates = getPolylineCoordinates(encodedPolyline);
    setTourPath(polylineCoordinates);
    setLoadingPath(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.centeredText}>Getting tour details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.centeredText}>Something went wrong</Text>
        <Button
          iconPosition="left"
          icon={
            <Icon
              name="refresh"
              type="material"
              color="rgb(63, 154, 221)"
              size={20}
            />
          }
          title="Try Again"
          type="clear"
          radius="sm"
          size="md"
          titleStyle={{ fontSize: 14, paddingLeft: 3 }}
          onPress={synchroniseTourData}
        />
      </View>
    );
  }

  useEffect(() => {
    getTourPath(tour);
  }, []);

  const depot = tour[0];

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        rotateEnabled
        customMapStyle={mapStandardStyle}
        initialRegion={IITBBSCoordinates}
      >
        <Marker
          // Depot Location
          coordinate={{
            latitude: depot.location.lat,
            longitude: depot.location.lng,
          }}
          title="Hub Location"
          description="This is the Hub"
          pinColor="#39E75F"
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>{depot.names}</Text>
                <Text>{depot.address}</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>

        {tour.map((order, i) => {
          if (order.address !== "Depot Location")
            // Check for rendering Depot location differently
            return (
              <Marker
                key={order.AWB}
                identifier={String(order.AWB)}
                coordinate={{
                  latitude: order.location.lat,
                  longitude: order.location.lng,
                }}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text style={styles.name}>
                        {i} {order.names}
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

        {!loadingPath && tourPath?.length > 0 ? (
          <Polyline
            coordinates={tourPath}
            strokeWidth={6}
            strokeColor="#4a89f3"
            tappable
            linecap="butt"
          />
        ) : null}
      </MapView>
      {loading && <Text>Loading...</Text>}
    </>
  );
};

export default MapSimulation;

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
  list: {
    paddingHorizontal: 10,
    paddingTop: 15,
    backgroundColor: "white",
  },
  footerPadView: {
    height: 90,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    paddingVertical: 10,
  },
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
});
