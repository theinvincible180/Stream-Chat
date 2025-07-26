import React from 'react'
import useAuthUser from "../hooks/useAuthUser";
import { completeOnboarding } from '../lib/api';
import { CameraIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState } from "react";

const OnboardingPage = () => {
  const {authUser} = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName : authUser?.fullName || "",
    bio : authUser?.bio || "",
    location : authUser?.location || "",
    profilePic : authUser?.profilePic || "",
  });

  const {mutate : onboardingMutation, isPending} = useMutation({
    mutationFn : completeOnboarding,
    onSuccess : () => {
      toast.success("Onboarding Complete");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e) =>{
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10); 
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

    setFormState({...formState, profilePic: randomAvatar})
    toast.success("Avatar updated successfully");
  }


  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Onboarding
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/*Profile Pic Container*/}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/*Image Preview*/}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/*Generate random avatar button*/}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/*Full Name*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Enter Your Full Name"
              />
            </div>

            {/*Bio*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>

              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                placeholder="Tell others about yourself"
                className="textarea textarea-bordered h-24"
              />
            </div>

            {/*Location*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>

              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="locatioon"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/*Submit*/}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage