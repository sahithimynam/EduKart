import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

dotenv.config();

const PRODUCTS = [
  // ==========================================
  // 1. BOOKS
  // ==========================================
  {
    title: "Data Structures & Algorithms",
    desc: "Comprehensive guide covering core data structures, algorithms, complexity analysis, trees, graphs, dynamic programming, and coding interview problems.",
    price: 549,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 320,
    category: "Books",
    badge: "",
    img: "/images/products/dsa.png",
    stock: 85,
    featured: true,
    highlights: ["Arrays, Linked Lists, Trees & Graphs", "Dynamic Programming & Greedy Algorithms", "Coding interview patterns and problem solutions"]
  },
  {
    title: "DBMS Concepts",
    desc: "Complete textbook on Database Management Systems, relational models, SQL queries, normalization, ACID properties, indexing, and NoSQL systems.",
    price: 499,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 210,
    category: "Books",
    badge: "",
    img: "/images/products/dbms.png",
    stock: 70,
    featured: true,
    highlights: ["Relational Algebra & Advanced SQL Queries", "ACID transactions & Concurrency Control", "Indexing, B-Trees & Query Optimization"]
  },
  {
    title: "Operating Systems",
    desc: "In-depth concepts of process management, CPU scheduling, memory management, virtual memory, deadlocks, and file system architectures.",
    price: 529,
    originalPrice: 849,
    rating: 4.7,
    reviewsCount: 195,
    category: "Books",
    badge: "",
    img: "/images/products/operating-systems.png",
    stock: 65,
    featured: false,
    highlights: ["Process Synchronization & Semaphores", "Virtual Memory, Paging & Segmentation", "Linux & Windows OS architecture case studies"]
  },
  {
    title: "Computer Networks",
    desc: "A top-down approach covering OSI & TCP/IP models, routing algorithms, transport protocols, network security, and socket programming.",
    price: 519,
    originalPrice: 829,
    rating: 4.8,
    reviewsCount: 180,
    category: "Books",
    badge: "",
    img: "/images/products/computer-networks.png",
    stock: 75,
    featured: false,
    highlights: ["TCP/IP & OSI 7-Layer reference models", "Subnetting, routing algorithms & DNS", "Network security, SSL/TLS and cryptography"]
  },
  {
    title: "Java Programming",
    desc: "Master core Java, Object-Oriented Programming (OOP), Collections Framework, multithreading, exception handling, and modern Java features.",
    price: 479,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 240,
    category: "Books",
    badge: "",
    img: "/images/products/java-programming.png",
    stock: 90,
    featured: true,
    highlights: ["Core OOP Principles & Design Patterns", "Java Collections, Lambdas & Streams API", "Hands-on projects and exercises"]
  },

  // ==========================================
  // 2. STATIONERY
  // ==========================================
  {
    title: "Notebooks",
    desc: "Premium ruled academic notebooks with smooth, bleed-proof 80 GSM paper and durable spiral binding for lectures and study notes.",
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviewsCount: 310,
    category: "Stationery",
    badge: "",
    img: "/images/products/notebooks.png",
    stock: 150,
    featured: true,
    highlights: ["Pack of premium spiral notebooks", "80 GSM ink-friendly smooth paper", "Perforated pages for easy tear-out"]
  },
  {
    title: "Pens",
    desc: "Smooth-flow precision gel pens offering effortless glide, smudge-resistant waterproof ink, and ergonomic grip for long study hours and exams.",
    price: 99,
    originalPrice: 150,
    rating: 4.8,
    reviewsCount: 420,
    category: "Stationery",
    badge: "",
    img: "/images/products/pens.png",
    stock: 250,
    featured: true,
    highlights: ["Smooth 0.5mm precision tip", "Quick-drying smudge-proof ink", "Comfortable ergonomic rubber grip"]
  },
  {
    title: "Highlighters",
    desc: "Vibrant pastel highlighter set with dual chisel tips, perfect for marking key points, textbook notes, and revision summaries without bleed-through.",
    price: 149,
    originalPrice: 229,
    rating: 4.8,
    reviewsCount: 290,
    category: "Stationery",
    badge: "",
    img: "/images/products/highlighters.png",
    stock: 180,
    featured: false,
    highlights: ["Assorted pastel aesthetic colors", "Dual chisel tip (1mm & 4mm lines)", "Bleed-resistant on textbook paper"]
  },
  {
    title: "Sticky Notes",
    desc: "Multi-colored self-adhesive sticky notes for bookmarking chapters, making quick reminders, revision flags, and study planners.",
    price: 79,
    originalPrice: 129,
    rating: 4.6,
    reviewsCount: 215,
    category: "Stationery",
    badge: "",
    img: "/images/products/sticky-notes.png",
    stock: 220,
    featured: false,
    highlights: ["Strong adhesive sticks cleanly to any surface", "Multiple vibrant neon and pastel shades", "Easy to reposition without residue"]
  },
  {
    title: "Geometry Box",
    desc: "Precision mathematical drawing instruments set including compass, divider, protractor, set squares, ruler, and mechanical pencil.",
    price: 129,
    originalPrice: 199,
    rating: 4.7,
    reviewsCount: 160,
    category: "Stationery",
    badge: "",
    img: "/images/products/geometry-box.png",
    stock: 130,
    featured: false,
    highlights: ["Rust-resistant metal compass and divider", "Accurate laser-marked transparent scales", "Durable shock-proof metal storage case"]
  },

  // ==========================================
  // 3. ELECTRONICS
  // ==========================================
  {
    title: "Scientific Calculator",
    desc: "Advanced engineering and scientific calculator with natural textbook display, 400+ functions, matrix calculations, and dual power source.",
    price: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 540,
    category: "Electronics",
    badge: "",
    img: "/images/products/scientific-calculator.png",
    stock: 80,
    featured: true,
    highlights: ["400+ mathematical & engineering functions", "Natural Textbook 2-line display", "Dual power (Solar + Battery backup)"]
  },
  {
    title: "Wireless Mouse",
    desc: "Ergonomic 2.4GHz wireless mouse with silent clicks, adjustable DPI optical tracking, and ultra-long battery life for seamless laptop navigation.",
    price: 449,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 380,
    category: "Electronics",
    badge: "",
    img: "/images/products/wireless-mouse.png",
    stock: 110,
    featured: true,
    highlights: ["Silent click buttons for quiet library studying", "1600 DPI accurate optical sensor", "Plug & play nano USB receiver"]
  },
  {
    title: "Keyboard",
    desc: "Compact, low-profile quiet keyboard with responsive scissor keys, sleek slim design, and comfortable typing angle for long study sessions.",
    price: 749,
    originalPrice: 1199,
    rating: 4.7,
    reviewsCount: 260,
    category: "Electronics",
    badge: "",
    img: "/images/products/keyboard.png",
    stock: 70,
    featured: false,
    highlights: ["Low-profile whisper-quiet keys", "Durable spill-resistant construction", "Universal compatibility with Windows & Mac"]
  },
  {
    title: "USB Flash Drive",
    desc: "High-speed USB 3.0 flash drive for fast transfer and secure backup of study notes, project code, video lectures, and presentations.",
    price: 349,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 410,
    category: "Electronics",
    badge: "",
    img: "/images/products/usb-flash-drive.png",
    stock: 140,
    featured: false,
    highlights: ["High-speed USB 3.0 data transfer speeds", "Rugged metallic casing with keyring loop", "Plug & play with all laptops and PCs"]
  },
  {
    title: "Laptop Stand",
    desc: "Adjustable ergonomic aluminum laptop stand that elevates your screen to eye level, improving posture and cooling during study sessions.",
    price: 599,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 320,
    category: "Electronics",
    badge: "",
    img: "/images/products/laptop-stand.png",
    stock: 95,
    featured: true,
    highlights: ["6-level adjustable height and ergonomic angle", "Premium aircraft-grade aluminum alloy", "Anti-slip silicone pads and foldable design"]
  },

  // ==========================================
  // 4. STUDY ACCESSORIES
  // ==========================================
  {
    title: "Study Lamp",
    desc: "Eye-care LED desk lamp with adjustable brightness levels, 3 color temperatures, flexible gooseneck, and touch control for comfortable late-night reading.",
    price: 699,
    originalPrice: 1099,
    rating: 4.8,
    reviewsCount: 275,
    category: "Study Accessories",
    badge: "",
    img: "/images/products/study-lamp.png",
    stock: 85,
    featured: true,
    highlights: ["Flicker-free eye protection LED technology", "3 lighting modes: warm, natural & cool white", "Flexible 360-degree bendable gooseneck"]
  },
  {
    title: "Backpack",
    desc: "Spacious, water-resistant college backpack with dedicated padded laptop compartment, multiple organizer pockets, and ergonomic shoulder straps.",
    price: 899,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 360,
    category: "Study Accessories",
    badge: "",
    img: "/images/products/backpack.png",
    stock: 60,
    featured: true,
    highlights: ["Padded sleeve fits up to 15.6-inch laptops", "Water-resistant durable polyester fabric", "Breathable mesh back panel for all-day comfort"]
  },
  {
    title: "Desk Organizer",
    desc: "Multi-compartment metal mesh desktop organizer for neatly arranging pens, sticky notes, calculators, clips, and everyday stationery essentials.",
    price: 299,
    originalPrice: 499,
    rating: 4.7,
    reviewsCount: 190,
    category: "Study Accessories",
    badge: "",
    img: "/images/products/desk-organizer.png",
    stock: 115,
    featured: false,
    highlights: ["Multiple compartments plus pull-out drawer", "Sturdy rust-proof wire mesh construction", "Non-skid rubber feet protect desk surface"]
  },
  {
    title: "Water Bottle",
    desc: "BPA-free insulated stainless steel water bottle that keeps your drinks cold for 24 hours or hot for 12 hours throughout long college days.",
    price: 399,
    originalPrice: 649,
    rating: 4.8,
    reviewsCount: 310,
    category: "Study Accessories",
    badge: "",
    img: "/images/products/water-bottle.png",
    stock: 130,
    featured: false,
    highlights: ["Double-wall vacuum insulation", "Leak-proof airtight cap with carry loop", "Food-grade 18/8 stainless steel, 100% BPA free"]
  },
  {
    title: "Headphones",
    desc: "Over-ear wireless headphones with active noise cancellation, deep bass, 30-hour battery life, and plush earcups for focused study sessions.",
    price: 1299,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 450,
    category: "Study Accessories",
    badge: "",
    img: "/images/products/headphones.png",
    stock: 50,
    featured: true,
    highlights: ["Active Noise Cancellation (ANC) for deep focus", "30-hour playback with fast USB-C charging", "Comfortable memory foam ear cushions"]
  },

  // ==========================================
  // 5. EXAM PREPARATION
  // ==========================================
  {
    title: "GATE CSE Preparation Book",
    desc: "Complete subject-wise guide for GATE Computer Science & IT with theory, formulas, 2000+ MCQs, and solved past exam papers with explanations.",
    price: 749,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 380,
    category: "Exam Preparation",
    badge: "",
    img: "/images/products/gate-cse.png",
    stock: 70,
    featured: true,
    highlights: ["Full syllabus coverage for GATE CS/IT", "Previous 15 years solved papers with solutions", "Chapter-wise weightage and revision cheat sheets"]
  },
  {
    title: "CAT Preparation Guide",
    desc: "Comprehensive prep guide for CAT & MBA entrance tests covering Quantitative Aptitude, Data Interpretation, Logical Reasoning, and Verbal Ability.",
    price: 699,
    originalPrice: 1149,
    rating: 4.8,
    reviewsCount: 290,
    category: "Exam Preparation",
    badge: "",
    img: "/images/products/cat-guide.png",
    stock: 65,
    featured: true,
    highlights: ["QA, DILR, and VARC modules with tiered difficulty", "Shortcuts, speed-math tricks & formula bank", "5 full-length simulated mock tests included"]
  },
  {
    title: "GRE Study Material",
    desc: "Official-style GRE prep book covering Verbal Reasoning, Quantitative Reasoning, Analytical Writing, 1000+ essential vocabulary flashcards, and test drills.",
    price: 799,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 220,
    category: "Exam Preparation",
    badge: "",
    img: "/images/products/gre-material.png",
    stock: 55,
    featured: true,
    highlights: ["High-frequency GRE vocabulary word list", "Quantitative problem-solving strategies and drills", "Sample scoring rubrics for Analytical Writing"]
  },
  {
    title: "UPSC Preparation Book",
    desc: "Essential reference book for UPSC Civil Services Prelims & Mains covering Indian Polity, History, Geography, Economy, and Current Affairs analysis.",
    price: 849,
    originalPrice: 1399,
    rating: 4.8,
    reviewsCount: 310,
    category: "Exam Preparation",
    badge: "",
    img: "/images/products/upsc-prep.png",
    stock: 60,
    featured: true,
    highlights: ["Covers GS Papers 1 to 4 comprehensively", "Mind-maps and summary charts for quick revision", "Previous years Prelims & Mains solved questions"]
  },
  {
    title: "Aptitude & Reasoning Book",
    desc: "Complete handbook for Quantitative Aptitude, Verbal, and Non-Verbal Reasoning for campus placements, banking, SSC, and competitive examinations.",
    price: 499,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 480,
    category: "Exam Preparation",
    badge: "",
    img: "/images/products/aptitude-reasoning.png",
    stock: 100,
    featured: true,
    highlights: ["Over 5000+ solved practice questions", "Speed tips, Vedic math shortcuts and formula handbook", "Ideal for campus recruitment training & competitive tests"]
  }
];

