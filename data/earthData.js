import axios from "axios";

export const current = (city) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f0cb8f4406373b8daccb9354815c6b8f`,
  );
};

export const forecast = (city) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=f0cb8f4406373b8daccb9354815c6b8f`,
  );
};

export const urban = (city) => {
  return axios.get(`https://api.teleport.org/api/cities/?search=${city}`);
};
