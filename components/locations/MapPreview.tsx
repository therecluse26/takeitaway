import { Address } from "@prisma/client";
import React, { JSXElementConstructor, useEffect } from "react";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { geocodeAddress } from "../../lib/services/AddressService";
import dynamic from "next/dynamic";

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

const MapPreview = ({ address }: { address: Address }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom] = useState(12);
  const [latitude, setLatitude] = useState(address.latitude);
  const [longitude, setLongitude] = useState(address.longitude);

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

  useEffect(() => {
    if (!latitude || !longitude) {
      updateAddressGeolocation(address).catch((err) => {
        alert(err.message);
      });
    }
  }, [latitude, longitude, address]);

  return (
    <>
      <Center>
        {latitude && longitude ? (
          <MapContainer
            center={[latitude, longitude]}
            zoom={zoom}
            style={{ height: "400px", width: "600px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} />
          </MapContainer>
        ) : loading === true ? (
          <Loader />
        ) : (
          <h3>Unable to load map</h3>
        )}
      </Center>
      <Center>
        <Stack>
          <Space />
          <Text>
            {latitude ?? "?"}, {longitude ?? "?"}
          </Text>
        </Stack>
      </Center>
    </>
  );
};

export default React.memo(MapPreview);
