



import { LabelData } from "@/types";

interface LabelProps {
  data: LabelData;
}

export default function Label({ data }: LabelProps) {
  // Функция за форматиране на цената, за да е по-чисто в JSX-а
  const formatPrice = (price: number) => {
    // Форматираме до 2 знака и заменяме точката със запетая
    const formattedPrice = price.toFixed(2).replace('.', ',');
    const [integerPart, decimalPart] = formattedPrice.split(',');

    return (
      <>
        {integerPart}
        <span className="text-7xl">,{decimalPart}€</span>
      </>
    );
  };
  
  return (
    <div 
      className="relative w-full max-w-xs mx-auto border-4 rounded-none overflow-hidden flex flex-col" 
      style={{ 
        backgroundColor: 'rgb(249, 165, 37)',
        borderColor: 'rgb(128, 128, 128)',
      }}
    >
      {/* Top Section with Arrow and Product Name */}
      <div className="relative border-b-2 border-gray-400 p-2">
        <div className="flex items-start gap-x-2">
          {/* Pink Arrow */}
          <div className="flex-shrink-0 pt-1">
            <svg 
              width="16" 
              height="24" 
              viewBox="0 0 20 28" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 28L0 14L5 14L5 0L15 0L15 14L20 14L10 28Z" 
                fill="rgb(237, 28, 138)"
              />
            </svg>
          </div>

          {/* Product Name */}
          <div className="text-left">
            <h2 
              className="text-xl font-bold leading-tight break-words"
              style={{ color: 'rgb(146 40 143)' }}
            >
              {data.artikelbezeichnung}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Container - Takes the remaining space */}
      <div className="px-4 py-2 flex-1 flex flex-col">
        {/* APP VORTEIL Badge */}
        <div className="text-center mt-2">
          <div className="bg-black text-white font-bold tracking-wider py-2 px-4 inline-block rounded-full">
            <span className="text-4xl">APP VORTEIL</span>
          </div>
        </div>

        {/* Description Text */}
        <div className="text-center mt-2">
          <p className="text-black text-2xl font-bold leading-tight">
            DEIN PREIS MIT DER<br />
            <span className="text-3xl font-bold">KÖLLE ZOO APP</span>
          </p>
        </div>

        {/* Price Section - Pushed to the bottom */}
        <div className="mt-auto text-center pb-2">
          <span 
            className="font-bold text-black leading-none"
            style={{ fontSize: '7rem', letterSpacing: '-0.07em' }}
          >
            {formatPrice(data.verkaufspreis)}
          </span>
        </div>
      </div>
    </div>
  );
}

