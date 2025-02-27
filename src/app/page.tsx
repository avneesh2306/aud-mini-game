'use client';
import { useEffect, useState } from "react";
// import TelegramMiniAppSDK from 'telegram-advertiser-sdk';


const questionsList = [
  { question: "What is 5 + 3?", answer: "8" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 10 - 4?", answer: "6" },
  { question: "What color is the sky on a clear day?", answer: "Blue" },
  { question: "What is 3 * 3?", answer: "9" }
];

export default function Home() {

  const [currentQuestion, setCurrentQuestion] = useState({ question: "", answer: "" });
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getRandomQuestion();
  }, []);

  const getRandomQuestion = () => {
    setAnswer("");
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    setCurrentQuestion(questionsList[randomIndex]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call to check the answer
      const response = await fetch('/api/checkAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, correctAnswer: currentQuestion.answer }),
      });

      const data: { correct: boolean } = await response.json();
      setResult(data.correct ? "Correct! 🎉" : "Wrong answer, try again.");
      if (data.correct) {
        getRandomQuestion();
        // call advertiser webhook aapi
        callAdvertiserWebhook();
      }
    } catch (error) {
      console.error('Error checking answer', error);
    } finally {
      setLoading(false);
    }
  };

  const callAdvertiserWebhook = async () => {
    try {
      // const sdk = new TelegramMiniAppSDK({
      //   apiKey: 'EjJvklHA2dq00xGJRuRa5QCr96dUAkdbJyxuixQ21ADYGcCeJT5LuDf2thVDlaLl',
      // });
      // await sdk.init();

      await new Promise(resolve => setTimeout(resolve, 1000));
      const advertiserId = "12345678"
      const idToken = "2bc9fc7b9550d4ed9d5d0ebae0bd21066d95eda54214acf59d96aef63024c9faa6dcd9fa79acb097b9dcf95d86055008f4d735dc710a7aaa8b10e25bd59da37e"
      // const rewardsRes = await sdk.markActionComplete(advertiserId, idToken);
      // console.log('✅ rewards sent successfully:', rewardsRes);
    } catch (error) {
      console.error('Error calling advertiser webhook', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-center font-bold">Quiz Game</h2>
        <p className="text-center">{currentQuestion.question}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Submit Answer'}
          </button>
        </form>
        {result && <p className="text-center mt-4 font-bold">{result}</p>}
      </div>
    </div>
  );
}
