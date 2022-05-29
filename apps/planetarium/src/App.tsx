import { Box } from "@chakra-ui/react";
import Planetarium from "@openastrodynamics/r3f";
import "./App.css";

function App() {
  return (
    <Box className="App" h="100vh" w="100vw">
      <Planetarium />
    </Box>
  );
}

export default App;
