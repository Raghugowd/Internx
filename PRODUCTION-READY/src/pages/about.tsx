import React, { useState, useEffect } from 'react';
import { Users, Target, Globe, Award, BookOpen, Briefcase, Heart, Lightbulb, ChevronRight, Star, TrendingUp, Zap } from 'lucide-react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "5,000+", label: "Students Mentored", icon: Users },
    { number: "100+", label: "Partner Institutions", icon: Briefcase },
    { number: "90%", label: "Success Rate", icon: TrendingUp },
    { number: "10+", label: "Cities Covered", icon: Globe }
  ];

  const teamMembers = [
    {
      name: "Dr. Francisca Tej",
      role: "Founder & Director",
      image: "",
      bio: "Visionary academic with over 18 years of experience in international education and corporate leadership",
      specialties: ["Global Education", "Student Mentorship", "Women Empowerment"]
    },
    {
      name: "Dr. Guru Tej",
      role: "Co-Founder & Academic Head",
      image: "",
      bio: "Dedicated educator focused on empowering students through innovative learning methodologies",
      specialties: ["IELTS Coaching", "Career Guidance", "Educational Strategy"]
    },
    {
      name: "Dr. Shane Fernandez",
      role: "Head of Training",
      image: "",
      bio: "Expert trainer specializing in test preparation and skill development programs",
      specialties: ["Test Prep", "Skill Workshops", "Student Success"]
    },
    {
      name: "Melissa",
      role: "Senior IELTS Trainer",
      image: "",
      bio: "Experienced IELTS coach known for helping students achieve high band scores",
      specialties: ["IELTS Training", "English Proficiency", "Student Support"]
    }
  ];

  const milestones = [
    { year: "2018", title: "WiZdom.Ed Founded", desc: "Established as a leading educational consultancy in Mangalore" },
    { year: "2020", title: "Global Expansion", desc: "Expanded services to include overseas admissions and test prep" },
    { year: "2022", title: "Skill Development Launch", desc: "Introduced tech-focused workshops and personality development programs" },
    { year: "2025", title: "InternX Platform Launch", desc: "Launched InternX to revolutionize internship opportunities for students" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-green-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-green-400/30">
              <Zap className="w-5 h-5 mr-2 text-green-300" />
              <span className="text-green-100 font-medium">Powered by WiZdom.Ed</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              About InternX
            </h1>
            <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-12">
              Transforming internship experiences by connecting students with global opportunities 
              through intelligent matching and personalized mentorship, powered by WiZdom.Ed's legacy.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200}ms`}}>
                  <stat.icon className="w-8 h-8 text-green-300 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-green-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Enhanced Design */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="group">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl mr-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">Our Mission</h2>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl border-l-4 border-green-500 transform hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To empower students with meaningful internship opportunities that align with their 
                    academic and career goals, fostering professional growth through innovative technology 
                    and personalized guidance.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl mr-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">Our Vision</h2>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl border-l-4 border-green-500 transform hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To become the leading global platform for internships, creating a world where every 
                    student has access to transformative professional experiences that drive career success 
                    and industry innovation.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" 
                alt="Student collaboration" 
                className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About WiZdom.Ed with Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-green-100 px-6 py-3 rounded-full mb-6">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-semibold">Our Heritage</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Powered by WiZdom.Ed</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Rooted in WiZdom.Ed's legacy of educational excellence in Mangalore, InternX is a testament 
              to our commitment to bridging academia and industry through innovative solutions.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-green-500 to-green-300"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="text-green-600 font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Educational Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                Renowned for test preparation, career counseling, and skill development programs
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Partnerships with universities and organizations across India and abroad
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Student-Centric</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated to awakening students' potential through personalized mentorship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Leadership Team */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-green-100 px-6 py-3 rounded-full mb-6">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-semibold">Meet Our Team</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Leadership Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A team of passionate educators and trainers driving InternX's mission forward
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="relative w-24 h-24 rounded-2xl object-cover shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
               
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-green-100 px-6 py-3 rounded-full mb-6">
              <Heart className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-green-800 font-semibold">Our Foundation</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide WiZdom.Ed and InternX in empowering students globally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Excellence", desc: "Delivering top-tier educational and professional services", color: "from-blue-500 to-blue-600" },
              { icon: Heart, title: "Integrity", desc: "Upholding ethical practices and genuine care for students", color: "from-red-500 to-red-600" },
              { icon: Users, title: "Collaboration", desc: "Building strong partnerships with institutions and industry", color: "from-purple-500 to-purple-600" },
              { icon: Lightbulb, title: "Innovation", desc: "Leveraging technology to create transformative opportunities", color: "from-green-500 to-green-600" }
            ].map((value, index) => (
              <div key={index} className="group text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3">
                <div className={`bg-gradient-to-r ${value.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-green-600 opacity-10"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Launch Your Career?</h2>
          <p className="text-xl text-green-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join InternX and unlock global internship opportunities tailored to your aspirations. 
            Powered by WiZdom.Ed, we're here to guide you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-white text-green-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <span className="flex items-center justify-center">
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
            <button className="group border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center">
                Explore Platform
                <Globe className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;