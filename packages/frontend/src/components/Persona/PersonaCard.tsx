interface PersonaCardProps {
  id: string;
  name: string;
  age: number;
  occupation: string;
  background: string;
}

export default function PersonaCard({
  id,
  name,
  age,
  occupation,
  background,
}: PersonaCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <span className="text-sm text-gray-500">{age}歳</span>
      </div>

      <p className="text-gray-600 mb-2">{occupation}</p>
      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{background}</p>

      <div className="flex space-x-2">
        <button
          onClick={() => (window.location.href = `/personas/${id}`)}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          対話する
        </button>
        <button
          onClick={() => (window.location.href = `/personas/${id}/edit`)}
          className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
        >
          編集
        </button>
      </div>
    </div>
  );
}
