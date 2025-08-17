import React, { useState } from 'react'
import axios from 'axios'

interface QuestionResult {
  question_no: number
  correct_answer?: string | null
  student_answer?: string | null
  status: string
}

interface EvaluateResponse {
  student_id: string
  total_score: number
  report_id: string
  results: QuestionResult[]
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function App() {
  const [omrFile, setOmrFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<EvaluateResponse | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setData(null)
    if (!omrFile || !keyFile) {
      setError('Please upload OMR image and answer key')
      return
    }
    const form = new FormData()
    form.append('omr_image', omrFile)
    form.append('answer_key', keyFile)
    try {
      setLoading(true)
      const res = await axios.post<EvaluateResponse>(`${API_BASE}/evaluate`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setData(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to evaluate')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async () => {
    if (!data) return
    const url = `${API_BASE}/report/${data.report_id}`
    const res = await axios.get(url, { responseType: 'blob' })
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `omr_report_${data.report_id}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">OMR Sheet Evaluator</h1>

        <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Upload OMR Image (JPG/PNG)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setOmrFile(e.target.files?.[0] || null)}
              className="block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Answer Key (CSV or JSON)</label>
            <input
              type="file"
              accept=".csv,application/json"
              onChange={(e) => setKeyFile(e.target.files?.[0] || null)}
              className="block w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Evaluating…' : 'Evaluate Sheet'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 text-red-800 bg-red-100 rounded">{error}</div>
        )}

        {data && (
          <div className="mt-6 bg-white rounded shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Student ID: {data.student_id}</div>
                  <div>Total Score: {data.total_score}</div>
                </div>
                <button
                  onClick={downloadReport}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download Excel Report
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-3 py-2">Question No</th>
                      <th className="px-3 py-2">Correct Answer</th>
                      <th className="px-3 py-2">Student Answer</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((r) => (
                      <tr key={r.question_no} className="border-b">
                        <td className="px-3 py-2">{r.question_no}</td>
                        <td className="px-3 py-2">{r.correct_answer ?? '-'}</td>
                        <td className="px-3 py-2">{r.student_answer ?? '-'}</td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              r.status === 'Correct'
                                ? 'text-green-700'
                                : r.status === 'Wrong'
                                ? 'text-red-700'
                                : 'text-gray-600'
                            }
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}