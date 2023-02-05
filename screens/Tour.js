import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { Button, FAB, Icon } from "@rneui/base";

import Order from "../components/Order";
import useTourContext from "../hooks/useTourContext";
import useAuthContext from "../hooks/useAuthContext";

import * as Location from "expo-location";

import axios from "../utils/axios/request";
import { depotProduct } from "../utils/constants";

const Tour = () => {
  const { tour, loading, error, synchroniseTourData, updateTour } =
    useTourContext();

  const { user } = useAuthContext();

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log({ status });

    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    return location;
  };

  const markOrderStatus = async (status) => {
    console.log(tour[0]);
    console.log({ user });

    const riderID = user?._id || "63da31fb4841bae76cccfd8a";
    const orderID = tour?.[0]?._id;
    const location = tour?.[0]?.location;

    let { coords } = await fetchLocation();

    axios
      .post(`/api/v1/rider/${riderID}/order-status/${orderID}`, {
        order: {
          status,
          location,
          riderLocation: { lat: coords?.latitude, lng: coords?.longitude },
        },
      })
      .then((res) => {
        console.log(res.data);
        updateTour();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startTour = () => {
    markOrderStatus(true);
  };

  const endTour = () => {
    markOrderStatus(true);
    synchroniseTourData();
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.centeredText}>Getting order details...</Text>
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

  if (tour?.length === 0) return <></>;

  return (
    <>
      <FlatList
        style={styles.list}
        data={tour}
        renderItem={({ index, item }) => {
          return (
            <Order
              name={item.names}
              address={item.address}
              awb={item.AWB}
              productID={item.product}
              highlighted={index === 0}
            />
          );
        }}
        keyExtractor={(order) => order.AWB}
        ListFooterComponent={View}
        ListFooterComponentStyle={styles.footerPadView}
      />
      {tour?.[0]?.product !== depotProduct ? (
        <>
          <FAB
            placement="left"
            size="large"
            visible={true}
            color="tomato"
            title="Skip Order"
            icon={{ name: "cross", type: "entypo", color: "white" }}
            onPress={async () => await markOrderStatus(false)}
          />
          <FAB
            placement="right"
            size="large"
            visible={true}
            color="limegreen"
            title="Next Order"
            icon={{ name: "check", type: "entypo", color: "white" }}
            onPress={async () => await markOrderStatus(true)}
          />
        </>
      ) : tour?.length !== 1 ? (
        <FAB
          size="large"
          color="limegreen"
          title="Start Tour"
          onPress={startTour}
        />
      ) : (
        <FAB size="large" color="tomato" title="End Tour" onPress={endTour} />
      )}
    </>
  );
};

export default Tour;

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
});
