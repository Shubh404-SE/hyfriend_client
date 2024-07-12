import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";

function Avatar({ type, image, setImage }) {
  
  const [hover, setHover] = useState(false);
  const [isContextMenue, setIsContextMenue] = useState(false);
  const [contextMenueCordinates, setContextMenueCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);


  useEffect(()=>{
    if(grabPhoto){
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus =(e) =>{
        setTimeout(()=>{
          setGrabPhoto(false);
        }, 1000);
      }
    }
  }, [grabPhoto]);


  const contextMenuOptions = [
    {name:"Take photo", callback: ()=>{}},
    {name:"Choose from Library", callback: ()=>{}},
    {name:"Upload photo", callback: ()=>{
      setGrabPhoto(true);
    }},
    {name:"Remove photo", callback: ()=>{
      setImage("/default_avatar.png");
    }}

  ]

  const showContextMenue = (e) => {
    e.preventDefault();
    setIsContextMenue(true);
    setContextMenueCordinates({ x: e.pageX, y: e.pageY
    });
  };

  const photoPickerChange = async(e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement('img');
    reader.onload = function(event){
      data.src = event.target.result;
      data.setAttribute('data-src', event.target.result);
    }
    reader.readAsDataURL(file);
    setTimeout(()=>{
      setImage(data.src);
    }, 100);
  }

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className=" relative h-10 w-10">
            <Image src={image} alt="Avatar" className=" rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div className=" relative h-14 w-14">
            <Image src={image} alt="Avatar" className=" rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative z-0 cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? " visible" : "hidden"
              }`}
              onClick={(e) => showContextMenue(e)}
              id="context_opener"
            >
              <FaCamera
                className=" text-2xl"
                onClick={(e) => showContextMenue(e)}
                id="context_opener"
              />
              <span
                className=" text-white"
                onClick={(e) => showContextMenue(e)}
                id="context_opener"
              >
                Change profile photo
              </span>
            </div>
            <div className=" h-60 w-60">
              <Image src={image} alt="Avatar" className=" rounded-full" fill />
            </div>
          </div>
        )}
        <div>
          {
            isContextMenue && <ContextMenu 
            options={contextMenuOptions}
            cordinates={contextMenueCordinates}
            contextMenu={isContextMenue}
            setContextMenu={setIsContextMenue}
             />
          }
          {
            grabPhoto && <PhotoPicker onChange={photoPickerChange} />
          }
        </div>
      </div>
    </>
  );
}

export default Avatar;
