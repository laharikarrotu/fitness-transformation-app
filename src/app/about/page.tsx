import React from 'react';

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold mb-4 text-fitness-blue">About Fitness Transformation App</h1>
      <p className="text-lg mb-6 text-fitness-dark dark:text-fitness-light">
        Welcome to the Fitness Transformation App! Our mission is to empower you on your fitness journey with personalized workouts, nutrition tracking, progress monitoring, and expert guidance. Whether you are a beginner or a seasoned athlete, our platform is designed to help you achieve your goals and celebrate every milestone.
      </p>
      <ul className="list-disc pl-6 mb-6 text-fitness-dark dark:text-fitness-light">
        <li>Track your workouts and activities</li>
        <li>Monitor your nutrition and calories</li>
        <li>Set and achieve fitness goals</li>
        <li>Connect with trainers and the community</li>
        <li>Visualize your progress with charts and photos</li>
      </ul>
      <p className="text-md text-fitness-accent">
        Built with Next.js, Auth0, AWS, and a passion for helping you transform your life!
      </p>
    </main>
  );
} 