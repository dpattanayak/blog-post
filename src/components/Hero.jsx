import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, HeroBanner } from "../components";

const HeroSection = () => {
  const postState = useSelector((state) => state.post.posts);
  const bannerType = {
    TOP_PICKS: "Top Picks",
    TRENDING: "Trending",
  };

  return (
    <>
      <Carousel posts={postState} />

      <section
        className="bg-cover bg-center min-h-[70vh] flex items-center justify-center relative"
        style={{
          backgroundImage: 'url("/hero_bg.jpg")',
        }}
      >
        <div className="bg-black/40 w-full h-full absolute left-0 top-0"></div>
        <div className="relative z-10 text-center text-white p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Blog Post
          </h1>
          <p className="text-sm md:text-lg mb-8">
            Discover the latest articles, stories, and insights from top writers
            around the world.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to={"/login"}
              className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 text-primaryLight font-semibold rounded hover:bg-blue-500 transition duration-300"
            >
              Get Started
            </Link>
            <a
              className="px-6 py-2 md:px-8 md:py-3 text-text-dark bg-bg-dark hover:bg-hover-dark font-semibold rounded transition duration-300"
              href="https://github.com/dpattanayak/blog-post?tab=readme-ov-file#readme-ov-file"
              target="_blank"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <div className="w-full flex flex-col md:flex-row mt-8 gap-4">
        <HeroBanner
          className="w-full md:w-3/4"
          type={bannerType.TOP_PICKS}
          posts={postState}
        />

        <HeroBanner
          className="w-full md:w-1/4"
          type={bannerType.TRENDING}
          posts={postState}
        />
      </div>
    </>
  );
};

export default HeroSection;
