"use client";

import styled from "@emotion/styled";

interface PostPageProps {
  params: { data: string };
}

export default function Home({ params: { data } }: PostPageProps) {
  return (
    <Container>
      <h1>마이 페이지 입니다.</h1>
      <h2>{"당신이 말한 문장 ->  " + data.replaceAll("%20", " ")}</h2>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
