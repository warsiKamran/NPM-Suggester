import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

// Define a type that extends Contributor with contributions property
interface ContributorWithContributions extends Contributor {
  contributions: number; // Assuming contributions is a number
}

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<ContributorWithContributions[]>([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get<Contributor[]>(
          "https://api.github.com/repos/Muhammad-Owais-Warsi/NPM-Suggester/contributors"
        );
        // Fetching additional data for each contributor to estimate their contributions
        const contributorsWithData = await Promise.all(
          response.data.map(async (contributor) => {
            const userResponse = await axios.get(
              `https://api.github.com/repos/Muhammad-Owais-Warsi/NPM-Suggester/commits?author=${contributor.login}`
            );
            return {
              ...contributor,
              contributions: userResponse.data.length, // Number of commits made by the contributor
            };
          })
        );
        setContributors(contributorsWithData);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, []); // Empty dependency array ensures fetch happens only once on mount

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white px-4 pt-7 overflow-hidden">
      <motion.h3
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-4 text-center"
      >
        Contributors
      </motion.h3>
      <div className="flex flex-wrap justify-center">
        {contributors.map((contributor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center mb-8 mr-8 p-4 bg-white rounded-lg shadow-md"
          >
            <a
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-blue-600 hover:underline"
            >
              <motion.img
                src={contributor.avatar_url}
                alt={`Avatar of ${contributor.login}`}
                className="w-24 h-24 rounded-full mb-2 transition duration-300 transform group-hover:scale-110"
                whileHover={{ scale: 1.1 }}
              />
              <motion.span
                className="text-sm"
                whileHover={{ scale: 1.1, color: "#3182ce" }}
              >
                {contributor.login}
              </motion.span>
            </a>
            <p className="text-gray-600 mt-2">
              Contributions: {contributor.contributions ?? "Loading..."}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
