import { ADD_MESSAGE } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
// import { MediaRecorder } from "zego-express-engine-webrtc/sdk/src/common/zego.entity";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audioRef = useRef(null);
  const waveFormRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(()=>{
    let interval ;
    if(isPlaying){
      interval = setInterval(()=>{
        setRecordingDuration((prev) =>{
          setTotalDuration(prev+1);
          return prev+1;
        });
      }, 1000);
    }

    return ()=>{
      clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if(waveForm) handleStartRecording();
  }, [waveForm]);


  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);

      const responce = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });

      if (responce.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: responce.data.message,
        });

        dispatch({
          type: ADD_MESSAGE,
          newMessage: {
            ...responce.data.message,
          },
          fromSelf: true,
        });
        setRenderedAudio(null)
      }
    }catch (err) {
      console.log(err);
    }
  };


  
  const handleStartRecording = () => {

    setTotalDuration(0);
    setCurrentPlaybackTime(0);
    setRecordingDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;


      const chunks = [];
      mediaRecorder.ondataavailable = (e) =>chunks.push(e.data);
      mediaRecorder.onstop = () =>{
        const blob = new Blob(chunks, {type:"audio/ogg; codecs=opus"});
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);

        waveForm.load(audioURL);
      };

      mediaRecorder.start();
    }).catch(err=>{
      console.log("Error accessing microphone", err);
    })
  };
  
  const handleStopRecording = () => {
    if(mediaRecorderRef.current && isRecording){
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavilable", (event)=>{
        audioChunks.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener("stop", ()=>{
        const audioBlob = new Blob(audioChunks, {type:"audio/mp3"});
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(()=>{
    if(recordedAudio){
      const updatePlaybackTime = () =>{
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);

      return ()=>{
        recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      }
    }
  }, [recordedAudio]);
  
  const handlePlayRecording = () => {
    if(recordedAudio){
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className=" text-panel-header-icon text-xl cursor-pointer hover:text-red-400"
          onClick={() => hide(false)}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-ld">
        {isRecording ? (
          <div className=" text-red-500 animate-pulse w-60 text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div className="">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}

        <audio ref={audioRef} hidden />

        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone
              className=" text-red-500"
              onClick={handleStartRecording}
            />
          ) : (
            <FaPauseCircle
              className="text-red-500"
              onClick={handleStopRecording}
            />
          )}
        </div>
        <div>
          <MdSend
            className="text-panel-header-icon cursor-pointer mr-4"
            title="Send"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
