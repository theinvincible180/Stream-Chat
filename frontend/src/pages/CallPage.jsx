import React from 'react'
import { useParams } from 'react-router';
import { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';

const CallPage = () => {
  const {id : callId} = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const {authUser, isLoading} = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    
    enabled: !!authUser, // only run if authUser is available
  });



  return (
    <div>CallPage</div>
  )
}

export default CallPage