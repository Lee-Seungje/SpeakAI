import React, { useState } from "react";

import styled from "@emotion/styled";

const AudioRecord = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [media, setMedia] = useState<MediaRecorder>();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState<MediaStreamAudioSourceNode>();
  const [analyser, setAnalyser] = useState<ScriptProcessorNode>();
  const [audioUrl, setAudioUrl] = useState<Blob>();
  const [realAudioUrl, setRealAudoUrl] = useState<string>("");

  const onRecAudio = () => {
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.AudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream: any) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          // 메서드가 호출 된 노드 연결 해제
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

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    if (media && stream && analyser && source) {
      media.ondataavailable = function (e) {
        setAudioUrl(e.data);
        setOnRec(true);
      };

      // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
      stream.getAudioTracks().forEach((track) => {
        track.stop();

        // 미디어 캡처 중지
        media.stop();
        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();
      });
    }
  };

  const onSubmitAudioFile = () => {
    if (audioUrl) {
      console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
      setRealAudoUrl(URL.createObjectURL(audioUrl));
    }
    // File 생성자를 사용해 파일로 변환
    if (audioUrl) {
      const sound = new File([audioUrl], "soundBlob", {
        lastModified: new Date().getTime(),
        type: "audio",
      });
      console.log(sound);
    }
  };

  return (
    <Container>
      <Btn onClick={onRec ? onRecAudio : offRecAudio}>녹음</Btn>
      <Btn onClick={onSubmitAudioFile}>결과 확인</Btn>
      <AudioPlay controls src={realAudioUrl}></AudioPlay>
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
