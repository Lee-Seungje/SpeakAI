import React, { useState } from "react";

import styled from "@emotion/styled";

const Example = () => {
  const [value, setValue] = useState<string>("");
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
    console.log(texts);
  };

  return (
    <Container>
      <h1>{value}</h1>
      <BTN
        onMouseDown={() => recognition.start()}
        onMouseUp={() => recognition.stop()}
      >
        🎤
      </BTN>
    </Container>
  );
};

export default Example;

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
