import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Planetarium from "@openastrodynamics/r3f";

const Keplerian = () => {
  return (
    <Flex height="100%">
      <Flex direction="column" width="300px" p={4}>
        <Button as={Link} to="/">
          Back
        </Button>
      </Flex>
      {/*<Planetarium />*/}
    </Flex>
  );
};

export default Keplerian;
