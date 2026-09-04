import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Heart, Github, ShieldCheck, Truck, Clock, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Free Delivery</p>
              <p className="text-xs text-slate-400">On orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Genuine</p>
              <p className="text-xs text-slate-400">Verified educational kits & books</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-brand-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Certified Courses</p>
              <p className="text-xs text-slate-400">Lifetime access & certificates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Instant Access</p>
              <p className="text-xs text-slate-400">Digital downloads in seconds</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Edu<span className="text-brand-400">Kart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated essentials for students: academic textbooks, stationery, electronics, study accessories, and competitive exam preparation materials.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition">Books</Link></li>
              <li><Link to="/" className="hover:text-white transition">Stationery</Link></li>
              <li><Link to="/" className="hover:text-white transition">Electronics</Link></li>
              <li><Link to="/" className="hover:text-white transition">Study Accessories</Link></li>
              <li><Link to="/" className="hover:text-white transition">Exam Preparation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-white transition">My Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/auth" className="hover:text-white transition">Student Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Student Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p><span className="text-white font-medium">Free Delivery:</span> Orders above ₹499</p>
              <p><span className="text-white font-medium">Quality Check:</span> 100% genuine resources</p>
              <p><span className="text-white font-medium">Returns:</span> 7-day hassle-free replacement</p>
              <p><span className="text-white font-medium">Security:</span> 256-bit encrypted checkout</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} EduKart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
