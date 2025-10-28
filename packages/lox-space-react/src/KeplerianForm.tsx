import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";

export type KeplerianElements = {
  semiMajor: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  periapsisArg: number;
  trueAnomaly: number;
};

type KeplerianForm = {
  elements: KeplerianElements;
  setElements: (elements: KeplerianElements) => void;
};

function SliderInput() {
  const [value, setValue] = useState(0);
  const handleChange = (value: number) => setValue(value);

  return (
    <Flex>
      <NumberInput
        maxW="100px"
        mr="2rem"
        value={value}
        onChange={(str) => handleChange(parseFloat(str))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={value}
        onChange={handleChange}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" />
      </Slider>
    </Flex>
  );
}

const KeplerianForm = () => {
  return <></>;
};

export default KeplerianForm;
