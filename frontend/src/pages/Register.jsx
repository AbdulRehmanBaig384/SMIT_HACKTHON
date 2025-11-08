import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Heart, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const { t, isUrdu } = useLanguage()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert(isUrdu ? 'Passwords match nahi kar rahe' : 'Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      alert(isUrdu ? 'Password kam se kam 6 characters ka hona chahiye' : 'Password must be at least 6 characters')
      return
    }
    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        language: formData.language
      })
      
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner text={isUrdu ? 'Account ban raha hai...' : 'Creating account...'} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-primary-200/30 rounded-full blur-xl"/>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200/30 rounded-full blur-xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center" >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isUrdu ? 'HealthMate Join Karein!' : 'Join HealthMate!'}
          </h2>
          <p className="text-gray-600">
            {isUrdu 
              ? 'Apna free account banayein aur health journey start karein'
              : 'Create your free account and start your health journey'
            }
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input id="name" name="name" type="text" autoComplete="name" required value={formData.name} onChange={handleChange}
                  className="input-primary pl-10" placeholder={isUrdu ? 'Apna naam enter karein' : 'Enter your full name'} />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" required value={formData.email}
                  onChange={handleChange} className="input-primary pl-10" placeholder={isUrdu ? 'apna@email.com' : 'your@email.com'} />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                {t('language')}
              </label>
              <select id="language" name="language" value={formData.language} onChange={handleChange} className="input-primary" >
                <option value="en">English</option>
                <option value="ur">Roman Urdu</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password}
                  onChange={handleChange} className="input-primary pl-10 pr-10"  placeholder={isUrdu ? 'Password enter karein' : 'Enter your password'} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password"  required value={formData.confirmPassword}
                  onChange={handleChange} className="input-primary pl-10 pr-10"
                  placeholder={isUrdu ? 'Password confirm karein' : 'Confirm your password'} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                {isUrdu 
                  ? 'Main Terms of Service aur Privacy Policy se agree karta hun'
                  : 'I agree to the Terms of Service and Privacy Policy'
                }
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary flex items-center justify-center space-x-2 group">
              <span>{isUrdu ? 'Account Banayein' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isUrdu ? 'Ya' : 'Or'}
                </span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors" >
                {t('signIn')}
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-4 bg-green-50 border border-green-200"  >
          <h3 className="text-sm font-medium text-green-800 mb-2">
            {isUrdu ? 'Free Account Benefits:' : 'Free Account Benefits:'}
          </h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• {isUrdu ? 'Unlimited report uploads' : 'Unlimited report uploads'}</li>
            <li>• {isUrdu ? 'AI-powered analysis' : 'AI-powered analysis'}</li>
            <li>• {isUrdu ? 'Vitals tracking' : 'Vitals tracking'}</li>
            <li>• {isUrdu ? 'Health tips aur recommendations' : 'Health tips and recommendations'}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
export default Register
