import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";

function Container({data}) {
  const [{socket, userInfo}, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);
  return <div>Container</div>;
}

export default Container;
