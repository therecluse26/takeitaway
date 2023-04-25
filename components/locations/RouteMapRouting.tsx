import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import { ServiceScheduleItemWithAddress } from "../../lib/services/api/ApiScheduleService";
import { ProviderWithAddress } from "../../lib/services/api/ApiProviderService";
import { MAPBOX_CONFIG } from "../../data/configuration";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});
export default function Routing({
  routes,
  provider,
}: {
  routes: ServiceScheduleItemWithAddress[];
  provider: ProviderWithAddress;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let routingOptions = {
      router: L.Routing.mapbox(MAPBOX_CONFIG.apiKey ?? "", {}),
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
      routeWhileDragging: false,
      show: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      draggableWaypoints: false,
      units: "imperial",
    };

    L.Routing.control(routingOptions).addTo(map);
  }, [map, provider?.address?.latitude, provider?.address?.longitude, routes]);

  return null;
}
