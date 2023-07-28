/** @jsxImportSource @emotion/react */

import { useState } from "react";

import styled from "@emotion/styled";

import Image from "next/image";

import { css } from "@emotion/react";

const Dances = [
  "/ChaDance.gif",
  "/Dance.gif",
  "/LeeDance.gif",
  "/ParkDance.gif",
  "/YoonDance.gif",
  "/YoonDance2.gif",
  "/YoonDance3.gif",
  "/JungDance.gif",
  "/ChaDance.gif",
  "/Dance.gif",
];

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const NewAudio = () => {
  const [value, setValue] = useState<string>("");
  const [isJump, setIsJump] = useState<boolean>(false);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isRight, setIsRight] = useState<boolean>(false);
  const [image, setImage] = useState<string>("/LeeJW.jpg");
  const [isHammer, setIsHammer] = useState<boolean>(false);

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
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
        setImage("/ChaJI.png");
        break;
      }
      case "채종인": {
        setImage("/ChaJI.png");
        break;
      }
      case "이정우": {
        setImage("/LeeJW.jpg");
        break;
      }
      case "정민석": {
        setImage("/JungMS.jpg");
        break;
      }
      case "윤태빈": {
        setImage("/YoonTB.jpg");
        break;
      }
      case "박주홍": {
        setImage("/dalit.gif");
        break;
      }
      case "춤춰": {
        const rand = Math.floor(Math.random() * 10);
        setImage(Dances[rand]);
        break;
      }
      case "최종인 여친": {
        setImage("/ChaGirl.webp");
        break;
      }
      case "망치": {
        setIsHammer((prev) => !prev);
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
        src={image}
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
      {isHammer && (
        <HammerIMG src="/hammer.gif" alt="hammer" width={300} height={400} />
      )}
    </Container>
  );
};

export default NewAudio;

const Container = styled.div`
  position: relative;
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
  background-color: silver;
  border-radius: 20px;
  margin-bottom: 30px;
`;

const HammerIMG = styled(Image)`
  position: absolute;
  top: 100px;
  transform: rotate(-100deg);
`;
