/** @jsxImportSource @emotion/react */

import { useState } from "react";

import styled from "@emotion/styled";

import Image from "next/image";

import { css } from "@emotion/react";

const NewAudio = () => {
  const [value, setValue] = useState<string>("");
  const [isJump, setIsJump] = useState<boolean>(false);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isRight, setIsRight] = useState<boolean>(false);
  const [isJong, setIsJong] = useState<boolean>(false);
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "ko-KR";

  recognition.onresult = function (e: any) {
    let texts = Array.from(e.results)
      .map((results: any) => results[0].transcript)
      .join("");
    setValue(texts);

    switch (texts) {
      case "점프": {
        setIsJump(true);
        setTimeout(() => {
          setIsJump(false);
        }, 1000);
        break;
      }
      case "돌아": {
        setIsTurn(true);
        setTimeout(() => {
          setIsTurn(false);
        }, 1000);
        break;
      }
      case "오른쪽": {
        setIsRight(true);
        setTimeout(() => {
          setIsRight(false);
        }, 1000);
        break;
      }
      case "최종인": {
        setIsJong(true);
        break;
      }
      case "채종인": {
        setIsJong(true);
        break;
      }
      case "이정우": {
        setIsJong(false);
        break;
      }
    }
  };

  return (
    <Container>
      <h1>{value}</h1>
      <BTN
        onMouseDown={() => recognition.start()}
        onMouseUp={() => recognition.stop()}
      >
        🎤 MouseDown Here!
      </BTN>
      <Image
        alt="캐릭터"
        src={isJong ? "/ChaJI.png" : "/LeeJW.jpg"}
        width={300}
        height={400}
        css={css`
          transition: all ease 1s;
          position: relative;
          transform: translateY(${isJump && "-300px"});
          transform: translateX(${isRight && "300px"});
          /* transform: translateX(${isRight && "300px"}); */
          transform: rotate(${isTurn && "180deg"});
        `}
      />
    </Container>
  );
};

export default NewAudio;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BTN = styled.div`
  font-size: 100px;
  cursor: pointer;
`;
