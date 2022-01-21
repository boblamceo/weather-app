import axios from "axios";

export const data = () => {
  return axios.get(
    "https://mars.nasa.gov/rss/api/?feed=weather&category=insight_temperature&feedtype=json&ver=1.0",
  );
};

export const images = () => {
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${
    today.getDate() - 2
  }`;
  return axios.get(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?earth_date=${date}&api_key=48fssnX3XYcLvoRAEJIv2X9aVk8d19G6hz0U4mhc`,
  );
};
