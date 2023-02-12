import { Address } from "@prisma/client";
import React, { JSXElementConstructor, useEffect } from "react";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { geocodeAddress } from "../../lib/services/AddressService";
import dynamic from "next/dynamic";
import { icon } from "leaflet";

let DefaultIcon = icon({
  iconUrl: "/leaflet-marker-icon.png",
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
}: {
  address: Address;
  visible: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom] = useState(12);
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
                </MapContainer>
              </>
            ) : (
              <Text>No location found</Text>
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
      )}
    </>
  );
};

export default React.memo(MapPreview);
