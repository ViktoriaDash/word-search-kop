import React from "react";
import Button from "../components/Button";

export default function StartPage({ onStart }) {
  return (
    <div className="page start-page">
      <h1>Пошук слова (Word Search)</h1>
      <p>Знайди всі слова, сховані в сітці букв!</p>
      <Button label="Почати гру" onClick={onStart} />
    </div>
  );
}
