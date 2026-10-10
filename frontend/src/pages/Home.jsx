import React from 'react';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';
import Products from '../components/Home/Products';
import Newsletter from '../components/Home/Newsletter';

const Home = () => {
  return (
    <div className="pt-28">
      <Hero />
      <Categories />
      <Products />  {/* ✅ این کامپوننت باید محصولات رو نمایش بده */}
      <Newsletter />
    </div>
  );
};

export default Home;