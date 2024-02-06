import React, { useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
  const contextRef = useRef(null);
  const handleClick = (e, callback) => { 

  }

  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] top-[${cordinates.y}] left-[${cordinates.x}] shadow-sm`}
      ref={contextRef}
      style={{top:cordinates.y, left:cordinates.x}}
    >
      <ul>
        {
          options.map(({name, callback})=>(
            <li key={name} onClick={()=>handleClick(e, callback)}
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
