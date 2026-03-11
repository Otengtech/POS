import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { adminApi } from "../../api/admins";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../../common/Loader";
import ConfirmDialog from "../../common/ConfirmDialog";

import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  FingerPrintIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

const AdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deactivateDialog, setDeactivateDialog] = useState(false);

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdmin(id);
      setAdmin(res.data.admin || res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch admin");
      toast.error("Failed to fetch admin details");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async () => {
    try {
      await adminApi.deleteAdmin(id);
      toast.success("Admin deleted");
      navigate("/admins");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleteDialog(false);
    }
  };

  const deactivateAdmin = async () => {
    try {
      await adminApi.deactivateAdmin(id);
      toast.success("Admin deactivated");
      fetchAdmin();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Deactivate failed");
    } finally {
      setDeactivateDialog(false);
    }
  };

  const activateAdmin = async () => {
    try {
      await adminApi.activateAdmin(id);
      toast.success("Admin activated");
      fetchAdmin();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Activation failed");
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-GH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "N/A";

  const initials = `${admin?.firstName?.[0] || ""}${admin?.lastName?.[0] || ""}`;

  const roleBadge = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Loader size="large" text="Loading admin..." />
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="p-8">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h2 className="text-red-600 font-semibold mb-3">Admin Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>

          <button
            onClick={() => navigate("/admins")}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <button
            onClick={() => navigate("/admins")}
            className="flex items-center text-sm text-gray-500 mb-3"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to admins
          </button>

          <h1 className="text-3xl font-semibold flex items-center">
            <ShieldCheckIcon className="h-7 w-7 mr-3 text-green-600" />
            Admin Details
          </h1>
        </div>

        <div className="flex gap-3">

          {/* <Link
            to={`/admins/${id}/edit`}
            className="flex items-center px-4 py-2 border rounded-lg"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link> */}

          {admin.isActive ? (
            <button
              onClick={() => setDeactivateDialog(true)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg"
              disabled={user?.id === admin._id}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              Deactivate
            </button>
          ) : (
            <button
              onClick={activateAdmin}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full"
            >
              <CheckBadgeIcon className="h-4 w-4 mr-2" />
              Activate
            </button>
          )}

          {user?.role === "super_admin" && user?.id !== admin._id && (
            <button
              onClick={() => setDeleteDialog(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* PROFILE */}
        <div className="bg-white rounded-xl shadow border p-6 text-center">

          {admin.profileImage ? (
            <img
              src={admin.profileImage}
              alt="avatar"
              className="h-28 w-28 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="h-28 w-28 text-white rounded-full bg-black flex items-center justify-center mx-auto text-3xl font-bold">
              {initials}
            </div>
          )}

          <h2 className="mt-4 text-xl font-semibold">
            {admin.firstName} {admin.lastName}
          </h2>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${roleBadge(
              admin.role
            )}`}
          >
            {admin.role}
          </span>

          <div className="mt-6 text-left space-y-3 text-sm">

            <p className="flex items-center">
              <FingerPrintIcon className="h-4 w-4 mr-2" />
              {admin._id}
            </p>

            <p className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Created: {formatDate(admin.createdAt)}
            </p>

            <p className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Last Login: {formatDate(admin.lastLoginAt)}
            </p>

            {admin.lastLoginIp && (
              <p className="flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                {admin.lastLoginIp}
              </p>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-2 space-y-6">

          {/* PERSONAL */}
          <div className="bg-white rounded-xl shadow border p-6">

            <h3 className="font-semibold mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-gray-500">First Name</p>
                <p>{admin.firstName}</p>
              </div>

              <div>
                <p className="text-gray-500">Last Name</p>
                <p>{admin.lastName}</p>
              </div>

              <div>
                <p className="text-gray-500 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  Email
                </p>
                <p>{admin.email}</p>
              </div>

              <div>
                <p className="text-gray-500 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  Phone
                </p>
                <p>{admin.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="bg-white rounded-xl shadow border p-6">

            <h3 className="font-semibold mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Account Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-gray-500">Created</p>
                <p>{formatDate(admin.createdAt)}</p>
              </div>

              <div>
                <p className="text-gray-500">Updated</p>
                <p>{formatDate(admin.updatedAt)}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <p>{admin.isActive ? "Active" : "Inactive"}</p>
              </div>

              <div>
                <p className="text-gray-500">Verified</p>
                <p>{admin.isVerified ? "Yes" : "No"}</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={deleteAdmin}
        title="Delete Admin"
        message={`Delete ${admin.firstName} ${admin.lastName}?`}
        type="danger"
      />

      {/* DEACTIVATE DIALOG */}
      <ConfirmDialog
        isOpen={deactivateDialog}
        onClose={() => setDeactivateDialog(false)}
        onConfirm={deactivateAdmin}
        title="Deactivate Admin"
        message={`Deactivate ${admin.firstName} ${admin.lastName}?`}
        type="warning"
      />
    </div>
  );
};

export default AdminDetails;