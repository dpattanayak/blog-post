import React from "react";
import { useSelector } from "react-redux";
import { Carousel, HeroBanner } from "../components";

const HeroSection = () => {
  const postState = useSelector((state) => state.post.posts);
  const bannerType = {
    TOP_PICKS: "Top Picks",
    TRENDING: "Trending",
  };

  return (
    <>
      {!postState?.length ? (
        <section
          className="bg-cover bg-center min-h-[85vh] flex items-center justify-center relative"
          style={{
            backgroundImage:
              'url("https://fastly.picsum.photos/id/184/4288/2848.jpg?hmac=l0fKWzmWf6ISTPMEm1WjRdxn35sg6U3GwZLn5lvKhTI")',
          }}
        >
          <div className="bg-black/40 w-full h-full absolute left-0 top-0"></div>
          <div className="relative z-10 text-center text-white p-4 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to Blog Post
            </h1>
            <p className="text-sm md:text-lg mb-8">
              Discover the latest articles, stories, and insights from top
              writers around the world.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link
                to={"/login"}
                className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 text-primaryLight font-semibold rounded hover:bg-blue-500 transition duration-300"
              >
                Get Started
              </Link>
              <Link
                to={"/about"}
                className="px-6 py-2 md:px-8 md:py-3 text-text-dark bg-bg-dark hover:bg-hover-dark font-semibold rounded transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <Carousel posts={postState} />
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
      )}
    </>
  );
};

export default HeroSection;
