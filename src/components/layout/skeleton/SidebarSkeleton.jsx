// Lucide icons
import { Users  } from 'lucide-react';

const SidebarSkeleton = () => {
  return (
    <div className='bg-base-100 rounded-lg h-full'>
        <div className='p-4'>
            <div className='flex items-center gap-2'>
                <Users />   
                <div className='font-bold'>Contacts</div>
            </div>
            <div className='flex items-center mt-3 gap-2'>
                <input type="checkbox" className="checkbox checkbox-sm"/>
                <div className='text-sm'>Show online only <span className='text-[10px] text-base-content/60'>(0 online)</span></div>
            </div>
        </div>

        <div className='border-t border-t-base-300 py-6'>
        {Array(8).fill(null).map((_, i)=> (
            <button key={i} type='button' className='flex items-center gap-2 px-4 py-3 cursor-pointer select-none hover:bg-base-200 w-full'>
                <div className='relative'>
                    <div className='size-10 rounded-full skeleton'/>
                </div>
                <div>
                    <div className='h-5 w-30 skeleton mb-1'></div>
                    <div className='h-3 w-15 skeleton'></div>
                </div>
            </button>
        ))}
        </div>
    </div>
        
  )
}

export default SidebarSkeleton