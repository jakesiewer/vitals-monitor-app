// import React from 'react'

// import { useAuth } from "../../contexts/AuthContext";

// export default function Home() {
//     const { currentUser } = useAuth();

//     return (
//         <>
//             <div className='bg-stone-50 pt-12'>
//                <p>About Page</p>
//             </div>
//         </>
//     );
// }


import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import auth from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import maynoothImage from '../../assets/maynooth.jpg';

export default function About() {

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <HeroSection />
                <LoginSection />
                <FeaturesSection />
                <TeamSection />

            </div>

        </div>
    );
};

const LoginSection = () => {
    const currentUser = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const user = auth.currentUser;
            const token = user && (await user.getIdToken());
        
            const payloadHeader = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            const res = await fetch("http://localhost:3001/auth", payloadHeader);
          } catch (e) {}
        };
    
        fetchData();
      });

    const handleLogin = (e) => {
        e.preventDefault();

        try {
            navigate("/login");

        } catch (e) {
            alert("Failed to redirect");
            console.log(e)
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();

        try {
            navigate("/register");

        } catch (e) {
            alert("Failed to redirect");
            console.log(e)
        }
    }

    return (
        <>
            {currentUser.currentUser == null && (
                <section className="text-center">
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="inline-block h-10 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <button
                            type="submit"
                            className="inline-block h-10 ml-4 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </section>
            )}
        </>
    );
};

const HeroSection = () => {
    return (
        <section className="text-center py-8">
            <h1 className="text-4xl font-light mb-4">About Lifelog</h1>
            <p className="text-lg text-slate-600">
                Learn about what our website does and how it can help you.
            </p>
        </section>
    );
};

const FeaturesSection = () => {
    const features = [
        {
            title: 'Connect To Fitbit',
            description: 'The connection our service makes to your Fitbit account will enable you to pull your activity data and display it alongside the various other features. This feature is secure and seamless. None of the data is stored, only read and displayed for your personal use.'
        },
        {
            title: 'Data Visualization',
            description: 'Your activity data will be displayed in a chart, depending on the Fitbit watch you are using and the features it , this chart will display various data points (Heart-Rate, Skin Temperature, Blood Oxygen, Respiratory Rate, etc.). With this data you will be able to see your location at the peaks and troughs of these data points. Alongside this, you can view your journals to know exactly your state of mind at that point, giving you an in-depth view at your emotional, physical, and cognitive patterns.'
        },
        {
            title: 'Journal Logging',
            description: 'Alongside various other features, we have included a method of logging mood journals, these mood journals are used to give you more context behind your physical data. Ideally, recording 2-hour segments on your Fitbit while simultaneously logging journals periodically during this time will give you the optimal experience. We have also included a method of viewing all your past journals for your own viewing experience.'
        }
    ];

    return (
        <section className="py-8">
            <h2 className="text-2xl font-light mb-4">Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
            </div>
        </section>
    );
};

const FeatureCard = ({ feature }) => {
    return (
        <div className="p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-light mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
        </div>
    );
};

const TeamSection = () => {
    return (
        <section className="text-center py-8">
            <h2 className="text-2xl font-light mb-4">Our Team</h2>
            <p className="text-lg text-slate-600">
                Meet the individuals behind Lifelog and learn more about their roles and expertise.
            </p>
            <div className="flex justify-center items-center mt-8">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                ))}
            </div>
        </section>
    );
};

const teamMembers = [
    {
        name: 'Jake Siewer',
        role: 'Developer',
        image: maynoothImage,
    }
];

const TeamMemberCard = ({ member }) => {
    return (
        // <div className="flex justify-center items-center">
        <div className="p-6 border rounded-lg shadow-sm bg-white">
            <img
                className="w-full h-64 object-cover mb-4 rounded-lg"
                src={member.image}
                alt={member.name}
            />
            <h3 className="text-xl font-light mb-2">{member.name}</h3>
            <p className="text-gray-600 text-slate-600">{member.role}</p>
        </div>
        // </div>
    );
};