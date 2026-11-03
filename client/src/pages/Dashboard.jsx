
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COLORS = {
  green: "#244A3A",
  greenLight: "#E5EDE5",
  ivory: "#F5F2E9",
  gold: "#D6AC55",
  goldLight: "#F5EBD0",
  text: "#283B31",
  muted: "#818477",
  border: "#E6E2D5",
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

function StatCard({ icon, label, value, note, accent }) {
  return (
    <article
      className="rounded-3xl border bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{ borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
          style={{ backgroundColor: accent, color: COLORS.green }}
        >
          {icon}
        </div>

        <span className="text-xs font-medium text-[#929486]">
          {note}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#818477]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-[#244A3A]">
        {value}
      </p>
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkouts() {
      try {
        const token = localStorage.getItem("fitastic_token");

        const response = await fetch(`${API_URL}/workouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load workouts."
          );
        }

        if (!cancelled) {
          setWorkouts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Could not connect to the server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date();

  const todayWorkouts = useMemo(() => {
    const todayString = today.toDateString();

    return workouts.filter((workout) => {
      const date = new Date(workout.date);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toDateString() === todayString
      );
    });
  }, [workouts, today.toDateString()]);

  const caloriesBurned = todayWorkouts.reduce(
    (total, workout) =>
      total + Number(workout.caloriesBurned || 0),
    0
  );

  const minutes = todayWorkouts.reduce(
    (total, workout) =>
      total + Number(workout.durationMinutes || 0),
    0
  );

  const recentWorkouts = [...workouts]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);

  const dateLabel = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cards = [
    {
      icon: "🔥",
      label: "Calories burned",
      value: `${formatNumber(caloriesBurned)} kcal`,
      note: "Today",
      accent: COLORS.goldLight,
    },
    {
      icon: "◷",
      label: "Workout duration",
      value: `${formatNumber(minutes)} min`,
      note: "Today",
      accent: COLORS.greenLight,
    },
    {
      icon: "✦",
      label: "Workouts logged",
      value: formatNumber(workouts.length),
      note: "All time",
      accent: "#EEE8F3",
    },
    {
      icon: "🥗",
      label: "Calories consumed",
      value: "—",
      note: "Not connected",
      accent: "#F4E9DD",
    },
  ];

  return (
    <main
      className="min-h-screen space-y-8 rounded-3xl p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: COLORS.ivory }}
    >
      {/* Welcome section */}
      <section
        className="relative overflow-hidden rounded-[2rem] p-6 text-white shadow-sm sm:p-9"
        style={{
          background:
            "linear-gradient(115deg, #244A3A 0%, #315C48 65%, #45664B 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.06]"
        />

        <div
          className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full"
          style={{ backgroundColor: "rgba(214,172,85,0.10)" }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C58E]">
              Your daily wellness
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome{user?.name ? `, ${user.name}` : " back"}!
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
              Every little effort counts. Keep showing up for
              yourself, one day at a time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/workouts"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-[#244A3A] transition hover:brightness-105"
                style={{ backgroundColor: COLORS.gold }}
              >
                + Log a workout
              </Link>

              <Link
                to="/progress"
                className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                View progress →
              </Link>
            </div>
          </div>

          <div className="w-fit rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs text-white/60">
              TODAY'S DATE
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {dateLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#929486]">
              Your activity
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#244A3A]">
              Today's overview
            </h2>
          </div>

          <span className="text-xs font-medium text-[#818477]">
            {loading ? "Updating activity..." : "Your recorded data"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* Today's workout summary */}
      <section
        className="rounded-3xl border bg-white p-6 sm:p-7"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#929486]">
              Keep your momentum
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#244A3A]">
              Your movement today
            </h2>

            <p className="mt-2 text-sm text-[#818477]">
              {todayWorkouts.length > 0
                ? `You've completed ${todayWorkouts.length} workout${
                    todayWorkouts.length === 1 ? "" : "s"
                  } today. Great work!`
                : "Your next workout is a chance to make progress."}
            </p>
          </div>

          <div
            className="flex items-center gap-4 rounded-2xl p-4"
            style={{ backgroundColor: COLORS.goldLight }}
          >
            <div>
              <p className="text-xs font-medium text-[#8B7745]">
                TOTAL TIME
              </p>
              <p className="mt-1 text-2xl font-bold text-[#244A3A]">
                {formatNumber(minutes)}
                <span className="ml-1 text-sm font-medium">min</span>
              </p>
            </div>

            <div className="h-10 w-px bg-[#D6AC55]/50" />

            <div>
              <p className="text-xs font-medium text-[#8B7745]">
                CALORIES
              </p>
              <p className="mt-1 text-2xl font-bold text-[#244A3A]">
                {formatNumber(caloriesBurned)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent workouts */}
      <section
        className="overflow-hidden rounded-3xl border bg-white"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2D5] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#929486]">
              Your fitness journey
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#244A3A]">
              Recent workouts
            </h2>

            <p className="mt-1 text-sm text-[#818477]">
              Your latest recorded activities
            </p>
          </div>

          <Link
            to="/workouts"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#244A3A] transition hover:bg-[#E5EDE5]"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-[#F5F2E9]"
              />
            ))}
          </div>
        ) : recentWorkouts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5EDE5] text-2xl">
              🏃
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#244A3A]">
              Your journey starts here
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#818477]">
              Log your first workout and watch your activity
              and progress come together here.
            </p>

            <Link
              to="/workouts"
              className="mt-5 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: COLORS.green }}
            >
              Add your first workout
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EEECE3] px-6">
            {recentWorkouts.map((workout) => (
              <article
                key={workout._id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5EDE5] text-xl">
                    🏋️
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold capitalize text-[#244A3A]">
                      {workout.activity === "other"
                        ? workout.customActivity || "Other activity"
                        : workout.activity}
                    </p>

                    <p className="mt-1 text-sm text-[#818477]">
                      {new Date(workout.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      {" · "}
                      {workout.durationMinutes} min
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-xl px-3 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: COLORS.goldLight,
                    color: COLORS.green,
                  }}
                >
                  {formatNumber(workout.caloriesBurned)} kcal
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
