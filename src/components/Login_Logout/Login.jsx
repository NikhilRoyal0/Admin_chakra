import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  useBreakpointValue,
  Center,
  Card,
} from "@chakra-ui/react";

export default function Login() {
  const showImage = useBreakpointValue({ base: false, md: true });

  return (
    <Center minH={"100vh"}>
      <Flex direction="row" align="center">
        <Card variant="outlined" maxW={"md"} boxShadow={"xl"} mb={showImage ? 8 : 0}>
          <Stack spacing={8} p={8}>
            <Heading fontSize={"2xl"} textAlign={"center"}>
              Sign in to your account
            </Heading>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.500"}>Forgot password?</Text>
              </Stack>
              <Button colorScheme={"blue"} variant={"solid"} w={"full"}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Card>
        {showImage && (
          <Flex justify="center">
            <Image
              alt={"Login Image"}
              objectFit={"cover"}
              boxShadow={"xl"}
              height={390}
              src={
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
              }
            />
          </Flex>
        )}
      </Flex>
    </Center>
  );
}
