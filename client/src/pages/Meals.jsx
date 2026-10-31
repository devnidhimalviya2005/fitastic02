import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/meals";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState("");
  const [message, setMessage] = useState("");

  async function loadMeals() {
    const token = localStorage.getItem("fitastic_token");

    try {
      const response = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load meals.");
      }

      setMeals(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadMeals();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("fitastic_token");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          mealType,
          calories: Number(calories),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save meal.");
      }

      setMeals((currentMeals) => [data, ...currentMeals]);
      setName("");
      setMealType("breakfast");
      setCalories("");
      setMessage("Meal saved.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main>
      <h1>Meals</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Meal name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Oatmeal"
            maxLength={100}
            required
          />
        </label>

        <label>
          Meal type
          <select
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>

        <label>
          Calories
          <input
            type="number"
            min="0"
            max="10000"
            value={calories}
            onChange={(event) => setCalories(event.target.value)}
            placeholder="e.g. 350"
            required
          />
        </label>

        <button type="submit">Save meal</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Saved meals</h2>
      {meals.length === 0 ? (
        <p>No meals saved yet.</p>
      ) : (
        <ul>
          {meals.map((meal) => (
            <li key={meal._id}>
              {meal.name} — {meal.mealType} — {meal.calories} calories
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}