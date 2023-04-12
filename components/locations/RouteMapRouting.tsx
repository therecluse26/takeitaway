import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import { ServiceScheduleRouteWithAddress } from "../../lib/services/api/ApiScheduleService";
import { ProviderWithAddress } from "../../lib/services/api/ApiProviderService";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});
export default function Routing({
  routes,
  provider,
}: {
  routes: ServiceScheduleRouteWithAddress[];
  provider: ProviderWithAddress;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let routingOptions = {
      waypoints: [
        L.latLng(
          provider?.address?.latitude ?? -90.0,
          provider?.address?.longitude ?? 0.0
        ),
        ...routes
          .filter((route) => {
            return route?.address?.latitude && route?.address?.longitude;
          })
          .map((route) => {
            return L.latLng(
              route.address.latitude ?? -90.0,
              route.address.longitude ?? 0.0
            );
          }),
      ],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 100,
      },
      routeWhileDragging: true,
      show: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: true,
    };

    L.Routing.control(routingOptions).addTo(map);

    // map.removeControl(routingControl);
  }, [map]);

  return null;
}
