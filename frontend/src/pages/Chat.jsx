import { useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom.jsx';

function Chat({ socket }) {
  const { chatId } = useParams();
  return <ChatRoom chatId={chatId} socket={socket} />;
}

export default Chat;