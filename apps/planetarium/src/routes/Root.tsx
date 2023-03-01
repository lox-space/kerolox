import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const keplerian =
  "keplerian?" +
  new URLSearchParams({
    semiMajor: "7210.008367",
    eccentricity: "0.0001807",
    inclination: "51.6428",
    ascendingNode: "279.6468",
    periapsisArg: "68.3174",
    trueAnomaly: "-68.2025",
  });

const Root = () => {
  return (
    <Flex direction="column" alignItems="center" p={4}>
      <Heading as="h1" pb={4}>
        OpenAstrodynamics Planetarium
      </Heading>
      <SimpleGrid columns={2} spacing={10}>
        <Card as={Link} to={keplerian}>
          <CardHeader>Keplerian Elements</CardHeader>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

export default Root;
