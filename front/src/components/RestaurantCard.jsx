const CAT_ICON = {
  '한식':'🍚','일식':'🍣','중식':'🥟','양식':'🥩','분식':'🍜',
  '치킨':'🍗','피자':'🍕','카페':'☕','술집':'🍺',
}

export default function RestaurantCard({ rest, showDist = false, onClick }) {
  const icon = CAT_ICON[rest.category] || '🍴'
  const stars = '★'.repeat(Math.round(rest.avg_rating || 0)).padEnd(5, '☆')

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer flex flex-col gap-2"
    >
      <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
        {icon}
      </div>
      <div>
        <span className="badge badge-primary mb-1">{rest.category || '기타'}</span>
        <p className="font-bold text-sm mt-1 truncate">{rest.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs tracking-widest">{stars}</span>
          <span className="text-xs text-gray-500">{rest.avg_rating?.toFixed(1)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 truncate">{rest.address}</p>
        {showDist && rest.dist != null && (
          <p className="text-xs text-green-600 font-semibold mt-1">🚶 {rest.dist}m</p>
        )}
      </div>
    </div>
  )
}
