import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [captchaText, setCaptchaText] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [coinBalance, setCoinBalance] = useState(0);
  const [inputStyle, setInputStyle] = useState({});
  const [userId, setUserId] = useState("user123");
  const [wrongCaptchaCount, setWrongCaptchaCount] = useState(0);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/captcha");
      setCaptchaText(response.data.text);
      setCaptchaImage(response.data.image);
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(
      "http://localhost:5000/api/validate-captcha",
      {
        userId,
        captchaAnswer: userAnswer,
        captchaText,
      }
    );

    const { isValid, newCaptcha, coinBalance } = response.data;

    if (isValid) {
      setCoinBalance(coinBalance);
      setInputStyle({ borderColor: "green" });
    } else {
      setWrongCaptchaCount(wrongCaptchaCount + 1);
      setInputStyle({ borderColor: "red" });
    }

    setCaptchaText(newCaptcha.text);
    setCaptchaImage(newCaptcha.image);
    setUserAnswer("");
  };

  return (
    <div className="App">
      <h1>Captcha Solver</h1>
      <div className="captcha-container">
        <div className="captcha">
          <img
            src={`data:image/svg+xml;base64,${btoa(captchaImage)}`}
            alt="CAPTCHA"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter CAPTCHA"
            style={inputStyle}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="coin-balance">
        <h2>Coins: {coinBalance}</h2>
        <p>Wrong attempts: {wrongCaptchaCount}</p>
      </div>
    </div>
  );
};
export default App;