export async function seedDatabase() {
  await connectDB(process.env.MONGODB_URI);

  console.log("🌱 Clearing old database records...");
  await Promise.all([Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})]);

  console.log(`📦 Inserting ${PRODUCTS.length} curated products across 5 categories...`);
  const insertedProducts = await Product.insertMany(PRODUCTS);
  console.log(`✅ Seeded ${insertedProducts.length} products!`);

  console.log("👤 Creating demo accounts...");
  const studentPassword = await bcrypt.hash("student123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const student = await User.create({
    name: "Demo Student",
    email: "student@edukart.com",
    password: studentPassword,
    role: "user",
    address: "Room 402, Block B, Campus Hostel",
    city: "Bangalore",
    pincode: "560001",
    phone: "+91 98765 43210",
    wishlist: [insertedProducts[0]._id, insertedProducts[5]._id, insertedProducts[10]._id]
  });

  const admin = await User.create({
    name: "EduKart Admin",
    email: "admin@edukart.com",
    password: adminPassword,
    role: "admin",
    address: "Admin Block, EduKart Central Office",
    city: "Bangalore",
    pincode: "560001",
    phone: "+91 98765 00000"
  });

  console.log("🛒 Creating initial sample order for Demo Student...");
  await Order.create({
    user: student._id,
    items: [
      {
        product: insertedProducts[0]._id,
        title: insertedProducts[0].title,
        img: insertedProducts[0].img,
        price: insertedProducts[0].price,
        qty: 1
      },
      {
        product: insertedProducts[5]._id,
        title: insertedProducts[5].title,
        img: insertedProducts[5].img,
        price: insertedProducts[5].price,
        qty: 2
      }
    ],
    subtotal: insertedProducts[0].price + insertedProducts[5].price * 2,
    discount: 50,
    shippingFee: 0,
    total: insertedProducts[0].price + insertedProducts[5].price * 2 - 50,
    status: "DELIVERED",
    shippingAddress: {
      fullName: student.name,
      address: student.address,
      city: student.city,
      pincode: student.pincode,
      phone: student.phone
    },
    paymentMethod: "UPI",
    paymentStatus: "COMPLETED"
  });

  console.log("✨ Seeding completed successfully!");
}

if (process.argv[1].endsWith("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
