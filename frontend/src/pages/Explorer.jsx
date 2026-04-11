import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Info, ExternalLink, Globe, Sparkles, Navigation } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import toast from 'react-hot-toast';

// Enhanced Components
import DestinationMap from '../components/Explorer/DestinationMap';
import WeatherWidget from '../components/Explorer/WeatherWidget';
import NearbyPlacesGrid from '../components/Explorer/NearbyPlacesGrid';
import ImageGallery from '../components/Explorer/ImageGallery';

const Explorer = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [wiki, setWiki] = useState(null);
  const [places, setPlaces] = useState([]);
  
  // Enhanced States
  const [weather, setWeather] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [gallery, setGallery] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setWiki(null);
    setPlaces([]);

    try {
      // Fetch Wiki Summary
      const wikiResponse = await fetchWithAuth(`/api/places/wiki/${encodeURIComponent(search)}`);
      if (wikiResponse.ok) {
        const wikiData = await wikiResponse.json();
        setWiki(wikiData);
      }

      // Fetch Places
      const placesResponse = await fetchWithAuth(`/api/places/${encodeURIComponent(search)}`);
      let locationData = null;
      if (placesResponse.ok) {
        const placesData = await placesResponse.json();
        setPlaces(placesData);
        if (placesData.length > 0) locationData = placesData[0].location;
      } else {
        toast.error('Could not find places for this location.');
      }

      // 1. Fetch Weather
      const weatherRes = await fetchWithAuth(`/api/places/weather/${encodeURIComponent(search)}`);
      if (weatherRes.ok) setWeather(await weatherRes.json());

      // 2. Fetch Images
      const imagesRes = await fetchWithAuth(`/api/places/images/${encodeURIComponent(search)}`);
      if (imagesRes.ok) setGallery(await imagesRes.json());

      // 3. Fetch Nearby Attractions (If location coordinates are available)
      if (locationData) {
        const nearbyRes = await fetchWithAuth(`/api/places/nearby?lat=${locationData.lat}&lon=${locationData.lng}`);
        if (nearbyRes.ok) setNearby(await nearbyRes.json());
      }
    } catch (error) {
      toast.error('An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-yavi-teal/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-yavi-blue/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yavi-blue text-xs font-bold uppercase tracking-widest mb-6">
            <Globe size={14} />
            Global Discovery Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Destination <span className="gradient-text">Explorer</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yavi-teal transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a city (e.g., Paris, Tokyo, Bali)..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-32 py-5 text-white text-lg focus:outline-none focus:border-yavi-teal transition-all shadow-xl"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yavi-teal to-yavi-blue px-8 py-3 rounded-2xl text-white font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? <Sparkles className="animate-spin" /> : 'Explore'}
            </button>
          </form>
        </motion.div>

        <AnimatePresence>
          {wiki && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-[1fr_350px] gap-8 mb-16"
            >
              <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-heading font-bold mb-6 text-white">{wiki.title}</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {wiki.extract}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={wiki.contentUrls} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-gray-300 transition-all"
                    >
                      Read full Wiki <ExternalLink size={16} />
                    </a>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yavi-teal/10 text-yavi-teal text-sm font-bold border border-yavi-teal/20">
                      <Navigation size={16} /> 
                      Top Destination
                    </div>
                  </div>
                </div>
                {/* Abstract decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yavi-teal/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {wiki.thumbnail && (
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative h-[400px] lg:h-auto">
                  <img 
                    src={wiki.thumbnail} 
                    alt={wiki.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-lg font-bold">{wiki.description}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Enhanced Feature Section: Map & Weather */}
          {wiki && (
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-16">
              <DestinationMap 
                lat={places[0]?.location?.lat} 
                lng={places[0]?.location?.lng} 
                title={wiki.title} 
                markers={nearby.map(n => ({ lat: n.lat, lng: n.lon, name: n.name }))}
              />
              <WeatherWidget weather={weather} />
            </div>
          )}

          {places.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                  Popular <span className="gradient-text">Attractions</span>
                </h2>
                <div className="text-gray-500 text-sm font-medium">
                  Showing {places.length} top locations
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {places.map((place, i) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -10 }}
                    className="glass-card flex flex-col group"
                  >
                    <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                      {place.photoReference ? (
                        <img 
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSy'}`}
                          alt={place.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-600">
                          <MapPin size={40} />
                        </div>
                      )}
                      {place.rating && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-bold text-amber-400">
                          <Star size={14} fill="currentColor" />
                          {place.rating}
                        </div>
                      )}
                    </div>
                    
                    <div className="px-2">
                       <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yavi-teal transition-colors">{place.name}</h3>
                       <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
                         <MapPin size={16} className="shrink-0 mt-0.5" />
                         <span className="line-clamp-2">{place.address}</span>
                       </div>
                       
                       <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between font-bold">
                          <span className="text-xs text-yavi-blue uppercase tracking-widest">
                            {place.types[0].replace(/_/g, ' ')}
                          </span>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Info size={18} />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && !wiki && !places.length && search && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-600">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-300">No results found</h3>
              <p className="text-gray-500">Try searching for a different city or destination.</p>
            </motion.div>
          )}

          {/* Enhanced Feature Sections: Nearby & Gallery */}
          {nearby.length > 0 && <NearbyPlacesGrid places={nearby} />}
          {gallery.length > 0 && <ImageGallery images={gallery} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Explorer;
