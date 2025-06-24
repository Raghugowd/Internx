import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, Code, Palette, BarChart3, Megaphone, Heart, Cog, ArrowRight, Calendar } from 'lucide-react';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  salary: number;
  type: string;
  createdAt: string;
  image?: string;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredjobs, setFeaturedjobs] = useState<Job[]>([]);
  const user = true; // Demo: set to false to show login buttons

  useEffect(() => {
    fetchFeaturedjobs();
  }, []);

  const fetchFeaturedjobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs?limit=6');
      const jobsWithImages = response.data.jobs.map((job: Job, index: number) => ({
        ...job,
        image: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f'
        ][index % 6]
      }));
      setFeaturedjobs(jobsWithImages);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    const queryString = params.toString();
    window.location.href = `/jobs${queryString ? `?${queryString}` : ''}`;
  };

  const handleDomainClick = (domain: string) => {
    window.location.href = `/jobs?domain=${encodeURIComponent(domain)}`;
  };

  const domains = [
    {
      name: 'Technology',
      icon: Code,
      description: 'Software Development, AI, Data Science',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      count: '150+'
    },
    {
      name: 'Design',
      icon: Palette,
      description: 'UI/UX, Graphic Design, Product Design',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      count: '80+'
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      description: 'Digital Marketing, Content, Social Media',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      count: '120+'
    },
    {
      name: 'Finance',
      icon: BarChart3,
      description: 'Investment Banking, Accounting, Analysis',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      count: '90+'
    },
    {
      name: 'Healthcare',
      icon: Heart,
      description: 'Medical Research, Pharmacy, Biotech',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      count: '60+'
    },
    {
      name: 'Engineering',
      icon: Cog,
      description: 'Mechanical, Civil, Electrical Engineering',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      count: '100+'
    }
  ];

  const testimonials = [
    {
      name: 'Ananya Rao',
      location: 'Mangalore, Karnataka',
      quote: 'This platform transformed my career! I landed a tech internship at a top company in just two weeks.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating: 5
    },
    {
      name: 'Vikram Shenoy',
      location: 'Udupi, Karnataka',
      quote: 'The AI matching system helped me find a marketing role that perfectly fits my skills!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 4
    },
    {
      name: 'Priya D’Souza',
      location: 'Mangalore, Karnataka',
      quote: 'The one-click apply feature made the process so seamless. Highly recommend to all students!',
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* Clean background with subtle green accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50"></div>
        
        {/* Minimal geometric elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full" style={{background: 'linear-gradient(135deg, rgba(12, 117, 69, 0.1), rgba(38, 131, 14, 0.05))'}}></div>
          <div className="absolute bottom-32 left-20 w-48 h-48 rounded-full" style={{background: 'linear-gradient(135deg, rgba(38, 131, 14, 0.08), rgba(12, 117, 69, 0.03))'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 text-green-600" />
                Trusted by 50,000+ students worldwide
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-gray-900">
                  Find Your
                  <span className="block" style={{background: 'linear-gradient(135deg, rgb(9, 209, 119), #26830E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                    Dream Internship
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                  Identify the best opportunities that matches your skillset in more than thousand domains offered by thousand of companies.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <button className="group inline-flex items-center justify-center px-8 py-4 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{background: 'linear-gradient(135deg, #169244, #156935)'}}>
                    Explore Internships
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <button className="group inline-flex items-center justify-center px-8 py-4 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{background: 'linear-gradient(135deg, #169244, #156935)'}}>
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-gray-300 hover:scale-105 transition-all duration-300">
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600"> jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600"> Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Column - Search Bar */}
            <div className="relative lg:ml-8 animate-fade-in-up">
              <div className="relative">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-6 w-6 group-hover:scale-110 transition-transform" />
                      <input
                        type="text"
                        placeholder="Search jobs, skills, or companies"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:shadow-lg"
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-6 w-6 group-hover:scale-110 transition-transform" />
                      <input
                        type="text"
                        placeholder="City or remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:shadow-lg"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="relative bg-gradient-to-r from-green-600 to-green-800 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                      <span className="relative">Search</span>
                    </button>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Features Section */}
        <div className="relative bg-gray-50 border-t border-gray-200 py-16 mx-4 rounded-t-3xl -mt-16 z-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
            {[
              { icon: Search, title: "AI-Powered Matching", desc: "Smart algorithms find your perfect fit" },
              { icon: MapPin, title: "Global Internships", desc: "Remote and on-site positions worldwide" },
              { icon: Calendar, title: "Flexible Schedules", desc: "Part-time, full-time, and custom durations" },
              { icon: Briefcase, title: "One-Click Apply", desc: "Streamlined application process" }
            ].map((feature, index) => (
              <div key={index} className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 mx-auto bg-white border border-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Domain Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Domains</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore Internship tailored to your passion and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domains.map((domain, index) => (
              <div
                key={index}
                onClick={() => handleDomainClick(domain.name)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-green-100 backdrop-blur-sm"
              >
                <div className={`bg-gradient-to-r ${domain.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">{domain.name}</h3>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {domain.count}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{domain.description}</p>
                <div className="flex items-center text-green-700 font-medium group-hover:text-green-800 transition-colors">
                  <span>Discover Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Internships</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore curated Internships from leading global companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredjobs.map((job) => (
              <div key={job._id} className="bg-white border border-green-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
                <div className="relative mb-4">
                  <img src={job.image} alt={job.title} className="w-full h-40 object-cover rounded-xl" />
                  <div className="absolute top-2 right-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {job.type}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">₹{job.salary.toLocaleString()}</span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Explore All jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students in the Mangalore region who found their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-green-600 fill-green-600" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Journey Starts Here</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to kickstart your internship adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Profile</h3>
              <p className="text-gray-600">
                Create a standout profile showcasing your skills and experience
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Roles</h3>
              <p className="text-gray-600">
                Explore tailored internship opportunities that match your goals
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Hired</h3>
              <p className="text-gray-600">
                Apply effortlessly and connect with top employers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Shape Your Future?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who have launched their careers with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Start Now
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
     <footer className="bg-gray-950 text-white py-16 px-6 relative overflow-hidden">
  {/* Background gradient effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#15803D]/20 to-transparent opacity-50"></div>
  
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
    {/* Brand Section */}
    <div className="space-y-4">
      <h3 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#15803D]">
        InternX
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
        Pioneering the future of career growth with global internship opportunities powered by innovation.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
      <ul className="space-y-3">
        <li>
          <Link to="/about" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">
            jobs
          </Link>
        </li>
        <li>
          <Link to="/signin" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/register" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">
            Sign Up
          </Link>
        </li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
      <p className="text-gray-300 text-sm">
        Email: <a href="mailto:support@careerlaunch.com" className="hover:text-[#15803D] transition-colors">support@careerlaunch.com</a>
      </p>
      <p className="text-gray-300 text-sm">
        Phone: <a href="tel:+911234567890" className="hover:text-[#15803D] transition-colors">+91 123-456-7890</a>
      </p>
      <p className="text-gray-300 text-sm">Mangalore, Karnataka, India</p>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
      <div className="flex space-x-6">
        {/* Facebook */}
        <a href="https://facebook.com/wizdom" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        {/* Twitter/X */}
        <a href="https://x.com/wizdom" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        {/* Instagram */}
        <a href="https://instagram.com/wizdom" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm4.5-10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-300 relative z-10">
    <p>© {new Date().getFullYear()} InternX. All rights reserved.</p>
  </div>

  {/* Futuristic floating particles */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="w-2 h-2 bg-[#15803D] rounded-full absolute top-10 left-20 animate-[float_4s_ease-in-out_infinite]"></div>
    <div className="w-3 h-3 bg-[#15803D]/50 rounded-full absolute bottom-20 right-10 animate-[float_4s_ease-in-out_infinite_1s]"></div>
    <div className="w-1 h-1 bg-[#15803D]/70 rounded-full absolute top-1/2 left-1/3 animate-[float_4s_ease-in-out_infinite_0.5s]"></div>
  </div>
</footer>
    </div>
  );
};

export default Home;