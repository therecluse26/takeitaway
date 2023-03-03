import { Address } from "@prisma/client";
import React, { JSXElementConstructor, useEffect } from "react";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import {
  formatAddress,
  geocodeAddress,
} from "../../lib/services/AddressService";
import dynamic from "next/dynamic";
import { icon } from "leaflet";

let DefaultIcon = icon({
  iconUrl: "/leaflet-marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Center = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Center as JSXElementConstructor<any>
  )
);
const Text = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Text as JSXElementConstructor<any>)
);
const Loader = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Loader as JSXElementConstructor<any>
  )
);
const Stack = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Stack as JSXElementConstructor<any>)
);
const Space = dynamic(() =>
  import("@mantine/core").then((mod) => mod.Space as JSXElementConstructor<any>)
);

const MapPreview = ({
  address,
  visible,
  showAddress = true,
  showCoordinates = false,
  serviceRadius = null,
}: {
  address: Address;
  visible: boolean;
  showAddress?: boolean;
  showCoordinates?: boolean;
  serviceRadius?: number | null;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom] = useState(9);
  const [latitude, setLatitude] = useState(address.latitude);
  const [longitude, setLongitude] = useState(address.longitude);
  const mapRef = React.useRef(null);

  const updateAddressGeolocation = async (addr: Address) => {
    setLoading(true);
    const data = await geocodeAddress(addr);
    if (data.latitude) {
      setLatitude(data.latitude);
    }
    if (data.longitude) {
      setLongitude(data.longitude);
    }
    setLoading(false);
    return data;
  };

  // This is a workaround for a bug in react-leaflet that causes the map to
  // not render properly when it is initially hidden.
  function SizeInvalidator({ visible }: { visible: boolean }) {
    const map = useMap();
    if (visible) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return null;
  }

  useEffect(() => {
    if (!latitude || !longitude) {
      updateAddressGeolocation(address).catch((err) => {
        alert(err.message);
      });
    }
  }, [latitude, longitude, address]);

  return (
    <>
      {loading === true ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          <Center>
            {latitude && longitude ? (
              <>
                <MapContainer
                  ref={mapRef}
                  center={[latitude, longitude]}
                  zoom={zoom}
                  style={{ height: "400px", width: "600px" }}
                >
                  <SizeInvalidator visible={visible} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[latitude, longitude]} icon={DefaultIcon} />
                  {serviceRadius && (
                    <Circle
                      center={[latitude, longitude]}
                      pathOptions={{ color: "blue" }}
                      radius={serviceRadius * 1609.34} // convert miles to meters
                    />
                  )}
                </MapContainer>
              </>
            ) : (
              <Text>No location found</Text>
            )}
          </Center>
          <Center>
            <Stack>
              <Space />
              {showAddress && <Text>{formatAddress(address)}</Text>}
              <Space />
              {showCoordinates && latitude && longitude && (
                <Text>
                  {latitude}, {longitude}
                </Text>
              )}
            </Stack>
          </Center>
        </>
      )}
    </>
  );
};

export default React.memo(MapPreview);
