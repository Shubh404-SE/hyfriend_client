/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUNLIC_ZEGO_APP_ID: 530545002,
    NEXT_PUNLIC_ZEGO_SERVER_ID:"bf3de27e6a0e37c0ac3468e25a5450f7"
  },
  images: {
    domains: ['lh3.googleusercontent.com', "localhost"],
  },
};

module.exports = nextConfig;
