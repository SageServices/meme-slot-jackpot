
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  blur?: boolean;
}

const Image: React.FC<ImageProps> = ({ className, blur = true, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <img
      {...props}
      className={cn(
        'transition-all duration-300',
        isLoading && blur ? 'blur-sm scale-110' : 'blur-0 scale-100',
        className
      )}
      onLoad={() => setIsLoading(false)}
      loading="lazy"
    />
  );
};

export default Image;
