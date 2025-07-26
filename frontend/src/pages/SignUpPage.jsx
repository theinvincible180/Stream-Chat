import React, { use } from "react";
import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { signUp } from "../lib/api.js";
import useSignUp from "../hooks/useSignUp.js";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  // const queryClient = useQueryClient();

  // const { mutate:signUpMutation, isPending, error } = useMutation({
  //   mutationFn: signUp,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const {isPending, error, signUpMutation}=useSignUp();

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };

  return (
    <div
      className="flex items-center justify-center p-4 sm:p-6 md:p-8 max-h-screen"
      data-theme="forest"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100
      rounded-xl shadow-md overflow-hidden"
      >
        {/* Left Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 flex flex-col overflow-y-auto">
          <div className="mb-3 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-8 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Stream Chat
            </span>
          </div>

          {/*Error message if any*/}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="w-full">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p className="text-sm opacity-70">
                  Join Stream Chat and start your Adventure!!!
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Full Name"
                    className="input input-bordered w-full"
                    value={signUpData.fullName}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="input input-bordered w-full"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                {/* Agreement */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm" />
                    <span className="text-xs">
                      I agree to the{" "}
                      <span className="text-primary hover:underline">
                        terms of service
                      </span>{" "}
                      and{" "}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit">
                {isPending ? (
                  <>
                  <span className="loading loading-bars loading-lg">
                    Loading...
                  </span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-2">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center p-4">
          <div className="max-w-xs">
            <img
              src="/Communications.png"
              alt="Communication Illustration"
              className="w-full h-auto"
            />
            <div className="text-center space-y-2 mt-4">
              <h2 className="text-lg font-semibold">
                Connect with people Worldwide!
              </h2>
              <p className="opacity-70 text-sm">
                Meet new people, share ideas, and make new friends on Stream
                Chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
