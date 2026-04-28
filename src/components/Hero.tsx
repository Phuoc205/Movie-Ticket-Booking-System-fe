const Hero = () => {
  return (
    <div className="mx-4 lg:mx-auto max-w-7xl mt-6">
      <div className="relative h-[65vh] rounded-2xl overflow-hidden">

        {/* 🔥 Background */}
        <img
          src="https://image.tmdb.org/t/p/original/9d1cZr6sZ2rZcYf0G3C9k1z5t0Y.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🔥 Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        {/* 🔥 Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Trải nghiệm điện ảnh đỉnh cao
          </h1>

          <p className="text-gray-300 text-lg max-w-xl mb-6">
            Khám phá những bộ phim bom tấn mới nhất, đặt vé nhanh chóng và tận hưởng không gian rạp tuyệt vời.
          </p>

          <div className="flex gap-4">
            <button className="btn-primary px-6 py-3 text-lg">
              🎟 Đặt Vé Ngay
            </button>

            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-sm">
              ▶ Xem Trailer
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Hero;
