// Lucide icons
import { MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// For routing
import { Link } from 'react-router-dom';

// Hooks
import { useState } from 'react';

// Store
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [hidePassword, setHidePassword] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }

  return (
    <div className='bg-base-200 flex-1 flex items-center justify-center'>

      <form onSubmit={handleSubmit} className='bg-base-300 rounded-lg p-6 space-y-8 md:w-[380px]'>
        <div className='flex items-center flex-col'>
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            <MessageSquare className="size-6 text-primary" />
          </div>
          <h1 className='text-2xl font-bold text-primary'>Welcome Back</h1>
          <div className='text-neutral-content/60 '>Sign in to your account</div>
        </div>
        <div className='space-y-5'>
          <div className='space-y-1'>
            <div className='text-sm text-base-content font-medium'>Email Address</div>
            <div className='relative'>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-2">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input value={formData.email} onChange={(e)=> setFormData({...formData, email: e.target.value})} type="text" placeholder="Enter your email" className="input pl-10 w-full" required/>
            </div>
          </div>
          <div className='space-y-1'>
            <div className='text-sm text-base-content font-medium'>Password</div>
            <div className='relative'>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-2">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input value={formData.password} onChange={(e)=> setFormData({...formData, password: e.target.value})} type={hidePassword ? 'password' : 'text'} placeholder="••••••••" className="input pl-10 w-full" required/>
              <button type='button' onClick={()=> setHidePassword(prev => !prev)} className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-2'>
                {hidePassword ? <Eye className='size-5 text-base-content/40'/> : <EyeOff className='size-5 text-base-content/40'/> }
              </button>
            </div>
          </div>
        </div>
        <button type='submit' className='btn btn-primary w-full'>
          {isLoggingIn ? 
            (
              <>
                <span className="loading loading-spinner"></span>
                Loading...
              </>
              
            ) :
            (
              'Sign in'
            )
          }
        </button>
        <div className='text-center'>
          <span className='text-neutral-content/60 mr-2'>Don't have an account?</span>
          <Link className='text-primary link link-primary' to={'/signup'}>Create account</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage