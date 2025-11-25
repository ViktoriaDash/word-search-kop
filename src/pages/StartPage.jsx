import React from "react";
import { useNavigate } from "react-router-dom"; 
import Button from "../components/Button";
import "../styles/view.css"; 
import "../styles/StartPage.css"; 

const PLAYER_ID = "player_1"; 
const generateGuestId = () => `guest_${Date.now()}`;

export default function StartPage({ onStart }) {
  const navigate = useNavigate();

  const startAs = (userId) => {
    onStart(userId); 
    navigate(`/game/${userId}`); 
  };

  return (
    <div className="page start-page">
      <h1>Пошук слова (Word Search)</h1>
      <p>Оберіть режим гри:</p>
      
      <div className="start-modes">
          <Button 
            label="👤 Грати як Player 1" 
            onClick={() => startAs(PLAYER_ID)} 
            title="Ваш прогрес і результати будуть збережені між сесіями."
          />
          
          <Button 
            label="👻 Грати як Гість" 
            onClick={() => startAs(generateGuestId())} 
            className="guest-btn" 
            title="Прогрес буде збережено лише на час поточної сесії браузера."
          />
      </div>
      
      <div className="info-block">
        <p>Ваш постійний ID: **{PLAYER_ID}**</p>
      </div>
      
    </div>
  );
}