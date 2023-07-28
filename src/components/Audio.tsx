import React, { useState } from "react";

import axios from "axios";
import styled from "@emotion/styled";

import { useRouter } from "next/navigation";

const AudioRecord = () => {
  const router = useRouter();

  const [stream, setStream] = useState<MediaStream>();
  const [media, setMedia] = useState<MediaRecorder>();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState<MediaStreamAudioSourceNode>();
  const [analyser, setAnalyser] = useState<ScriptProcessorNode>();
  const [audioUrl, setAudioUrl] = useState<Blob>();
  const [realAudioUrl, setRealAudoUrl] = useState<string>("");
  const [base64String, setBase64String] = useState<string>("");
  const [soundFile, setSoundFile] = useState<File>();

  const onRecAudio = () => {
    const audioCtx = new (window.AudioContext || window.AudioContext)();
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream: any) {
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
          };
        } else {
          setOnRec(false);
        }
      };
    });
  };

  const offRecAudio = () => {
    if (media && stream && analyser && source) {
      media.ondataavailable = function (e) {
        setAudioUrl(e.data);
        setOnRec(true);
      };
      stream.getAudioTracks().forEach((track) => {
        track.stop();
        media.stop();
        analyser.disconnect();
        source.disconnect();
      });
    }
  };

  const onSubmitAudioFile = () => {
    if (audioUrl) {
      console.log(URL.createObjectURL(audioUrl));
      setRealAudoUrl(URL.createObjectURL(audioUrl));
    }
    if (audioUrl) {
      const sound = new File([audioUrl], "soundBlob", {
        lastModified: new Date().getTime(),
        type: "audio",
      });
      setSoundFile(sound);
    }
  };

  const sendFile = async () => {
    const requestJson = {
      argument: {
        language_code: "english",
        audio: base64String,
      },
    };

    const res = await axios({
      url: "http://aiopen.etri.re.kr:8000/WiseASR/Recognition",
      method: "POST",
      data: JSON.stringify(requestJson),
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_API_MAIN_KEY,
      },
    });
    const responseData = res.data.return_object.recognized;
    alert(responseData);
    console.log(responseData);
    switch (responseData[0]) {
      case "I":
        router.push(`/mypage/${responseData}`);
    }
  };

  const onClick = () => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result == "string")
        setBase64String(reader.result.split(",")[1] as string);
    };
    if (soundFile) {
      reader.readAsDataURL(soundFile);
    }
  };

  return (
    <Container>
      <Btn onClick={onRec ? onRecAudio : offRecAudio}>녹음</Btn>
      <Btn onClick={onSubmitAudioFile}>결과 확인</Btn>
      <AudioPlay controls src={realAudioUrl}></AudioPlay>
      <Btn onClick={onClick}>base64인코딩</Btn>
      <Btn onClick={sendFile}>진짜 제출</Btn>
      <h1 onClick={() => router.push("/new-audio")}>더 나은 버전으로 이동</h1>
    </Container>
  );
};

export default AudioRecord;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

const Btn = styled.div`
  width: 200px;
  height: 70px;
  background-color: silver;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 30px;
  color: #191919;
  font-size: 30px;
`;

const AudioPlay = styled.audio``;
