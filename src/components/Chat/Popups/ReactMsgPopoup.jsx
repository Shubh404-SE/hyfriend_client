import React from 'react';
import PopupWrapper from './PopupWrapper';

const ReactMsgPopoup = (props) => {
  const emojis = ["👍", "❤️", "🤣", "😯", "🙏", "😥"];

  return (
    <PopupWrapper {...props}>
      <div className="flex items-center justify-center gap-2 w-full">
        {emojis.map((emoji, index) => (
          <span
            key={index}
            className={`text-3xl emoji-3d animate-emoji-appear ${index > 0 ? `animate-delay-[${index * 200}ms]` : ''}`}
            onClick={()=>{
                props.handleMessageReact(emoji);
                props.onHide();
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </PopupWrapper>
  );
};

export default ReactMsgPopoup;