import "@/styles/globals.css";
import { StateProvider } from "@/context/StateContext";
import Head from "next/head";
import reducer, { initialState } from "@/context/StateReducers";

export default function App({ Component, pageProps }){
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>HyFriend</title>
        <link rel="stylesheet" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  );
}
