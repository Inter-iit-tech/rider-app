import { FAB } from "@rneui/base";
import { FlatList, StyleSheet, View } from "react-native";
import Order from "../components/Order";
import orders from "../samples/orders";

const Tour = () => {
  return (
    <>
      <FlatList
        style={styles.list}
        data={orders}
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
  },
  footerPadView: {
    height: 80,
  },
});
