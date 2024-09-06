import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import MessageStatus from "../../common/MessageStatus";
import { calculateTime, formateDate } from "@/utils/CalculateTime";
import { wrapEmojisInHtmlTag } from "@/utils/Helper";
import { GrPowerCycle } from "react-icons/gr";
import { getTranslationText } from "lingva-scraper";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

function TextMessage({ message, preview }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const [translating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState(message.message);

  // const translate = async () => {
  //   // const translation = await getTranslationText("auto", "es", "win");
  //   if (message.message === translatedText) {
  //     try {
  //       setIsTranslating(true);
  //       const res = await axios.get(
  //         `https://api.mymemory.translated.net/get?q=${message.message}&langpair=${currentChatUser.langauge}|${userInfo.langauge}`
  //       );
  //       console.log(res.data);
  //       if (res.status === 200) {
  //         setTranslatedText(res.data.responseData.translatedText);
  //         setIsTranslating(false);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       setIsTranslating(false);
  //     }
  //   } else {
  //     setTranslatedText(message.message);
  //   }
  // };

  const translate = async () => {
    if (message.message === translatedText) {
      try {
        setIsTranslating(true);
        const genAI = new GoogleGenerativeAI(
          process.env.NEXT_PUNLIC_GEMINI_AI_ID
        );
        // console.log(process.env.NEXT_PUNLIC_GEMINI_AI_ID);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Translate this message into "${userInfo.langauge}" iso langauge code:" ${message.message}". 
        no need to translate if translating langauge and message in same langauge. 
        give me only translated text to show ditectly if you can not translate or any error, anything just say why? as sort as you can`;

        const result = await model.generateContent(prompt);
        setTranslatedText(result.response.text());
        setIsTranslating(false);
        // console.log(prompt, result.response.text());
      } catch (err) {
        console.log(err);
        setIsTranslating(false);
      }
    } else {
      setTranslatedText(message.message);
    }
  };
  // console.log(translatedText);

  return (
    <div
      className={` text-white px-2 py-[1px] text-sm rounded-md flex flex-col max-w-sm min-w-12 ${
        message.senderId === currentChatUser.id
          ? " bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <span
        className={`p-1 text-pretty ${preview ? "max-h-[150px] truncate" : ""}`}
        dangerouslySetInnerHTML={{
          __html: wrapEmojisInHtmlTag(translatedText),
        }}
      ></span>
      <div className="flex items-end justify-end gap-[2px]">
        <span className=" text-bubble-meta text-[11px] pt-1 min-w-fit">
          {formateDate(message.createdAt)}
        </span>
        {message.recieverId === userInfo.id &&
          currentChatUser.langauge !== userInfo.langauge && (
            <span>
              <GrPowerCycle
                onClick={translate}
                title="Translator"
                className={`text-[10px] cursor-pointer ${
                  translating ? "animate-spin" : ""
                }`}
              />
            </span>
          )}
        <span>
          {message.senderId === userInfo.id && (
            <MessageStatus messageStatus={message.messageStatus} />
          )}
        </span>
      </div>
    </div>
  );
}

export default TextMessage;
