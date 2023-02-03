import { useContext } from "react";
import { TourContext } from "../contexts/tourContext";

const useTourContext = () => {
  const tourContext = useContext(TourContext);

  return tourContext;
};

export default useTourContext;
