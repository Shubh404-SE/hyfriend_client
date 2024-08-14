import React, { useEffect, useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
  const contextRef = useRef(null);

  // to hide context menu on click outside 
  useEffect(()=>{
    const handleOutSideClick =(e)=>{
        if(e.target.id !== "context_opener"){
          if(contextRef.current && !contextRef.current.contains(e.target))
          setContextMenu(false);
        }
    }
    document.addEventListener("click", handleOutSideClick)
  }, [])
  const handleClick = (e, callback) => { 
    e.stopPropagation();
    setContextMenu(false);
    callback();
  }

  return (
    <div
      className={`bg-dropdown-background shadow-sm mt-2 py-2 z-[200000] ${cordinates ? "fixed top-[${cordinates.y}] left-[${cordinates.x}]":"absolute top-full right-0"}`}
      ref={contextRef}
      // style={{top:cordinates.y, left:cordinates.x}}
    >
      <ul>
        {
          options.map(({name, callback})=>(
            <li key={name} onClick={(e)=>handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
            >
              <span className=" text-white">{name}</span>
            </li>
          ) )
        }
      </ul>
    </div>
  );
}

export default ContextMenu;
