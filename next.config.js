/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUNLIC_ZEGO_APP_ID: 530545002,
    NEXT_PUNLIC_ZEGO_SERVER_ID:"bf3de27e6a0e37c0ac3468e25a5450f7",
    NEXT_PUNLIC_GEMINI_AI_ID:"AIzaSyCXrJ4-BPsl1P7mWu_v-EulBXcUmKmEXvM"
  },
  images: {
    domains: ['lh3.googleusercontent.com', "localhost"],
  },
};

module.exports = nextConfig;
