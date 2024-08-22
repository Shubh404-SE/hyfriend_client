import React, { useEffect, useRef } from "react";

const MessageMenu = ({ showMenu, message, setShowMenu, self, options }) => {
  const contextRef = useRef(null);

  // to hide context menu on click outside
  useEffect(() => {
    const handleOutSideClick = (e) => {
      if (e.target.id !== "context_opener") {
        if (contextRef.current && !contextRef.current.contains(e.target))
          setShowMenu(false);
      }
    };
    document.addEventListener("click", handleOutSideClick);
  }, []);
  useEffect(() => {
    contextRef?.current?.scrollIntoViewIfNeeded();
  }, [showMenu]);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setShowMenu(false);
    callback(message);
  };
  return (
    <>
      <div
        ref={contextRef}
        className={`w-[150px] absolute top-8 z-10 bg-dropdown-background shadow-sm my-2 rounded-md ${
          !self ? "right-0" : "-left-20"
        }`}
      >
        <ul className="flex flex-col py-2">
          {options.map((option, index) => {
            const { name, Icon, callback } = option;
            const selfShow = self ? name !== "Info" : true;

            if (name === "Copy" && message.type !== "text") {
              return null;
            }

            return (
              <div key={index}>
                {selfShow && (
                  <li
                    className="flex items-center gap-4 py-3 px-5 hover:bg-dropdown-background-hover cursor-pointer"
                    onClick={(e) => handleClick(e, callback)}
                  >
                    <div className="text-xl text-icon-lighter">{Icon}</div>
                    <span className="text-sm text-white">{name}</span>
                  </li>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default MessageMenu;
