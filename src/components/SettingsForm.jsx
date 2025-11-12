import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  difficulty: yup.string().required(),
});

const SettingsForm = ({ onSave, initialSettings, completedLevels = [] }) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialSettings,
  });

  const onSubmit = data => {
    console.log("✅ Обрано рівень:", data.difficulty);
    onSave(data);
  };

  const levels = [
    { value: "easy", label: "Легкий (5x5)", available: true },
    { value: "medium", label: "Середній (6x6)", available: completedLevels.includes("medium") },
    { value: "hard", label: "Складний (8x8)", available: completedLevels.includes("hard") }
  ];

  return (
    <form className="settings-form" onSubmit={handleSubmit(onSubmit)}>
      <h3>Обрати рівень</h3>

      <label>Рівень складності:</label>
      <select {...register("difficulty")}>
        {levels.map(level => (
          <option 
            key={level.value} 
            value={level.value}
            disabled={!level.available}
          >
            {level.available ? level.label : `${level.label} 🔒`}
          </option>
        ))}
      </select>

      <div className="levels-info">
        <p><strong>Статус рівнів:</strong></p>
        {levels.map(level => (
          <div key={level.value} className="level-status">
            <span className="level-name">{level.label}</span>
            <span className={`level-availability ${level.available ? 'available' : 'locked'}`}>
              {level.available ? '✅ Доступний' : '❌ Заблокуваний'}
            </span>
          </div>
        ))}
      </div>

      <button type="submit">Обрати</button>

      {/* Додаткова інформація для дебагу */}
      <div style={{ fontSize: '10px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
        Пройдені: {completedLevels.join(', ')}
      </div>
    </form>
  );
};

export default SettingsForm;