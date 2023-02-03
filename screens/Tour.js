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

const Tour = () => {
  const { tour, loading, error, synchroniseTourData } = useTourContext();

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
              productID={item.product_id}
              highlighted={index === 0}
            />
          );
        }}
        keyExtractor={(order) => order.AWB}
        ListFooterComponent={View}
        ListFooterComponentStyle={styles.footerPadView}
      />
      <FAB
        placement="left"
        size="large"
        visible={true}
        color="tomato"
        title="Skip Order"
        icon={{ name: "cross", type: "entypo", color: "white" }}
      />
      <FAB
        placement="right"
        size="large"
        visible={true}
        color="limegreen"
        title="Next Order"
        icon={{ name: "check", type: "entypo", color: "white" }}
      />
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
