import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Armchair, Refrigerator, Trash2, CheckCircle2 } from 'lucide-react';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { 
      category: 'Furniture',
      items: ['Couches & Sofas', 'Mattresses & Box Springs', 'Tables & Chairs', 'Dressers & Cabinets']
    },
    { 
      category: 'Appliances',
      items: ['Refrigerators & Freezers', 'Washers & Dryers', 'Stoves & Ovens', 'Dishwashers']
    },
    { 
      category: 'General Items',
      items: ['Boxes & Clutter', 'Electronics & E-Waste', 'Yard Waste', 'Exercise Equipment']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-32 pb-20 md:pb-32">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Residential Junk Removal Denver</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight mb-6 leading-[1.05]">
                Professional Home Junk Removal in Denver
              </h1>
              
              <div className="space-y-4 mb-8 max-w-lg">
                <p className="text-lg text-gray-700 leading-relaxed">
                  OPEK Junk Removal provides comprehensive residential junk removal services throughout the Denver Metro area. From single-item pickups to complete home cleanouts, our professional team handles every job with efficiency and care.
                </p>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  We specialize in removing furniture, appliances, electronics, yard waste, and general household clutter. Our same-day service is available across Denver, Aurora, Lakewood, Boulder, and surrounding areas. With transparent pricing and eco-friendly disposal practices, we make junk removal simple and stress-free.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/quote')}
                  className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-10 py-4 text-base font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg"
                >
                  Call (303) 555-0199
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src="/opek2.png" 
                  alt="Professional residential junk removal service in Denver" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={18}/>
                    <span className="text-sm font-bold">Same-Day Service • 60% Recycled • Licensed & Insured</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Remove Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
              What We Remove
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4 tracking-tight">
              Items We <span className="text-gray-400">Haul Away</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              From furniture to appliances, we handle virtually any unwanted item from your Denver home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Furniture</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Couches & Sofas</li>
                <li>• Mattresses & Beds</li>
                <li>• Tables & Chairs</li>
                <li>• Dressers & Cabinets</li>
                <li>• Entertainment Centers</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Appliances</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Refrigerators & Freezers</li>
                <li>• Washers & Dryers</li>
                <li>• Stoves & Ovens</li>
                <li>• Dishwashers</li>
                <li>• Water Heaters</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Electronics</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• TVs & Monitors</li>
                <li>• Computers & Laptops</li>
                <li>• Printers & Scanners</li>
                <li>• Stereo Equipment</li>
                <li>• Gaming Consoles</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">General Items</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Boxes & Clutter</li>
                <li>• Yard Waste & Debris</li>
                <li>• Exercise Equipment</li>
                <li>• Patio Furniture</li>
                <li>• Storage Items</li>
              </ul>
            </div>

          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Over 60% of items are donated or recycled. We handle almost everything except hazardous materials.
            </p>
          </div>

        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Professional Residential Junk Removal Services in Denver</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              When it comes to residential junk removal in Denver, homeowners need a service that's reliable, efficient, and environmentally responsible. OPEK Junk Removal has been serving the Greater Denver Metro area since 2018, providing comprehensive junk hauling solutions for homes of all sizes. Whether you're decluttering a single room, clearing out an entire basement, or preparing for a move, our professional team handles every job with the same level of care and attention to detail.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Why Choose Professional Junk Removal?</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Many homeowners underestimate the time, effort, and physical demands of removing large items and accumulated clutter. Professional residential junk removal services save you valuable time and prevent potential injuries from lifting heavy furniture or appliances. Our trained crew comes equipped with the proper tools, vehicles, and expertise to safely remove items from any location in your home, including tight spaces, staircases, and second-story rooms.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Beyond convenience, professional junk removal ensures proper disposal and recycling. At OPEK, we're committed to environmental responsibility—over 60% of the items we collect are either donated to local charities or sent to recycling facilities. This means your old furniture, appliances, and household items get a second life instead of ending up in a landfill.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Same-Day Junk Removal in Denver</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              We understand that junk removal needs can arise unexpectedly. That's why OPEK offers same-day service throughout the Denver Metro area, including Aurora, Lakewood, Boulder, and Castle Rock. Whether you're dealing with a last-minute move, preparing for guests, or simply ready to reclaim your space today, our team can accommodate urgent requests. Just give us a call or book online, and we'll provide you with a convenient time window that fits your schedule.
            </p>
          </div>

          {/* Single Image */}
          <div className="my-12 max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
              <img 
                src="/opek2.png" 
                alt="Same-day junk removal service in Denver Metro area" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-black mb-4 mt-10">Transparent Pricing with No Hidden Fees</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              One of the most common concerns homeowners have about junk removal is pricing uncertainty. At OPEK, we believe in complete transparency. Our pricing is based on the volume of items you need removed—you only pay for the space your junk takes up in our truck. Before we begin any work, we provide a free, no-obligation quote on-site. Once you approve the price, we get to work immediately. There are no hidden fees, no surprise charges, and no pressure to accept our quote.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Full-Service Residential Cleanouts</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Our residential junk removal service is truly full-service. We handle all the heavy lifting, loading, hauling, and cleanup. You don't need to move items to your curb or driveway—we'll go wherever the junk is located. Our team will navigate stairs, tight hallways, and challenging spaces to remove items safely and efficiently. After we're done, we sweep the area clean, leaving your space ready for its next chapter.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Common residential junk removal projects include garage cleanouts, basement clearing, attic decluttering, estate cleanouts, foreclosure cleanups, hoarding situations, moving preparation, and post-renovation debris removal. No job is too big or too small for our experienced team.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Eco-Friendly Disposal Practices</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Environmental responsibility is at the core of our business. We partner with local donation centers, recycling facilities, and proper disposal sites to ensure your unwanted items are handled responsibly. Furniture in good condition is donated to organizations that help families in need. Appliances are recycled according to Colorado environmental regulations, with refrigerants and hazardous materials properly extracted. Electronics are sent to certified e-waste recycling centers. Only items that cannot be donated or recycled are taken to licensed disposal facilities.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Licensed, Insured, and Professional</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              OPEK Junk Removal is fully licensed and insured, giving you peace of mind that your property is protected during the removal process. Our team members are background-checked, uniformed professionals who treat your home with respect. We take care to protect floors, walls, and doorways while removing items, and we're experienced in handling delicate situations with discretion and professionalism.
            </p>

            <h3 className="text-2xl font-black text-black mb-4 mt-10">Serving the Greater Denver Metro Area</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Our residential junk removal services cover the entire Denver Metro area and surrounding communities. Whether you're in downtown Denver, the suburbs, or outlying areas within a 50-mile radius, OPEK is ready to help. We're familiar with local regulations, donation centers, and recycling facilities, ensuring efficient service no matter where you're located.
            </p>

            <p className="text-gray-700 leading-relaxed mb-10">
              Ready to reclaim your space? Contact OPEK Junk Removal today for a free quote. Our friendly team is standing by to answer your questions and schedule your residential junk removal service at a time that's convenient for you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-2 border-gray-200 max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/quote')}
              className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
            >
              Get Free Quote
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-4 text-base font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg"
            >
              Contact Us
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
