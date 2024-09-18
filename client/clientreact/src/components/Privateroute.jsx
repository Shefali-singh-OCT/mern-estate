import { Outlet,Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// usenavigate is a hook whereas navigate is a component

export default function Privateroute() {
    const currentUser = useSelector(state => state.user)
  return currentUser ? <Outlet /> : <Navigate to="/sign-up" />;
}
