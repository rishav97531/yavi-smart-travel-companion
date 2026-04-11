import { motion } from 'framer-motion';
import { Camera, ExternalLink } from 'lucide-react';

const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white flex items-center gap-3">
          <Camera className="text-yavi-purple" /> Destination <span className="gradient-text">Visuals</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <motion.a
            key={img.id}
            href={img.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ y: -5 }}
            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10"
          >
            <img 
              src={img.url} 
              alt={img.alt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
               <p className="text-xs text-yavi-teal font-bold uppercase tracking-widest mb-1">Photography by</p>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-white truncate mr-2">{img.user}</span>
                 <ExternalLink size={14} className="text-white shrink-0" />
               </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
