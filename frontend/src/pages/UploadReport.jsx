import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Calendar, AlertCircle,CheckCircle,X, Brain} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const UploadReport = () => {
  const { t, isUrdu } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    type: 'blood_test',
    reportDate: new Date().toISOString().split('T')[0]
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: selectedFile.name.split('.')[0]
        }))
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      toast.error(isUrdu ? 'Please file select karein' : 'Please select a file')
      return
    }

    setUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('title', formData.title)
      uploadData.append('type', formData.type)
      uploadData.append('reportDate', formData.reportDate)

      const response = await axios.post('/api/reports/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success(isUrdu ? 'Report successfully upload ho gaya!' : 'Report uploaded successfully!')
      navigate('/reports')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || (isUrdu ? 'Upload failed' : 'Upload failed'))
    } finally {
      setUploading(false)
    } }

  const reportTypes = [
    { value: 'blood_test', label: isUrdu ? 'Blood Test' : 'Blood Test' },
    { value: 'urine_test', label: isUrdu ? 'Urine Test' : 'Urine Test' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ecg', label: 'ECG' },
    { value: 'other', label: isUrdu ? 'Other' : 'Other' }
  ]

  if (uploading) {
    return <LoadingSpinner text={isUrdu ? 'Report upload ho raha hai...' : 'Uploading report...'} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isUrdu ? 'Medical Report Upload' : 'Upload Medical Report'}
          </h1>
          <p className="text-lg text-gray-600">
            {isUrdu 
              ? 'Apna medical report upload karein aur AI analysis paayein'
              : 'Upload your medical report and get AI analysis'
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8" >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isUrdu ? 'Report File' : 'Report File'}
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : file
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}>
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-green-700 font-medium">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm">
                      {isUrdu ? 'Remove' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? (isUrdu ? 'File drop karein' : 'Drop file here')
                        : (isUrdu ? 'File select karein ya drag & drop karein' : 'Select file or drag & drop')
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, PNG, JPG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Report Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {isUrdu ? 'Report Title' : 'Report Title'}
              </label>
              <input type="text" id="title" name="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-primary" placeholder={isUrdu ? 'Report ka naam enter karein' : 'Enter report title'}
              />
            </div>

            {/* Report Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                {isUrdu ? 'Report Type' : 'Report Type'}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-primary"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Date */}
            <div>
              <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-2">
                {isUrdu ? 'Report Date' : 'Report Date'}
              </label>
              <input
                type="date"
                id="reportDate"
                name="reportDate"
                required
                value={formData.reportDate}
                onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                className="input-primary"
              />
            </div>

            {/* AI Analysis Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    {isUrdu ? 'AI Analysis' : 'AI Analysis'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isUrdu 
                      ? 'Upload ke baad Gemini AI automatically report analyze karega aur summary, abnormal values, aur recommendations dega.'
                      : 'After upload, Gemini AI will automatically analyze the report and provide summary, abnormal values, and recommendations.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-900 mb-1">
                    {isUrdu ? 'Important Notice' : 'Important Notice'}
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {t('disclaimer')}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/reports')}
                className="btn-ghost flex-1"
              >
                {isUrdu ? 'Cancel' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!file}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>{isUrdu ? 'Upload & Analyze' : 'Upload & Analyze'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default UploadReport
