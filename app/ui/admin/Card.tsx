export default function Card({ title, value }: { title: string; value: string | number }) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        <p className="text-3xl font-semibold text-blue-500">{value}</p>
      </div>
    );
  }
  