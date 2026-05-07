import { motion } from 'framer-motion';
import FloatingInfoCard from './FloatingInfoCard.jsx';

const images = {
  large:
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
  smallTop:
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80',
  smallBottom:
    'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=900&q=80',
};

function ImgCard({ src, alt, className = '', label, labelClassName = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-2xl shadow-xl shadow-emerald-900/10 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {label && (
        <div className={`absolute inset-x-0 flex justify-center ${labelClassName}`}>
          <FloatingInfoCard label={label} className="shadow-md" />
        </div>
      )}
    </motion.div>
  );
}

export default function SustainabilityImageGrid() {
  return (
    <div className="relative grid grid-cols-5 gap-4">
      <div className="col-span-3">
        <ImgCard
          src={images.large}
          alt="Biogas and renewable energy infrastructure"
          className="h-[360px]"
          label="Sustainable Solutions"
          labelClassName="top-4"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <div>
          <ImgCard
            src={images.smallTop}
            alt="Sustainability and clean energy"
            className="h-[172px]"
            label="AI-Powered Discovery"
            labelClassName="top-3"
          />
        </div>
        <div>
          <ImgCard
            src={images.smallBottom}
            alt="Scientific biotech laboratory"
            className="h-[172px]"
            label="Science for Sustainability"
            labelClassName="top-3"
          />
        </div>
      </div>
    </div>
  );
}
