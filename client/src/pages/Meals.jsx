
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/meals";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("fitastic_token")}`,
  };
}

export default function Meals() {
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [foodId, setFoodId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("breakfast");
  const [message, setMessage] = useState("");

  async function loadFoods() {
    try {
      const res = await fetch(`${API_URL}/foods`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load foods.");
      setFoods(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadMeals() {
    try {
      const res = await fetch(API_URL, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load meals.");
      setMeals(data.meals);
      setTotal(data.total);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadFoods();
    loadMeals();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ foodId, quantity: Number(quantity), category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not save meal.");

      setFoodId("");
      setQuantity(1);
      setMessage("Meal saved.");
      loadMeals();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() });
    loadMeals();
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Calorie Intake</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
        <select
          value={foodId}
          onChange={(e) => setFoodId(e.target.value)}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:flex-1"
        >
          <option value="">Select food</option>
          {foods.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name} ({f.servingSize}, {f.calories} kcal)
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0.5"
          step="0.5"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-24"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize sm:w-36"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <button
          type="submit"
          className="rounded-full bg-linear-to-r from-brand-purple via-brand-blue to-brand-pink px-6 py-2 text-sm font-medium text-white"
        >
          Add
        </button>
      </form>

      {message && <p className="text-sm text-brand-pink">{message}</p>}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Today: {total} kcal</h3>

        {meals.length === 0 ? (
          <p className="py-6 text-center text-slate-500">Aaj abhi koi meal add nahi hua.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {meals.map((meal) => (
              <li key={meal._id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span className="flex-1">{meal.foodName}</span>
                <span className="capitalize text-slate-500">{meal.category}</span>
                <span>x{meal.quantity}</span>
                <b>{meal.calories} kcal</b>
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="rounded-full bg-brand-pink px-3 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}