import axios from "axios";

export const isAuthenticated = () => {
  return sessionStorage.getItem("token") !== null;
};

export const login = async (Email, Password) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "login",
      { Email, Password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { jwtToken } = response.data.data;

    sessionStorage.setItem("token", jwtToken);

    return jwtToken;
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error("Failed to login. Please check your credentials.");
  }
};

export const logout = () => {
  sessionStorage.removeItem("token");
};

export const getjwtToken = () => {
  return sessionStorage.getItem("token");
};

export const setjwtToken = (token) => {
  sessionStorage.setItem("token", token);
};

export const removejwtToken = () => {
  sessionStorage.removeItem("token");
};
