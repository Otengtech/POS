import { useState } from "react";
import { createSuperAdmin } from "../../api/adminApi";

function CreateSuperAdmin() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createSuperAdmin(form);
      alert("Super Admin Created");
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="First Name"
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />

      <input
        placeholder="Last Name"
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button>Create Super Admin</button>
    </form>
  );
}

export default CreateSuperAdmin;