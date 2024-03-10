import styled from "@emotion/styled";

import { useRouter } from "next/navigation";

const AudioRecord = () => {
  const { push } = useRouter();

  return (
    <Container>
      <Btn onClick={() => push("/new-audio")}>더 나은 버전으로 이동</Btn>
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
  width: 400px;
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
