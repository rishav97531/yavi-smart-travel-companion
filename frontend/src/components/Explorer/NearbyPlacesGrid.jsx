import { motion } from 'framer-motion';
import { Utensils, Hotel, Tent, MapPin, ArrowUpRight } from 'lucide-react';

const CategoryIcon = ({ category }) => {
  if (category.includes('restaurant') || category.includes('catering')) return <Utensils size={18} />;
  if (category.includes('accommodation') || category.includes('hotel')) return <Hotel size={18} />;
  return <Tent size={18} />;
};

const NearbyPlacesGrid = ({ places }) => {
  if (!places || places.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
          Nearby <span className="gradient-text">Discovery</span>
        </h2>
        <div className="text-gray-500 text-sm font-medium">Powered by Geoapify</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="group relative"
          >
            <div className="glass-card p-6 h-full border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                    place.category.includes('catering') ? 'bg-orange-500/10 text-orange-400' : 
                    place.category.includes('accommodation') ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-green-500/10 text-green-400'
                }`}>
                  <CategoryIcon category={place.category} />
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-md">
                  {Math.round(place.distance)}m away
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-yavi-teal transition-colors">
                {place.name}
              </h3>
              
              <div className="flex items-start gap-2 text-gray-400 text-xs mb-4">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-600" />
                <span className="line-clamp-2 leading-relaxed">{place.address}</span>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} className="text-yavi-teal" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlacesGrid;
