import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-[#0B51F4]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 animate-spin" />
          </div>
          
          <h2 className="text-3xl font-bold mb-3">خبرنامه</h2>
          <p className="text-white/80 mb-8">
            با عضویت در خبرنامه از تخفیف‌های ویژه و محصولات جدید با خبر شوید
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              required
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-white text-[#0B51F4] rounded-2xl font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/20 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              عضویت
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-green-300 animate-fade-in">
              ✅ عضویت شما با موفقیت ثبت شد!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;