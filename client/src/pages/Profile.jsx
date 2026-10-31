import { useState } from "react";

const initialProfile = {
  name: "",
  email: "",
  heightCm: "",
  weightKg: "",
  age: "",
  gender: "",
  fitnessGoal: "",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // We'll connect this form to the profile API next.
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Your account
        </p>
        <h1 className="mt-1 text-3xl font-bold text-navy">My Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep your personal details and fitness goals up to date.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-navy">Personal details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the details you want to use in your fitness tracking.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Email
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Height (cm)
            <input
              name="heightCm"
              type="number"
              min="50"
              max="300"
              value={profile.heightCm}
              onChange={handleChange}
              placeholder="e.g. 165"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Weight (kg)
            <input
              name="weightKg"
              type="number"
              min="1"
              max="500"
              value={profile.weightKg}
              onChange={handleChange}
              placeholder="e.g. 60"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Age
            <input
              name="age"
              type="number"
              min="13"
              max="120"
              value={profile.age}
              onChange={handleChange}
              placeholder="Your age"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-slate-700">
            Gender
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </label>
        </div>

        <div>
          <label className="space-y-1 text-sm font-medium text-slate-700">
            Fitness goal
            <select
              name="fitnessGoal"
              value={profile.fitnessGoal}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Choose your goal</option>
              <option value="weight-loss">Weight loss</option>
              <option value="weight-gain">Weight gain</option>
              <option value="strength">Build strength</option>
              <option value="general-fitness">General fitness</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Save profile
          </button>
        </div>
      </form>
    </section>
  );
}