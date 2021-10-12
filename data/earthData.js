import axios from "axios";

export const func = () => {
  return axios.get(
    "https://api.openweathermap.org/data/2.5/weather?q=hongkong&units=metric&appid=698e05de3e23c1a963d8ac47a65af507",
  );
};
