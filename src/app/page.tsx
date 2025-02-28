"use client";
import { Suspense } from "react";
import QuizComponent from "./components/QuizComponent";
export default function Home() {  
  return (
    <div className="main-page">
      <Suspense>
        <QuizComponent />
      </Suspense>
    </div>
  );
}
