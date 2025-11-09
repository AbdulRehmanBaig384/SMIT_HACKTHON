import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Calendar, Download, Brain, AlertCircle, CheckCircle, ArrowLeft, MessageSquare,Utensils, Home} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'

const ReportDetail = () => {
  const { id } = useParams()
  const { t, isUrdu } = useLanguage()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/reports/${id}`)
      setReport(response.data.report)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text={isUrdu ? 'Report load ho raha hai...' : 'Loading report...'} />
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isUrdu ? 'Report nahi mila' : 'Report not found'}
          </h1>
          <Link to="/reports" className="btn-primary">
            {isUrdu ? 'Reports pe wapas jayein' : 'Back to Reports'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <Link to="/reports" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isUrdu ? 'Reports pe wapas' : 'Back to Reports'}
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {report.title}
              </h1>
              <p className="text-lg text-gray-600 capitalize">
                {report.type.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={() => window.open(report.fileUrl, '_blank')}
              className="btn-primary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>{isUrdu ? 'Download' : 'Download'}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isUrdu ? 'Report Information' : 'Report Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {isUrdu ? 'Report Date' : 'Report Date'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {isUrdu ? 'File Type' : 'File Type'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {report.fileType}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Analysis */}
            {report.aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isUrdu ? 'AI Analysis' : 'AI Analysis'}
                  </h2>
                  <div className="ml-auto">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {report.aiAnalysis.confidence}% {isUrdu ? 'Confidence' : 'Confidence'}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {isUrdu ? 'Summary' : 'Summary'}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {isUrdu ? report.aiAnalysis.summary.urdu : report.aiAnalysis.summary.english}
                    </p>
                  </div>
                </div>

                {/* Abnormal Values */}
                {report.aiAnalysis.abnormalValues && report.aiAnalysis.abnormalValues.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {isUrdu ? 'Abnormal Values' : 'Abnormal Values'}
                    </h3>
                    <div className="space-y-3">
                      {report.aiAnalysis.abnormalValues.map((value, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-orange-900">
                              {value.parameter}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              value.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              value.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {value.severity}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-orange-700 font-medium">
                                {isUrdu ? 'Current Value:' : 'Current Value:'}
                              </span>
                              <span className="ml-2 text-orange-900">{value.value}</span>
                            </div>
                            <div>
                              <span className="text-orange-700 font-medium">
                                {isUrdu ? 'Normal Range:' : 'Normal Range:'}
                              </span>
                              <span className="ml-2 text-orange-900">{value.normalRange}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctor Questions */}
                {report.aiAnalysis.doctorQuestions && report.aiAnalysis.doctorQuestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                      {isUrdu ? 'Questions for Doctor' : 'Questions for Doctor'}
                    </h3>
                    <div className="space-y-2">
                      {report.aiAnalysis.doctorQuestions.map((question, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-900">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diet Suggestions */}
                {report.aiAnalysis.dietSuggestions && report.aiAnalysis.dietSuggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-green-600" />
                      {isUrdu ? 'Diet Suggestions' : 'Diet Suggestions'}
                    </h3>
                    <div className="space-y-2">
                      {report.aiAnalysis.dietSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-900">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Home Remedies */}
                {report.aiAnalysis.homeRemedies && report.aiAnalysis.homeRemedies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Home className="w-5 h-5 mr-2 text-purple-600" />
                      {isUrdu ? 'Home Remedies' : 'Home Remedies'}
                    </h3>
                    <div className="space-y-2">
                      {report.aiAnalysis.homeRemedies.map((remedy, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-purple-900">{remedy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isUrdu ? 'Analysis Status' : 'Analysis Status'}
              </h3>
              <div className="flex items-center space-x-3">
                {report.isAnalyzed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {report.isAnalyzed 
                      ? (isUrdu ? 'Analysis Complete' : 'Analysis Complete')
                      : (isUrdu ? 'Analysis Pending' : 'Analysis Pending')
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 bg-yellow-50 border border-yellow-200"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetail
