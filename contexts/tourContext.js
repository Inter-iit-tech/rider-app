import { createContext, useState, useEffect, useCallback } from "react";
import axios from "../utils/axios/request";
import useAuthContext from "../hooks/useAuthContext";

// Temporary import, remove when fetching logic is integrated
// import orders from "../samples/orders";
// Temporary import, for testing purposes
import testRider from "../samples/riderProfile";

// Returns the current tour instead of all the tours
const fetchTour = async (riderId) => {
  console.log("Called fetchTours");
  // TODO: fetching logic to get tours from the API
  const url = `/api/v1/rider/${riderId}`;
  console.log({ url });
  const res = await axios.get(url);
  const currentTour = res?.data?.rider?.tours[0];
  const formattedTour = currentTour.map((t) => t.orderId);
  return formattedTour;

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.log("Fetching tour");

  //     const currentTour = testRider.tours[0];
  //     const formattedTour = currentTour.map((t) => t.orderId);
  //     console.log({ formattedTour });
  //     resolve(formattedTour);
  //   }, 100);
  // });
};

export const TourContext = createContext();

export const TourContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tour, setTour] = useState(null);
  const { user } = useAuthContext();

  // uses fetchTour, sets state to reflect latest tour info from DB
  const synchroniseTourData = useCallback(async () => {
    console.log("Called synchroniseTourData");
    setLoading(true);
    try {
      const fetchedTour = await fetchTour(user?._id);
      setTour(fetchedTour);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  const updateTour = () => {
    const updatedTour = [...tour];
    updatedTour.splice(0, 1);

    setTour(updatedTour);
  };

  useEffect(() => {
    synchroniseTourData();
  }, []);

  const TourCtxValue = {
    tour,
    loading,
    error,
    synchroniseTourData,
    updateTour,
  };

  return (
    <TourContext.Provider value={TourCtxValue}>{children}</TourContext.Provider>
  );
};
