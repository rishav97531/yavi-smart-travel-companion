import { motion } from 'framer-motion';
import { Thermometer, Cloud, Wind, Droplets } from 'lucide-react';

const WeatherWidget = ({ weather }) => {
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-white/5 to-yavi-blue/5"
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-heading font-bold text-white">Current Weather</h3>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-yavi-blue shadow-lg">
            <Cloud size={24} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-6xl font-heading font-extrabold text-white">{weather.temp}°</span>
          <span className="text-2xl text-gray-400 font-medium select-none">C</span>
        </div>
        
        <p className="text-lg text-gray-300 capitalize mb-6 flex items-center gap-2">
          <Thermometer size={18} className="text-yavi-teal" />
          {weather.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Wind size={20} className="text-yavi-blue" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Wind</p>
            <p className="text-sm font-bold text-white">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <Droplets size={20} className="text-yavi-teal" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Humidity</p>
            <p className="text-sm font-bold text-white">{weather.humidity}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
