/** @jsxImportSource @emotion/react */

"use client";

import { useEffect, useRef, useState } from "react";

import styled from "@emotion/styled";

import Image from "next/image";

import { css } from "@emotion/react";

import OpenAI from "openai";

import { Oval } from "react-loader-spinner";

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

const debounce = <F extends (...args: any[]) => void>(
  func: F,
  delay: number
) => {
  let timerId: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const NewAudio = () => {
  const [value, setValue] = useState<string>("");
  const [isJump, setIsJump] = useState<boolean>(false);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isRight, setIsRight] = useState<boolean>(false);
  const [image, setImage] = useState<string>("/Default.png");
  const [isHammer, setIsHammer] = useState<boolean>(false);

  const [answer, setAnswer] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  const [isQuestioning, setIsQuestioning] = useState(false);
  const isQuestioningRef = useRef(isQuestioning);

  const dialog = useRef<HTMLDialogElement>(null);

  const key = process.env.NEXT_PUBLIC_OPENAI_KEY;

  const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
  });

  const getAIAnswer = async (question: string) => {
    if (isLoading) return;
    await setIsLoading(true);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${question}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    await setIsLoading(false);

    const answer = completion.choices[0].message.content;

    if (answer) {
      setAnswer(answer);
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.interimResults = true;
      recognition.lang = "ko-KR";

      const handleSpeechResult = debounce((e: any) => {
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
          case "최장우": {
            setImage("/jang.jpeg");
            break;
          }
          case "최장": {
            setImage("/jang.jpeg");
            break;
          }
          case "김주은": {
            setImage("/juen.png");
            break;
          }
          case "주은": {
            setImage("/juen.png");
            break;
          }
          case "희성": {
            setImage("/js.png");
            break;
          }
          case "신희성": {
            setImage("/js.png");
            break;
          }
          case "경주": {
            setImage("/gg.png");
            break;
          }
          case "주경주": {
            setImage("/gg.png");
            break;
          }
          case "재균": {
            setImage("/jg.png");
            break;
          }
          case "김재균": {
            setImage("/jg.png");
            break;
          }
          case "상혁": {
            setImage("/sh.png");
            break;
          }
          case "정상혁": {
            setImage("/sh.png");
            break;
          }
          case "춤춰": {
            const rand = Math.floor(Math.random() * 10);
            setImage(Dances[rand]);
            break;
          }
          case "망치": {
            setIsHammer(true);
            setTimeout(() => {
              setIsHammer(false);
            }, 2000);
            break;
          }
          default: {
            dialog.current?.showModal();
            getAIAnswer(texts);
          }
        }
      }, 1000);

      recognition.onresult = function (e: any) {
        handleSpeechResult(e);
      };
    }
  }, [recognition]);

  useEffect(() => {
    const newRecognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    setRecognition(newRecognition);

    new SpeechSynthesisUtterance();
  }, []);

  useEffect(() => {
    isQuestioningRef.current = isQuestioning;
  }, [isQuestioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        dialog.current?.close();
      } else if (e.key === " ") {
        if (isQuestioningRef.current) {
          recognition?.stop();
          setIsQuestioning(false);
        } else {
          recognition?.start();
          setIsQuestioning(true);
        }
      } else if (e.key === "Backspace") {
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [recognition]);

  return (
    <Container>
      <Modal ref={dialog}>
        <ModalWrapper>
          {isLoading ? (
            <>
              <h1
                style={{
                  color: "black",
                }}
              >
                로딩중
              </h1>
              <Oval height="80" width="80" color="green" ariaLabel="loading" />
            </>
          ) : (
            <>
              <Texts>{answer}</Texts>
              <Form>
                <Button onClick={() => window.speechSynthesis.cancel()}>
                  답변 중지
                </Button>
                <Button onClick={() => dialog.current?.close()}>닫기</Button>
              </Form>
            </>
          )}
        </ModalWrapper>
      </Modal>
      {isQuestioning && <h1>질문을 받고있어요...</h1>}
      <h1>{value}</h1>
      {recognition && (
        <BTN
          onMouseDown={() => recognition.start()}
          onMouseUp={() => recognition.stop()}
        >
          🎤 MouseDown Here!
        </BTN>
      )}
      <Image
        alt="캐릭터"
        src={image}
        width={350}
        height={400}
        css={css`
          transition: all ease 1s;
          position: relative;
          transform: translateY(${isJump && "-300px"});
          transform: translateX(${isRight && "300px"});
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

const BTN = styled.button`
  font-size: 100px;
  cursor: pointer;
  background-color: silver;
  border-radius: 20px;
  margin-bottom: 30px;

  :active {
    background-color: red;
  }
`;

const HammerIMG = styled(Image)`
  position: absolute;
  top: 100px;
  transform: rotate(-100deg);
`;

const Modal = styled.dialog`
  border-radius: 6px;
  padding: 0;

  position: absolute;
  left: calc(50% - 250px);
  top: calc(20%);
  ::backdrop {
    background-color: rgba(0, 0, 0, 20%);
  }
`;

const ModalWrapper = styled.div`
  width: 500px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  background-color: white;
  border-radius: 6px;
`;

const Texts = styled.p`
  font-size: 16px;
  color: black;
`;

const Form = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  width: 200px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
