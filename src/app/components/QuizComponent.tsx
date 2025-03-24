"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import K2SDK from '@dat-platform/advertiser';
// import telSDK from 'telegram-sdk-adv';


const questionsList = [
  { question: "What is 5 + 3?", answer: "8" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 10 - 4?", answer: "6" },
  { question: "What color is the sky on a clear day?", answer: "Blue" },
  { question: "What is 3 * 3?", answer: "9" }
];

const QuizComponent = () => {
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const {id:idToken = '', advertiser_id:advertiserId = '6253768769'} = params
  const [currentQuestion, setCurrentQuestion] = useState({ question: "", answer: "" });
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctAttemptsRequired, setCorrectAttemptsRequired] = useState(3);
  const [rewardEarned, setRewardEarned] = useState(false);
  

  const k2SDK = K2SDK as any;
  useEffect(() => {
    const initialize = async () => {
      try {
        await k2SDK.initialize({
          apiKey: "EjJvklHA2dq00xGJRuRa5QCr96dUAkdbJyxuixQ21ADYGcCeJT5LuDf2thVDlaLl"
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        // K2SDK.getID()
        return true;
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };
    initialize();
  }, []);
  

  useEffect(() => {
    getRandomQuestion();
  }, []);

  useEffect(() => {
    if(rewardEarned && idToken && idToken != "" && advertiserId && advertiserId != ""){
      callAdvertiserWebhook()
    }
  }, [rewardEarned])
  

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    setCurrentQuestion(questionsList[randomIndex]);
    setAnswer("");
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
      const isCorrect = data.correct;
      if (isCorrect) {
        setCorrectCount(correctCount + 1);
      }
      setResult(isCorrect ? "Correct! 🎉" : "Wrong answer, try again.");
      if (correctCount + (isCorrect ? 1 : 0) >= 3) {
        setRewardEarned(true);
        // setTimeout(() => {
        //   window.history.back();
        // }, 1000);
      }
    } catch (error) {
      console.error('Error checking answer', error);
    }  finally {
      setLoading(false);
      getRandomQuestion();
    }
  };

  const callAdvertiserWebhook = async () => {
    try {
      const sdk = k2SDK.getInstance();
      const closeOnComplete = true;
      const rewardsRes = await sdk.markActionComplete(advertiserId, idToken, closeOnComplete);
      console.log('✅ rewards sent successfully:', rewardsRes);
    } catch (error) {
      console.error('Error calling advertiser webhook', error);
    }finally {
      // setTimeout(() => {
      //   setRewardEarned(false)
      //   setCorrectCount(0)
      // }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <h1 className="text-center font-bold text-2xl mb-4 text-blue-600">Ultimate Quiz Challenge! 🏆</h1>
        {!rewardEarned && 
          <>
            <h2 className="text-center font-bold">Question:</h2>
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
            <p className="text-center mt-2">Correct Answers: {correctCount} / {correctAttemptsRequired}</p>  
          </>
        }
        
        {rewardEarned && <p className="text-green-500 text-center font-bold mt-4">🎉 Congratulations! You earned a reward! 🎉</p>}
      </div>
    </div>
  );
}

export default QuizComponent;
