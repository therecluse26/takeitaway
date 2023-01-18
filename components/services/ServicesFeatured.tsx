import {
  Container,
  Title,
  Text,
  Group,
  Card,
  Center,
  Button,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Service } from "@prisma/client";
import { useEffect, useState } from "react";
import { pageMessages } from "../../data/messaging";
import { getFeaturedServices } from "../../lib/services/ServiceService";
import { formatAmountForDisplay } from "../../lib/utils/stripe-helpers";
import { IconHome, IconTrash } from "@tabler/icons";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card radius={0} style={{ width: 350 }}>
      <Card.Section>
        <Image
          src={service.productPhoto}
          height={350}
          width={350}
          alt="Service"
        />
      </Card.Section>

      <Center>
        <Text size="md" color="dimmed" m="md" fw={700}>
          {service.name} per month
          <br />
          {formatAmountForDisplay(service.price)} / month
        </Text>

        <br />
      </Center>
      <Button variant="filled" color="blue" fullWidth mt="md" radius="md">
        <IconTrash />
        Subscribe Now
      </Button>
    </Card>
  );
};

export default function ServicesFeatured() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getFeaturedServices().then((services) => {
      setServices(services);
    });
  }, []);

  return (
    <Container size={"lg"}>
      <Group position="center">
        <Title>{pageMessages.featuredServices.title}</Title>
        <Text color="dimmed">{pageMessages.featuredServices.message}</Text>
      </Group>

      {services?.length > 0 ? (
        <Group position="center" mt="lg">
          {services?.map((service) => {
            return <ServiceCard service={service} key={service.id} />;
          })}
        </Group>
      ) : (
        <div>No featured services</div>
      )}

      <Center m="lg">
        <Text weight={700} color="dimmed">
          {pageMessages.featuredServices.subText}
        </Text>
      </Center>
      <Center>
        <Button
          component={Link}
          href="/products"
          variant="filled"
          color="blue"
          mt="md"
          radius="md"
          size="lg"
        >
          <IconHome />
          View More
        </Button>
      </Center>
    </Container>
  );
}
