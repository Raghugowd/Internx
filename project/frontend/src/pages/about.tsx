import React, { useState, useEffect } from 'react';
import { Users, Target, Globe, Award, BookOpen, Briefcase, Heart, Lightbulb, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "10,000+", label: "Internship Listings", icon: Briefcase },
    { number: "100+", label: "Cities Covered", icon: Globe },
    { number: "90%", label: "Success Rate", icon: TrendingUp },
    { number: "5,000+", label: "Students Empowered", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-32 sm:top-40 right-10 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-56 sm:w-64 md:w-80 h-56 sm:h-64 md:h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-green-500/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-green-400/30">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-300" />
              <span className="text-green-100 font-medium text-sm sm:text-base">Powered by WiZdom.Ed</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              About InternX
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
              Welcome to InternX, your gateway to the world of internships in India. We are a leading platform dedicated to connecting talented students and aspiring professionals with meaningful internship opportunities across various industries and cities nationwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/20 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200}ms`}}>
                  <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-green-300 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-green-100 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Enhanced Design */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-8 sm:space-y-12">
              <div className="group">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl mr-3 sm:mr-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Our Mission</h2>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border-l-4 border-green-500 transform hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                    To empower the next generation with practical experience, foster skill development, and bridge the gap between education and employment.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl mr-3 sm:mr-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Our Vision</h2>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border-l-4 border-green-500 transform hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                    To be the leading catalyst for career development in India, fostering a robust ecosystem where students can thrive, and businesses can flourish by tapping into fresh talent.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl sm:rounded-3xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" 
                alt="Student collaboration" 
                className="relative rounded-2xl sm:rounded-3xl w-full transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose InternX */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center bg-green-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
              <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-semibold text-sm sm:text-base">Why InternX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">Why Choose InternX?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At InternX, we believe every student deserves the chance to gain real-world experience and kickstart their career. Our platform is designed to simplify your search and connect you with opportunities that truly matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Vast Selection</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Explore a massive database of over 10,000 internships in marketing, engineering, design, finance, content creation, and much more.
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Pan-India Reach</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Discover opportunities in cities like Mumbai, Bengaluru, Chennai, Delhi, Hyderabad, Kolkata, or explore remote roles across India.
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Empowering Your Future</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We're committed to helping you develop valuable skills, build your professional network, and gain the confidence to excel in your chosen field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center bg-green-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-semibold text-sm sm:text-base">Our Foundation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">Core Values</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide InternX in empowering students and shaping futures across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Award, title: "Excellence", desc: "Delivering top-tier educational and professional services", color: "from-blue-500 to-blue-600" },
              { icon: Heart, title: "Integrity", desc: "Upholding ethical practices and genuine care for students", color: "from-red-500 to-red-600" },
              { icon: Users, title: "Collaboration", desc: "Building strong partnerships with institutions and industry", color: "from-purple-500 to-purple-600" },
              { icon: Lightbulb, title: "Innovation", desc: "Leveraging technology to create transformative opportunities", color: "from-green-500 to-green-600" }
            ].map((value, index) => (
              <div key={index} className="group text-center p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3">
                <div className={`bg-gradient-to-r ${value.color} w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <value.icon className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{value.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-green-600 opacity-10"></div>
          <div className="absolute top-10 right-10 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-56 sm:w-64 md:w-80 h-56 sm:h-64 md:h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Ready to Launch Your Career?</h2>
          <p className="text-base sm:text-lg md:text-xl text-green-100 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
            Join the thousands of students who have launched their careers through InternX. Your future starts now!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
           
            <a href="/">
      <button className="group border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105">
        <span className="flex items-center justify-center">
          Explore Platform
          <Globe className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
        </span>
      </button>
    </a>
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
                      <a href="https://facebook.com/internx" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="https://x.com/internx" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com/internx" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#15803D] transition-all duration-300 transform hover:scale-110">
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

export default AboutUs;