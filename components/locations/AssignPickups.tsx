import { Title } from "@mantine/core";

export default function AssignPickups({
  maxPickups = 0,
}: {
  maxPickups?: number;
}) {
  return <Title>Max Pickups - {maxPickups}</Title>;
}
