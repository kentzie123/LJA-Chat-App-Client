// Themes
import { THEMES } from "../constants/themes";

// Store
import { useThemeStore } from "../store/useThemeStore";

// Lucide icons
import { Send } from 'lucide-react';


const SettingsPage = () => {
  const { setTheme, theme } = useThemeStore();

  return (
    <div className='flex-1 py-4 bg-base-100'>
      <div className='mx-auto md:max-w-5xl px-3 lg:px-0 space-y-6'>
        <div>
          <div className='font-medium text-2x'>Theme</div>
          <div className='text-sm text-neutral-content/60'>Choose a theme for your chat interface</div>
        </div>

        <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-1'>
          {
            THEMES.map((t, index)=> (
              <button onClick={()=> setTheme(t)} key={index} type="button" className={`${theme === t ? 'bg-base-200' : 'hover:bg-base-200/60 '} space-y-2 p-2 rounded-lg cursor-pointer select-none`}>
                <div data-theme={t} className='flex gap-0.5 rounded-full bg-base-200 px-2 py-1'>
                  <div className='h-5 w-full bg-primary rounded-full'></div>
                  <div className='h-5 w-full bg-secondary rounded-full'></div>
                  <div className='h-5 w-full bg-accent rounded-full'></div>
                  <div className='h-5 w-full bg-neutral rounded-full'></div>
                </div>
                <div className='text-xs text-center font-medium'>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
              </button>
            ))
          }
        </div>

        <div className="space-y-2">
          <div className='font-medium text-lg'>Preview</div>
          <div className="flex justify-center w-full bg-base-200 rounded-lg p-8">
            {/* Chat */}
            <div className="bg-base-100 flex-grow md:max-w-lg rounded-lg">
              <div className="flex items-center gap-2 p-4">
                <div className="bg-primary text-primary-content grid place-items-center rounded-full size-8 text-lg font-medium">J</div>
                <div className="text-base-content">
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-base-content/60">Online</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 border-t border-t-base-300 border-b border-b-base-300">
                <div className="bg-base-200 p-3 space-y-1 rounded-lg w-fit max-w-80">
                  <div className="text-sm">Hey! How's it going?</div>
                  <div className="text-[10px] font-medium text-base-content/60">12:00 PM</div>
                </div>
                <div className="bg-primary p-3 space-y-1 rounded-lg w-fit max-w-80 self-end">
                  <div className="text-sm text-primary-content">I'm doing great! Just working on some new feature.</div>
                  <div className="text-[10px] font-medium text-right text-primary-content/60">12:02 PM</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4">
                <input value={'Type your message...'} readOnly type="text" placeholder="Type here" className="input flex-grow" />
                <button type="button" className="btn btn-primary">
                  <Send/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage