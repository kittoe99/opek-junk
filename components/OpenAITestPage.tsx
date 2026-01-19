import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const OpenAITestPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to OpenAI');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Failed to test OpenAI connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
            OpenAI Test
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            Test OpenAI Connection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify that OpenAI GPT-5.2 is properly connected to the application.
          </p>
        </div>

        {/* Test Form */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Test Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              placeholder="Enter a message to test the OpenAI connection (e.g., 'Hello, can you hear me?')"
            />
          </div>

          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test OpenAI Connection'
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Connection Failed</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure your OPENAI_API_KEY is set in the .env.local file
                </p>
              </div>
            </div>
          )}

          {/* Success Display */}
          {response && response.success && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Connection Successful!</h3>
                  <p className="text-green-700 text-sm">OpenAI API is working correctly</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <h3 className="font-black text-lg mb-3">AI Response:</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{response.reply}</p>
                
                <div className="pt-4 border-t-2 border-gray-200 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-bold">Model:</span>
                    <p className="text-gray-900">{response.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold">Tokens Used:</span>
                    <p className="text-gray-900">{response.usage?.total_tokens || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
          <h3 className="font-black text-lg mb-3">Setup Instructions:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Create a <code className="px-2 py-1 bg-white border border-gray-300 rounded">.env.local</code> file in the project root</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Add your OpenAI API key: <code className="px-2 py-1 bg-white border border-gray-300 rounded">OPENAI_API_KEY=sk-...</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Restart the development server</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Test the connection using the form above</span>
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
};
