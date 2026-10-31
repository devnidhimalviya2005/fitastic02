import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const WORKOUTS_URL = `${API_URL}/api/workouts`;

const activities = [
  { value: "walking", label: "Walking" },
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "swimming", label: "Swimming" },
  { value: "strength", label: "Strength training" },
  { value: "other", label: "Other / enter manually" },
];

function getAuthToken() {
  const possibleKeys = ["token", "authToken", "accessToken"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }

  // Some projects store the token inside a saved user/auth object.
  for (const key of ["user", "auth", "currentUser"]) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      const token = saved?.token || saved?.accessToken;
      if (token) return token;
    } catch {
      // Ignore entries that are not JSON.
    }
  }

  return null;
}

async function apiRequest(url, options = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Your login token was not found. Sign out and sign in again."
    );
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "Your session was rejected. Please sign out and sign in again."
    );
  }

  if (!response.ok) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }

  return result;
}

function getActivityName(workout) {
  return workout.activity === "other"
    ? workout.customActivity || "Other activity"
    : workout.activity || "Workout";
}

export default function Workout() {
  const [activity, setActivity] = useState("walking");
  const [customActivity, setCustomActivity] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadWorkouts = useCallback(async () => {
    setHistoryLoading(true);
    setError("");

    try {
      const result = await apiRequest(WORKOUTS_URL);
      setWorkouts(Array.isArray(result) ? result : result.workouts || []);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the workout API. Check that your backend is running."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const totals = useMemo(() => {
    return workouts.reduce(
      (sum, workout) => ({
        minutes: sum.minutes + Number(workout.durationMinutes || 0),
        calories: sum.calories + Number(workout.caloriesBurned || 0),
      }),
      { minutes: 0, calories: 0 }
    );
  }, [workouts]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const duration = Number(durationMinutes);
    const weight = Number(weightKg);

    if (!Number.isFinite(duration) || duration < 1 || duration > 600) {
      setError("Enter a workout duration between 1 and 600 minutes.");
      return;
    }

    if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
      setError("Enter a weight between 1 and 500 kg.");
      return;
    }

    if (activity === "other" && !customActivity.trim()) {
      setError("Please enter the activity name.");
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest(WORKOUTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity,
          customActivity:
            activity === "other" ? customActivity.trim() : "",
          intensity,
          durationMinutes: duration,
          weightKg: weight,
        }),
      });

      const savedWorkout = result.workout || result;
      setWorkouts((current) => [savedWorkout, ...current]);
      setCustomActivity("");
      setDurationMinutes("");
      setSuccess("Workout saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save workout.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-8 text-[#244A3A]">
      <section className="grid overflow-hidden rounded-3xl bg-[#F5F2E9] shadow-sm md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#9B7834]">
            Move · Sweat · Progress
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            Make every workout count.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-[#5D6D61]">
            Record your activity, estimate calories burned, and keep your
            fitness progress moving forward.
          </p>
        </div>

        <div className="flex min-h-56 items-center justify-center bg-[#E5EDE5] p-6">
          <div className="w-full rounded-2xl border border-[#D1DDD1] bg-white/70 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#9B7834]">
              Your next step
            </p>
            <p className="mt-3 text-2xl font-bold">Show up for yourself.</p>
            <p className="mt-2 text-sm text-[#5D6D61]">
              Every logged session is progress.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E6DE] bg-white p-5">
          <p className="text-sm text-[#718075]">Total workout time</p>
          <p className="mt-2 text-3xl font-bold">
            {totals.minutes.toLocaleString()}{" "}
            <span className="text-base font-medium">min</span>
          </p>
        </div>
        <div className="rounded-2xl border border-[#E2E6DE] bg-white p-5">
          <p className="text-sm text-[#718075]">Estimated calories burned</p>
          <p className="mt-2 text-3xl font-bold">
            {Math.round(totals.calories).toLocaleString()}{" "}
            <span className="text-base font-medium">kcal</span>
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E2E6DE] bg-white p-6 shadow-sm md:p-8"
        >
          <h2 className="text-xl font-bold">Log a workout</h2>
          <p className="mt-1 text-sm text-[#718075]">
            Enter your activity details to estimate calories burned.
          </p>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium">Activity</span>
            <select
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="w-full rounded-xl border border-[#D9E0D8] bg-white p-3 outline-none focus:border-[#244A3A]"
            >
              {activities.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {activity === "other" && (
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium">
                Activity name
              </span>
              <input
                type="text"
                value={customActivity}
                onChange={(event) => setCustomActivity(event.target.value)}
                placeholder="e.g. Dancing"
                required
                className="w-full rounded-xl border border-[#D9E0D8] p-3 outline-none focus:border-[#244A3A]"
              />
            </label>
          )}

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium">Intensity</span>
            <select
              value={intensity}
              onChange={(event) => setIntensity(event.target.value)}
              className="w-full rounded-xl border border-[#D9E0D8] bg-white p-3 outline-none focus:border-[#244A3A]"
            >
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="vigorous">Vigorous</option>
            </select>
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Duration (minutes)
              </span>
              <input
                type="number"
                min="1"
                max="600"
                required
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                placeholder="e.g. 30"
                className="w-full rounded-xl border border-[#D9E0D8] p-3 outline-none focus:border-[#244A3A]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Weight (kg)
              </span>
              <input
                type="number"
                min="1"
                max="500"
                step="0.1"
                required
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                placeholder="e.g. 65"
                className="w-full rounded-xl border border-[#D9E0D8] p-3 outline-none focus:border-[#244A3A]"
              />
            </label>
          </div>

          <p className="mt-2 text-xs text-[#718075]">
            Enter your weight for this workout.
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="mt-4 rounded-xl bg-[#E5EDE5] p-3 text-sm text-[#244A3A]">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-[#244A3A] px-5 py-3 font-semibold text-white transition hover:bg-[#19382B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving workout..." : "Save workout"}
          </button>
        </form>

        <section className="rounded-3xl border border-[#E2E6DE] bg-white p-6 shadow-sm md:p-8">
          <div>
            <h2 className="text-xl font-bold">Workout history</h2>
            <p className="mt-1 text-sm text-[#718075]">
              Your saved activities and estimated calories.
            </p>
          </div>

          {historyLoading ? (
            <p className="mt-6 rounded-2xl bg-[#F5F2E9] p-6 text-center text-sm text-[#718075]">
              Loading your workouts...
            </p>
          ) : workouts.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-[#F5F2E9] p-6 text-center text-sm text-[#718075]">
              No workouts saved yet. Add your first activity!
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {workouts.map((workout, index) => (
                <article
                  key={workout._id || `${workout.date || "workout"}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#F5F2E9] p-4"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold capitalize">
                      {getActivityName(workout)}
                    </h3>
                    <p className="mt-1 text-sm text-[#718075]">
                      {workout.durationMinutes || 0} min
                      {workout.date
                        ? ` · ${new Date(workout.date).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-[#9B7834]">
                    {Math.round(Number(workout.caloriesBurned || 0))} kcal
                  </p>
                </article>
              ))}
            </div>
          )}

          {!historyLoading && (
            <button
              type="button"
              onClick={loadWorkouts}
              className="mt-5 text-sm font-semibold text-[#244A3A] underline underline-offset-4"
            >
              Refresh history
            </button>
          )}
        </section>
      </section>
    </main>
  );
}