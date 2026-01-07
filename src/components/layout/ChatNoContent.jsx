import { MessageSquare } from 'lucide-react';

const ChatNoContent = () => {
  return (
    <div className='hidden md:flex flex-col justify-center items-center gap-5 h-full rounded-lg bg-base-100 p-5'>
        <div className='flex items-center justify-center size-16 bg-primary/10 rounded-2xl animate-bounce'>
            <MessageSquare className='text-primary size-8'/>
        </div>
        <div className='text-2xl font-bold'>Welcome to Chattrixx!</div>
        <div className='text-base-content/60 text-center'>Select a conversation from the sidebar to start chatting</div>
    </div>
  )
}

export default ChatNoContent