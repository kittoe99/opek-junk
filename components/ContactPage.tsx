import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const subjectOptions = [
    'General Inquiry',
    'Residential Service',
    'Commercial Service',
    'Construction Debris',
    'E-Waste Recycling',
    'Property Cleanout',
    'Partnership Opportunity'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4">Message Received!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting OPEK. Our team will connect you with service providers within 30 minutes during business hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get quotes from local professionals. Available nationwide with same-day service in most areas.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <Phone size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-2">(303) 555-0199</p>
            <p className="text-gray-500 text-xs">Available 24/7</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <Mail size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-2">hello@opekjunk.com</p>
            <p className="text-gray-500 text-xs">Response within 1 hour</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <Clock size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Hours</h3>
            <p className="text-gray-600 text-sm mb-2">24/7 Availability</p>
            <p className="text-gray-500 text-xs">Same-day service</p>
          </div>
        </div>

        {/* Image Section */}
        <div className="my-12 max-w-5xl mx-auto">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src="/opek2.png" 
              alt="Professional junk removal service team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 text-white justify-center">
                <CheckCircle2 size={18}/>
                <span className="text-sm font-bold">Fast Response • Same-Day Service • Nationwide Coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="mb-8">
              <h2 className="text-2xl font-black mb-2">Send Us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  placeholder="(303) 555-0199"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="Tell us about your junk removal needs..."
              />
            </div>

            <div className="pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                className="w-full px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
              >
                Send Message
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                We'll respond within 30 minutes during business hours
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
