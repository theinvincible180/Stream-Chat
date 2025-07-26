import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and : [
                {_id : {$ne : currentUserId}}, // exclude current user
                {_id : {$nin : currentUser.friends}}, // exclude friends
                {isOnboarded : true} // only include onboarded users
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommemdedUsers controller:", errorMessage);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).select("friends")
        .populate("friends", "fullName profilePic location");

        res.status(200).json(user.friends);

    } catch (error) {
        console.error("Error in getMyFriends controller:", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;
        // prevent sending request to yourself

        if(myId === recipientId){
            return res.status(400).json({message : "You cannot send a friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message : "Recipient not found"});
        }

        // check if recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message : "You are already friends with this user"});
        }

        // check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or : [
                {sender : myId , recipient : recipientId},
                {sender : recipientId, recipient : myId}
            ],
        });

        if(existingRequest){
            return res
            .status(400)
            .json({message : "Friend request already exists"});
        }

        // create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
      
    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function acceptFriendRequest(req, res) {
    
    try {
        // const {id : reqestId}= req.params;
        const id = req.params.id;
        const reqestId = id;
        
        const friendRequest = await FriendRequest.findById(reqestId);
        console.log("Accepting friend request" , friendRequest);

        if(!friendRequest){
            return res.status(404).json({message : "Friend request not found"});
        }

        // verify if the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message : "You are not authorized to accept this friend request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each other to friends list
        // addToSet ensures no duplicates

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender} 
        });

        res.status(200).json({message : "Friend request accepted"});
        
    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic location");

        const acceptedRequests = await FriendRequest.find({
            sender : req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingReqs:incomingRequests, acceptedReqs:acceptedRequests});
    } catch (error) {
        console.error("Error in getFriendRequests controller:", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic location");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({messgae : "Internal Server Error"});
    }
}