import React from 'react';
import slide2 from "../../../../Images/banner1.jpg"
import slide1 from "../../../../Images/banner2.jpg"
import slide3 from "../../../../Images/banner3.jpg"
const HomeLayout = () => {
    return (
        <div className='bg-white'>
            <div className="carousel w-full h-1/3">
                <div id="slide1" className="carousel-item relative w-full h-1/3">
                    <img
                        src={slide1}
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide4" className="btn btn-circle">❮</a>
                        <a href="#slide2" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide2" className="carousel-item relative w-full h-1/3">
                    <img
                        src={slide2}
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide1" className="btn btn-circle">❮</a>
                        <a href="#slide3" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide3" className="carousel-item relative w-full h-1/3">
                    <img
                        src={slide3}
                        className="w-full " />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide2" className="btn btn-circle">❮</a>
                        <a href="#slide4" className="btn btn-circle">❯</a>
                    </div>
                </div>
                <div id="slide4" className="carousel-item relative w-full h-1/3">
                    <img
                        src={slide1}
                        className="w-full" />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href="#slide3" className="btn btn-circle">❮</a>
                        <a href="#slide1" className="btn btn-circle">❯</a>
                    </div>
                </div>
            </div>
            <section className='py-12 grid grid-cols-12 mx-auto'>
                <aside className='col-span-2'>

                </aside>
                <section className='col-span-6'>
                    <h1 className='text-md text-gray-500 col-span-6 lg:font-bold lg:text-4xl text-left '>
                        Welcome to Home Of Volunteer
                    </h1>
                    <br />
                    <div className="divider divider-neutral w-2/3"></div>
                    <p className='text-left text-sm text-gray-500   lg:text-md'>
                    Bangladesh, a land of unexplored beauty mixed with fascinating history situated on the world’s largest Ganges-Brahmaputra delta boarded with India & Myanmar, the country is famous for its vibrant cultures & festivity, friendly people, splendid panoramic beauties of landscape, natural wonders like worlds single largest Sundarban mangrove forest, longest unbroken sea beach in the world, green hills & hikes, photography adventures, cycling, surfing, otter fishing, heritage paddle steamer ridding, back water & floating markets , tea plantation , tribal lifestyle and many others is waiting to welcome you. To find the real Bangladesh steps into her embrace, feel the warmth & create your own map to discover the riches she holds.


                    </p>

                </section>
            </section>


        </div>
    );
};

export default HomeLayout;