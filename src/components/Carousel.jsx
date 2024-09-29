import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { storage } from "../services";

const previewCache = new Map();

const usePreviewUrl = (fileId) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!fileId) return;

    if (previewCache.has(fileId)) {
      setPreviewUrl(previewCache.get(fileId));
    } else {
      const url = storage.getFilePreview(fileId, {
        width: 800,
        height: 400,
      });
      setPreviewUrl(url);
      previewCache.set(fileId, url);
    }
  }, [fileId]);

  return previewUrl;
};

const Carousel = ({ posts }) => {
  const featuredItems = posts?.slice(0, 5) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredItems.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredItems.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
  };

  const truncateString = (str, maxLength = 40, suffix = "...") => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  };

  if (featuredItems.length === 0) return null;

  return (
    <Container className="mx-auto max-w-screen-xl">
      <section className="relative w-full min-h-56 md:min-h-96 overflow-hidden bg-bg-dark/60 rounded-md">
        {featuredItems.map((item, index) => {
          const previewUrl = usePreviewUrl(item.featuredImage);
          const isActive = index === currentIndex;

          return (
            <div
              key={item.featuredImage}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end pb-6 justify-center">
                <Link to={`/post/${item.$id}`}>
                  <p className="text-white text-2xl p-4 font-light hover:underline hover:cursor-pointer">
                    {truncateString(item.title)}
                  </p>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Prev & Next Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
        >
          &#10095;
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {featuredItems.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>
    </Container>
  );
};

export default Carousel;
