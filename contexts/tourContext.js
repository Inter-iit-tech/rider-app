import { createContext, useState, useEffect, useCallback } from "react";

// Temporary import, remove when fetching logic is integrated
import orders from "../samples/orders";

// Returns the current tour instead of all the tours
const fetchTour = async () => {
  // TODO: fetching logic to get tours from the API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetching tours");
      resolve(orders);
    }, 3000);
  });
};

export const TourContext = createContext();

export const TourContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tour, setTour] = useState(null);

  // uses fetchTour, sets state to reflect latest tour info from DB
  const synchroniseTourData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTour = await fetchTour();
      setTour(fetchedTour);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    synchroniseTourData();
  }, []);

  const TourCtxValue = {
    tour,
    loading,
    error,
    synchroniseTourData,
  };

  return (
    <TourContext.Provider value={TourCtxValue}>{children}</TourContext.Provider>
  );
};
