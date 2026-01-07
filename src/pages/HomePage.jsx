//Components
import Sidebar from '../components/layout/Sidebar';
import ChatNoContent from '../components/layout/ChatNoContent';
import Chat from '../components/layout/Chat';

//Store
import { useChatStore } from '../store/useChatStore';

const HomePage = () => {
  const { selectedUser, isMessagesLoading } = useChatStore();

  return (
    <div className='flex-1 grid grid-cols-12 bg-base-200 px-3 py-3 sm:px-10 lg:px-15 gap-3'>
      {(isMessagesLoading || selectedUser) && (
        <div className="fixed top-17 inset-0 z-50 md:hidden mx-3 my-3 sm:mx-10">
          <Chat />
        </div>
      )}
      <div className='col-span-12 md:col-span-5 lg:col-span-3'>
        <Sidebar />
      </div>
      <div className='hidden md:block md:col-span-7 lg:col-span-9  h-[calc(100vh-5.4rem)]'>
        {selectedUser ? <Chat /> : <ChatNoContent />}
      </div>
    </div>
  )
}

export default HomePage