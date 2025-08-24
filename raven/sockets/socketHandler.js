
import { useSocket } from '../hooks/useSocket';


export default function SocketHandler({ userId }) {
  useSocket(userId);
  return null; 
}
