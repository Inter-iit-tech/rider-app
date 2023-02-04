import { useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { Button, FAB, Icon } from "@rneui/base";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polyline,
} from "react-native-maps";
import axios from "axios";

import useTourContext from "../hooks/useTourContext";
import { BangaloreCoordinates } from "../utils/constants";
import { generateOSRMUri, getPolylineCoordinates } from "../utils/routeUtils";
import MapSimulator from "../components/MapSimulator";

const MapSimulation = () => {
  const { tour, loading, error, synchroniseTourData } = useTourContext();

  const [tourPath, setTourPath] = useState([]);
  const [loadingPath, setLoadingPath] = useState(false);
  const [simulationPaths, setSimulationPaths] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState({
    currentIndex: -1,
    currentPath: [],
  });
  const [startSimulation, setStartSimulation] = useState(false);

  const getTourPath = async (tour) => {
    setLoadingPath(true);
    const OSRMUri = generateOSRMUri(tour);
    const routeResponse = await axios.get(OSRMUri);
    const encodedPolyline = routeResponse?.data?.routes?.[0]?.geometry;
    const polylineCoordinates = getPolylineCoordinates(encodedPolyline);
    setTourPath(polylineCoordinates);
    setLoadingPath(false);
  };

  const getSimulationPaths = async (tour) => {
    setLoadingPath(true);
    const pairedOrders = [];

    for (let i = 0; i < tour.length - 1; i++) {
      pairedOrders.push([tour[i], tour[i + 1]]);
    }

    await Promise.all(
      pairedOrders.map(async (pair) => {
        const OSRMUri = generateOSRMUri(pair);
        const res = await axios.get(OSRMUri);
        const encodedPolyline = res?.data?.routes?.[0]?.geometry;
        const polylineCoordinates = getPolylineCoordinates(encodedPolyline);
        pair.push(polylineCoordinates);
      })
    );

    const simPaths = pairedOrders.map((pair) => pair[2]);
    setSimulationPaths(simPaths);
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

  const depot = tour[0];

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        rotateEnabled
        customMapStyle={mapStandardStyle}
        initialRegion={BangaloreCoordinates}
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

        {!loading && tourPath?.length > 0 ? (
          <Polyline
            coordinates={tourPath}
            strokeWidth={6}
            strokeColor="#4a89f3"
            tappable
            linecap="butt"
          />
        ) : null}

        {startSimulation && simulationPaths.length > 0 ? (
          <MapSimulator paths={simulationPaths} />
        ) : null}
      </MapView>

      {!tourPath.length > 0 ? (
        <FAB
          placement="left"
          size="large"
          visible={true}
          color="blue"
          title="Get Tour Path"
          icon={{ name: "check", type: "entypo", color: "white" }}
          loading={loadingPath}
          onPress={async () => {
            getTourPath(tour);
          }}
        />
      ) : !simulationPaths.length > 0 ? (
        <FAB
          placement="right"
          size="large"
          visible={true}
          color="black"
          title="Prepare Simulation"
          icon={{ name: "check", type: "entypo", color: "white" }}
          onPress={async () => {
            getSimulationPaths(tour);
          }}
          loading={loadingPath}
        />
      ) : !startSimulation ? (
        <FAB
          placement="left"
          size="large"
          visible={true}
          color="blue"
          title="Start Simulation"
          icon={{ name: "check", type: "entypo", color: "white" }}
          onPress={async () => {
            setStartSimulation(true);
          }}
        />
      ) : null}
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
