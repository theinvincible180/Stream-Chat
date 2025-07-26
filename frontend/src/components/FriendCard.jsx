import React from 'react'
import { LOCATION_TO_FLAG } from '../constants/index.js';
import { Link } from "react-router";

const FriendCard = ({friend}) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLocationFlag(friend.location)}
            Location: {friend.location}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full">
            Message
          </Link>
      </div>
    </div>
  );
}

export default FriendCard;

function getLocationFlag(location){
    if(!location) return null;

    const locLower = location.toLowerCase();
    const countryCode = LOCATION_TO_FLAG[locLower];

    if(countryCode){
        return (
          <
            img src={`https://flagcdn.com/24x18/${countryCode}.png`} 
            alt={`${locLower} flag`}
            className="h-3 mr-1 inline-block"
          />
        );
    }
    return null;
}