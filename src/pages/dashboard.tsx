export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">User Records</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example data */}
          <tr>
            <td className="py-2 px-4 border-b">John Doe</td>
            <td className="py-2 px-4 border-b">john@example.com</td>
            <td className="py-2 px-4 border-b">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
