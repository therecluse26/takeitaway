import React, { JSXElementConstructor, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import dynamic from "next/dynamic";
import { latLng } from "leaflet";
import { ServiceScheduleRouteWithAddress } from "../../lib/services/api/ApiScheduleService";
import { ProviderWithAddress } from "../../lib/services/api/ApiProviderService";
import Routing from "./RouteMapRouting";

const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);

const Loader = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);

const RouteMap = ({
  routes,
  provider,
  mapHeight = "600px",
  mapWidth = "1000px",
  mapZoom = 13,
}: {
  routes: ServiceScheduleRouteWithAddress[];
  provider: ProviderWithAddress;
  serviceRadius?: number | null;
  mapHeight?: string;
  mapWidth?: string;
  mapZoom?: number;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom] = useState(mapZoom);

  return (
    <>
      {loading === true ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          <Center>
            <>
              <MapContainer
                zoom={zoom}
                center={latLng(
                  provider.address?.latitude ?? -90.0,
                  provider.address?.longitude ?? 0.0
                )}
                style={{
                  maxHeight: mapHeight,
                  maxWidth: mapWidth,
                  minHeight: "700px",
                  minWidth: "300px",
                  height: "1000px",
                  width: "100%",
                  zIndex: 0,
                }}
              >
                {/* <SizeInvalidator visible={visible} /> */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Routing routes={routes} provider={provider} />
              </MapContainer>
            </>
          </Center>
        </>
      )}
    </>
  );
};

export default React.memo(RouteMap);
