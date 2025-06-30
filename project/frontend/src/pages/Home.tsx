import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Star, Code, Palette, BarChart3, Megaphone, Heart, Cog, ArrowRight, Calendar, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import axios from 'axios';

interface Internship {
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

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'internx.io' || hostname === 'www.internx.io') {
      return 'https://api.internx.io/api';
    }
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      return 'https://api.internx.io/api';
    }
    return 'http://localhost:5000/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const user = true; // Demo: set to false to show login buttons

  const testimonials = [
    {
      name: 'Ananya R.',
      location: 'Delhi',
      quote: 'InternX helped me get my very first internship. I was nervous, but the platform made everything easy to understand and follow. I\'m really happy I found it.',
      rating: 5
    },
    {
      name: 'Karthik M.',
      location: 'Bengaluru',
      quote: 'Very simple and helpful website. I got selected for a remote internship within 10 days!',
      rating: 5
    },
    {
      name: 'Sneha D.',
      location: 'Kochi',
      quote: 'InternX gave me access to internships in different cities and fields. I found one in content writing and learned so many new things in just two months.',
      rating: 4
    },
    {
      name: 'Rahul V.',
      location: 'Mumbai',
      quote: 'I applied to 3 internships through InternX and got selected for one. The company was great, and I even got a certificate at the end.',
      rating: 4
    },
    {
      name: 'Megha S.',
      location: 'Hyderabad',
      quote: 'As a first-year student, I didn’t have much experience. But InternX still helped me get an internship that was beginner-friendly. I learned from scratch.',
      rating: 5
    },
    {
      name: 'Ajay N.',
      location: 'Coimbatore',
      quote: 'InternX is perfect for students who are new to internships. The steps are clear, and the website is easy to use.',
      rating: 4
    },
    {
      name: 'Priya K.',
      location: 'Pune',
      quote: 'The best thing is all internships are verified. I didn’t face any fake or unpaid work. Totally trustable platform!',
      rating: 5
    },
    {
      name: 'Zainab F.',
      location: 'Bhopal',
      quote: 'I’m from a small town, and I never thought I could work for a big company. InternX gave me that chance with a remote marketing internship. It changed my future.',
      rating: 5
    },
    {
      name: 'Saurabh R.',
      location: 'Lucknow',
      quote: 'This platform showed me options I didn’t even know existed. I applied to internships in graphic design, social media, and writing—all from one place.',
      rating: 4
    },
    {
      name: 'Divya L.',
      location: 'Ahmedabad',
      quote: 'My experience with InternX was really good. I found a company that treated interns with respect and helped me grow.',
      rating: 5
    },
    {
      name: 'Neha T.',
      location: 'Chandigarh',
      quote: 'InternX is not just a job board. It helps you grow. I improved my communication, learned new tools, and now I feel ready for the corporate world.',
      rating: 5
    },
    {
      name: 'Manish K.',
      location: 'Jaipur',
      quote: 'InternX is the reason I got selected for a paid internship. I was able to work, earn, and learn all at once. Very thankful!',
      rating: 5
    },
    {
      name: 'Ritika S.',
      location: 'Nagpur',
      quote: 'I love how InternX lets us filter by interest and city. That saved me so much time. Everything was well-organized.',
      rating: 4
    },
    {
      name: 'Naveen G.',
      location: 'Visakhapatnam',
      quote: 'Before using InternX, I had no idea where to begin. But this platform made everything so simple—from finding a role to preparing for interviews.',
      rating: 5
    },
    {
      name: 'Lavanya M.',
      location: 'Mysuru',
      quote: 'I found a fully remote internship through InternX and gained real work experience before graduating. It’s the best thing I did for my career.',
      rating: 5
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  useEffect(() => {
    fetchFeaturedInternships();
  }, []);

  useEffect(() => {
    if (isAutoSliding) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, totalSlides]);

  const fetchFeaturedInternships = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/internships?limit=6`);
      const internshipsWithImages = response.data.internships.map((internship: Internship, index: number) => ({
        ...internship,
        image: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f'
        ][index % 6]
      }));
      setFeaturedInternships(internshipsWithImages);
    } catch (error) {
      console.error('Error fetching featured internships:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    const queryString = params.toString();
    window.location.href = `/internships${queryString ? `?${queryString}` : ''}`;
  };

  const handleDomainClick = (domain: string) => {
    window.location.href = `/internships?domain=${encodeURIComponent(domain)}`;
  };

  const nextSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const getCurrentSlideTestimonials = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return testimonials.slice(startIndex, startIndex + itemsPerSlide);
  };

  const domains = [
    {
      name: 'Technology',
      icon: Code,
      description: 'Software Development, AI, Data Science',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Design',
      icon: Palette,
      description: 'UI/UX, Graphic Design, Product Design',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      description: 'Digital Marketing, Content, Social Media',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      name: 'Finance',
      icon: BarChart3,
      description: 'Investment Banking, Accounting, Analysis',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Healthcare',
      icon: Heart,
      description: 'Medical Research, Pharmacy, Biotech',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Engineering',
      icon: Cog,
      description: 'Mechanical, Civil, Electrical Engineering',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50"></div>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(12, 117, 69, 0.1), rgba(38, 131, 14, 0.05))' }}></div>
          <div className="absolute bottom-32 left-20 w-48 h-48 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(38, 131, 14, 0.08), rgba(12, 117, 69, 0.03))' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 text-green-600" />
                Trusted by 50,000+ students worldwide
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-gray-900">
                  Find Your
                  <span className="block" style={{ background: 'linear-gradient(135deg, #09D177, #26830E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Dream Internship
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Discover amazing internship opportunities from top companies and kickstart your career journey with the perfect match for your skills and aspirations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/internships"
                    className="group inline-flex items-center justify-center px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #169244, #156935)' }}
                  >
                    Explore Internships
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #169244, #156935)' }}
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/signin"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:scale-105 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Active Internships</div>
                </div>
                  <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Students Placed</div>
                </div>
              
              </div>
            </div>
            <div className="relative lg:ml-8 animate-fade-in-up">
              <div className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5 group-hover:scale-110 transition-transform" />
                      <input
                        type="text"
                        placeholder="Internship title, keywords, or company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:shadow-lg"
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5 group-hover:scale-110 transition-transform" />
                      <input
                        type="text"
                        placeholder="City or remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:shadow-lg"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="relative bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg font-semibold overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                      <span className="relative">Search</span>
                    </button>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative bg-gray-50 border-t border-gray-200 py-12 mx-4 rounded-t-2xl -mt-16 z-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {[
              { icon: Search, title: "AI-Powered Matching", desc: "Smart algorithms find your perfect fit" },
              { icon: MapPin, title: "Global Internships", desc: "Remote and on-site positions worldwide" },
              { icon: Calendar, title: "Flexible Schedules", desc: "Part-time, full-time, and custom durations" },
              { icon: Briefcase, title: "One-Click Apply", desc: "Streamlined application process" }
            ].map((feature, index) => (
              <div key={index} className="group text-center space-y-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-14 h-14 mx-auto bg-white border border-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Domain Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Discover Domains</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore Internships tailored to your passion and expertise
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => (
              <div
                key={index}
                onClick={() => handleDomainClick(domain.name)}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-green-100 backdrop-blur-sm"
              >
                <div className={`bg-gradient-to-r ${domain.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{domain.name}</h3>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {domain.count}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
                <div className="flex items-center text-green-700 font-medium group-hover:text-green-800 transition-colors">
                  <span>Discover Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Internships</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore curated Internships from leading global companies
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <div key={internship._id} className="bg-white border border-green-100 rounded-xl p-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm">
                <div className="relative mb-4">
                  <img src={internship.image} alt={internship.title} className="w-full h-36 object-cover rounded-lg" />
                  <div className="absolute top-2 right-2 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {internship.type}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{internship.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{internship.company}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{internship.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-700">₹{internship.salary.toLocaleString()}</span>
                  <Link
                    to={`/internships/${internship._id}`}
                    className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/internships"
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Explore All Internships
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-100/40 to-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-emerald-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full text-green-700 text-sm font-medium mb-6 shadow-lg backdrop-blur-sm">
              <Star className="w-4 h-4 mr-9 text-green-600 fill-green-600" />
              Trusted by 15,000+ Students Across India
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how students from across India transformed their careers with InternX
            </p>
          </div>

          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm hover:bg-white border border-green-200/50 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-110"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm hover:bg-white border border-green-200/50 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-110"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors" />
            </button>

            <div className="overflow-hidden px-8">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {getCurrentSlideTestimonials().map((testimonial, index) => (
                        <div
                          key={`${slideIndex}-${index}`}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100/50 hover:border-green-200/50 transform hover:-translate-y-2 hover:scale-[1.02]"
                        >
                          <div className="absolute -top-0 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Quote className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex mb-6 justify-center">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-amber-400 fill-amber-400 mr-1 group-hover:scale-110 transition-transform"
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                          <blockquote className="text-gray-700 leading-relaxed mb-6 text-center italic font-medium">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <span className="text-2xl font-bold text-green-700">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-green-600 font-medium">
                              {testimonial.location}
                            </p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoSliding(false);
                    setTimeout(() => setIsAutoSliding(true), 10000);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-gradient-to-r from-green-500 to-green-600 scale-125 shadow-lg'
                      : 'bg-green-200 hover:bg-green-300 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <Star className="w-5 h-5 mr-2 fill-white" />
              Join 15,000+ Success Stories
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-green-500 rounded-full animate-pulse opacity-80" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your Journey Starts Here</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to kickstart your internship adventure
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Build Profile</h3>
              <p className="text-gray-600 text-sm">Create a standout profile showcasing your skills and experience</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Roles</h3>
              <p className="text-gray-600 text-sm">Explore tailored internship opportunities that match your goals</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Hired</h3>
              <p className="text-gray-600 text-sm">Apply effortlessly and connect with top employers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Shape Your Future?</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8">Join thousands of students who have launched their careers with us</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/internships"
              className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#15803D]/20 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#15803D]">
              WizdomEd's InternX
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
              Empowering career growth through global internship opportunities at InternX, a WizdomEd initiative based in Mangalore, Karnataka.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">About WizdomEd</Link></li>
              <li><Link to="/internships" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">InternX Opportunities</Link></li>
              <li><Link to="/login" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 ease-in-out hover:translate-x-1">Sign In to InternX</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <p className="text-gray-200 text-sm">Email: <a href="mailto:support@wizdomed.com" className="hover:text-[#15803D] transition-colors">support@wizdomed.com</a></p>
            <p className="text-gray-200 text-sm">Phone: <a href="tel:+919876543210" className="hover:text-[#15803D] transition-colors">+91 9876543210</a></p>
            <p className="text-gray-200 text-sm">WizdomEd, Mangalore, Karnataka, India</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow WizdomEd</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/wizdomed" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/wizdomed" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/wizdomed" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm4.5-10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-200 relative z-10">
          <p>© {new Date().getFullYear()} WizdomEd's InternX. All rights reserved.</p>
        </div>
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