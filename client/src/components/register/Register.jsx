import React, { useState } from "react";
import axios from "axios";
import StyledToast from "../../notifications/StyledToast.jsx";
import { useNavigate } from "react-router-dom";

export const Register = () => {


  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    // console.log("login called");

    const user = { email, password, username };

    try {
      const response = await axios.post(
        `${backendUrl}/user/register-user`,
        user,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setBtnLoading(false);
        console.log("Register successful:", response.data);
        StyledToast.success(response.data.message);
        navigate("/login", { replace: true }); // Redirect to the login page after successful registration
      } else {
        StyledToast.error(response.data.message);
        console.error("Register failed:", response.data.message);
        setBtnLoading(false);
      }
      // Redirect or perform any other action after successful login
    } catch (error) {
      console.error("Register failed:", error);
      StyledToast.error("Register failed. Please check your credentials.");
      setBtnLoading(false);
    }
  };

  return (
    <div className="bg-[url('/img/login-(Community).png')] bg-cover bg-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="flex flex-col align-center justify-center h-screen p-4"
      >
        <div className="flex flex-col gap-4 m-auto w-[400px] h-[400px]">
          <h2 className=" login-h2 font-roboto text-4xl font-extrabold mb-10">
            Register
          </h2>          
          <div className="flex flex-col gap-10 mb-10 mt-5">
            <div className="flex flex-col gap-2">
              {/* <label className='text-xl '>Email</label> */}
              <input
                className="border-b-1 pb-2 outline-none"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              {/* <label className='text-xl '>Email</label> */}
              <input
                className="border-b-1 pb-2 outline-none"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              {/* <label htmlFor="">Password</label> */}
              <input
                className="border-b-1 pb-2 outline-none"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-[400px] px-2 py-2 mx-auto bg-[#4044ED] text-xl text-white flex items-center justify-center gap-2"
            type="submit"
            disabled={btnLoading} // optional: disables button when loading
          >
            {btnLoading ? <div className="btn-loader"></div> : "Register"}
          </button>
          <h6 className="mt-10">have Account? <a className="text-blue-400" href="/login">Login</a></h6>

        </div>
      </form>
    </div>
  );
};
