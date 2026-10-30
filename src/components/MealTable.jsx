const badge = {
  breakfast: 'bg-yellow-100 text-yellow-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-purple-100 text-purple-700',
  snack: 'bg-pink-100 text-pink-700',
}

export default function MealTable({ meals, onDelete }) {
  if (meals.length === 0) {
    return (
      <p className="py-8 text-center text-slate-500">
        Aaj abhi koi meal add nahi hua. Upar se add karo.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 font-semibold">
            <th className="p-2">Food</th>
            <th className="p-2">Meal</th>
            <th className="p-2">Qty</th>
            <th className="p-2">kcal</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {meals.map((m) => (
            <tr key={m.id} className="border-b border-slate-100">
              <td className="p-2">{m.foodName}</td>
              <td className="p-2">
                <span className={`rounded-full px-2 py-1 text-xs capitalize ${badge[m.category]}`}>
                  {m.category}
                </span>
              </td>
              <td className="p-2">{m.quantity}</td>
              <td className="p-2">{m.calories}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => onDelete(m.id)}
                  className="rounded-full bg-brand-pink px-3 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}