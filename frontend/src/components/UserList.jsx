import Avatar from "@mui/material/Avatar";

export default function UserList({ users }) {
  const getInitial = (name) => name?.charAt(0).toUpperCase() || "";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Online Users ({users.length})</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="flex items-center gap-2 mb-3">
            <Avatar className="bg-green-500 text-white">
              {getInitial(user)}
            </Avatar>
            <span className="text-gray-800">{user}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
