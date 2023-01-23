import polyline from "@mapbox/polyline";

export const generateOSRMUri = (orders) => {
  const baseURL = "http://router.project-osrm.org";
  const endPoint = "route/v1/driving";

  const queryParams = {
    overview: "full",
    geometries: "polyline6",
    annotations: true,
  };

  //query-params
  let queryParamsString = "";

  for (const param in queryParams) {
    queryParamsString = queryParamsString.concat(
      `${param}=${queryParams[param]}&`
    );
  }

  queryParamsString = queryParamsString.slice(0, -1);

  //coordinates
  let coordinateString = "";

  orders.forEach((order) => {
    coordinateString = coordinateString.concat(
      `${order.location.lng},${order.location.lat};`
    );
  });

  coordinateString = coordinateString.slice(0, -1);

  const Uri = `${baseURL}/${endPoint}/${coordinateString}?${queryParamsString}`;

  console.log({ Uri });
  return Uri;
};

export const getPolylineCoordinates = (encodedPolyline) => {
  const decoded = polyline.decode(encodedPolyline, 6);

  const formattedPolyline = decoded.map((c) => {
    return { latitude: c[0], longitude: c[1] };
  });

  return formattedPolyline;
};
