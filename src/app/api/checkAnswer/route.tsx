import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answer,correctAnswer = "" } = await req.json();

  const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
  if(isCorrect){
    return NextResponse.json({ correct: true});
  }else{
    return NextResponse.json({ correct: false });
  }
}