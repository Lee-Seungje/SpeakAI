/** @jsxImportSource @emotion/react */

import React, { useState } from "react";

import styled from "@emotion/styled";

import Image from "next/image";

import { css } from "@emotion/react";

const NewAudio = () => {
  const [value, setValue] = useState<string>("");
  const [isJump, setIsJump] = useState<boolean>(false);
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
        src="/LeeJW.jpg"
        width={300}
        height={400}
        css={
          isJump &&
          css`
            position: relative;
          `
        }
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
