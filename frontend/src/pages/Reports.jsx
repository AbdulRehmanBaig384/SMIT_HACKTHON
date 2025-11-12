import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Upload, Calendar, Filter, Search, Eye, Download, Trash2, Plus, AlertCircle, CheckCircle, Clock, Brain } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'

const Reports = () => {
  const { t, isUrdu } = useLanguage()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/reports')
      setReports(response.data.reports || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm(isUrdu ? 'Kya aap is report ko delete karna chahte hain?' : 'Are you sure you want to delete this report?')) {
      return
    }

    try {
      await axios.delete(`/api/reports/${reportId}`)
      setReports(reports.filter(report => report._id !== reportId))
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || report.type === filterType
    return matchesSearch && matchesFilter
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.reportDate) - new Date(a.reportDate)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })
  const reportTypes = [
    { value: 'all', label: isUrdu ? 'Sab Reports' : 'All Reports' },
    { value: 'blood_test', label: isUrdu ? 'Blood Test' : 'Blood Test' },
    { value: 'urine_test', label: isUrdu ? 'Urine Test' : 'Urine Test' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ecg', label: 'ECG' },
    { value: 'other', label: isUrdu ? 'Other' : 'Other' }
  ]

  const getStatusIcon = (report) => {
    if (report.isAnalyzed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <Clock className="w-5 h-5 text-orange-500" />
  }
  const getStatusText = (report) => {
    if (report.isAnalyzed) {
      return isUrdu ? 'Analyzed' : 'Analyzed'
    }
    return isUrdu ? 'Processing' : 'Processing'
  }

  if (loading) {
    return <LoadingSpinner text={isUrdu ? 'Reports load ho rahe hain...' : 'Loading reports...'} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8" >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {isUrdu ? 'Medical Reports' : 'Medical Reports'}
              </h1>
              <p className="text-lg text-gray-600">
                {isUrdu 
                  ? 'Apne sabhi medical reports manage karein'
                  : 'Manage all your medical reports'
                }
              </p>
            </div>
            <Link
              to="/reports/upload"
              className="btn-primary mt-4 md:mt-0 flex items-center space-x-2" >
              <Plus className="w-5 h-5" />
              <span>{isUrdu ? 'New Report Upload' : 'Upload New Report'}</span>
            </Link>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8" >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder={isUrdu ? 'Reports search karein...' : 'Search reports...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary pl-10" />
            </div>

            {/* Filter by Type */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-primary pl-10">
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Sort */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-primary pl-10">
                <option value="date">{isUrdu ? 'Date se sort' : 'Sort by Date'}</option>
                <option value="title">{isUrdu ? 'Name se sort' : 'Sort by Name'}</option>
                <option value="type">{isUrdu ? 'Type se sort' : 'Sort by Type'}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Reports Grid */}
        {sortedReports.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
            {sortedReports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover p-6" >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {report.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(report)}
                  </div>
                </div>

                {/* Report Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {isUrdu ? 'Date:' : 'Date:'}
                    </span>
                    <span className="text-gray-900">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {isUrdu ? 'Status:' : 'Status:'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.isAnalyzed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {getStatusText(report)}
                    </span>
                  </div>

                  {report.aiAnalysis && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {isUrdu ? 'AI Confidence:' : 'AI Confidence:'}
                      </span>
                      <span className="text-gray-900">
                        {report.aiAnalysis.confidence}%
                      </span>
                    </div>
                  )}
                </div>

                {/* AI Analysis Preview */}
                {report.aiAnalysis && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {isUrdu ? 'AI Summary:' : 'AI Summary:'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {isUrdu ? report.aiAnalysis.summary.urdu : report.aiAnalysis.summary.english}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/reports/${report._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={isUrdu ? 'View Report' : 'View Report'} >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => window.open(report.fileUrl, '_blank')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={isUrdu ? 'Download' : 'Download'} >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={isUrdu ? 'Delete' : 'Delete'} >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {report.aiAnalysis && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{report.aiAnalysis.abnormalValues.length}</span>
                      <AlertCircle className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isUrdu ? 'Koi reports nahi hain' : 'No reports found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isUrdu 
                ? 'Apna pehla medical report upload karein aur AI analysis paayein'
                : 'Upload your first medical report and get AI analysis'
              }
            </p>
            <Link
              to="/reports/upload"
              className="btn-primary inline-flex items-center space-x-2" >
              <Upload className="w-5 h-5" />
              <span>{isUrdu ? 'Report Upload Karein' : 'Upload Report'}</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Reports
