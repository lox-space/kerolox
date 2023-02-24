import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Root = () => {
  return (
    <Flex direction="column" alignItems="center" p={4}>
      <Heading as="h1" pb={4}>
        OpenAstrodynamics Planetarium
      </Heading>
      <SimpleGrid columns={2} spacing={10}>
        <Card as={Link} to="keplerian">
          <CardHeader>Keplerian Elements</CardHeader>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

export default Root;
