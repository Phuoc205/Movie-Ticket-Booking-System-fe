import { useLocation } from "react-router-dom";

const SubHeader = ({
  searchQuery,
  setSearchQuery,
  onSearch
}: any) => {

  const location = useLocation();

  if (location.pathname !== "/") return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="sub-header sticky top-[64px] z-40 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">

        {/* Tabs */}
        <div className="flex gap-6">
          <button onClick={() => scrollTo("nowShowing")} className="tab">
            Đang chiếu
          </button>
          <button onClick={() => scrollTo("comingSoon")} className="tab">
            Sắp chiếu
          </button>
          <button onClick={() => scrollTo("classic")} className="tab">
            Đã chiếu
          </button>
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="ml-auto flex">
          <input
            type="text"
            placeholder="Tìm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field rounded-r-none w-[260px]"
          />
          <button className="btn-primary rounded-l-none">
            Tìm
          </button>
        </form>

      </div>
    </div>
  );
};

export default SubHeader;