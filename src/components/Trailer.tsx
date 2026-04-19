import React from 'react';

const Trailer = () => {
    const getEmbedUrl = (url: string) => {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1`;
    };

    return (
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto">
            <div className="relative aspect-video overflow-hidden rounded-xl">
                <iframe
                    className="absolute top-0 left-0 w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%]"
                    src={getEmbedUrl('https://www.youtube.com/watch?v=7TavVZMewpY')}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default Trailer;