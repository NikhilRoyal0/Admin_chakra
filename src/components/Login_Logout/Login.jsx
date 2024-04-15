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
  IconButton,
} from "@chakra-ui/react";
import { login, isAuthenticated } from "../../utils/Auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

export default function Login() {
  const showImage = useBreakpointValue({ base: false, md: true });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await login(email, password);
      if (token) {
        navigate("/");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Center minH={"100vh"}>
      <Flex direction="row" align="center">
        <Card
          variant="outlined"
          maxW={"lg"}
          boxShadow={"xl"}
          mb={showImage ? 8 : 0}
        >
          <Stack spacing={8} p={8}>
            <Heading fontSize={"2xl"} textAlign={"center"}>
              Sign in to your account
            </Heading>
            {error && (
              <Text color={"red.500"} textAlign={"center"}>
                {error}
              </Text>
            )}
            <form onSubmit={handleSubmit}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Flex>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  />
                </Flex>
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Text color={"blue.500"}>Forgot Password?</Text>
                </Stack>
                <Button
                  type="submit"
                  colorScheme={"blue"}
                  variant={"solid"}
                  w={"full"}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>
        {showImage && (
          <Flex justify="center">
            <Image
              alt={"Login Image"}
              objectFit={"cover"}
              boxShadow={"xl"}
              height={330}
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
