import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { fetchAdminUsers, toggleUserBlock } from "../features/admin/adminSlice";

const ManageUsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Manage users" description="Block or unblock accounts, monitor roles, and keep access clean and safe." />
      <div className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-5 py-4 font-medium">{user.fullName}</td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4 capitalize">{user.role}</td>
                <td className="px-5 py-4">{user.isBlocked ? "Blocked" : "Active"}</td>
                <td className="px-5 py-4">
                  <button className="btn-secondary" onClick={() => dispatch(toggleUserBlock({ id: user._id, blocked: user.isBlocked }))}>
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
