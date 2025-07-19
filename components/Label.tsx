



import { LabelData } from "@/types";

interface LabelProps {
  data: LabelData;
}

export default function Label({ data }: LabelProps) {
  // Функция за форматиране на цената, за да е по-чисто в JSX-а
  const formatPrice = (price: number) => {
    // Форматираме до 2 знака и заменяваме точката със запетая
    const formattedPrice = price.toFixed(2).replace('.', ',');
    const [integerPart, decimalPart] = formattedPrice.split(',');
    
    // Проверяваме дали цялата част има 3 или повече цифри (напр. 100+)
    const isLargePrice = integerPart.length >= 3;
    const fontSize = isLargePrice ? '4.7rem' : '5.5rem'; // По-малък шрифт за големи цени

    return (
      <>
        <span 
          className="font-bold text-black leading-none"
          style={{ fontSize }}
        >
          {integerPart}
        </span>
        <span 
          className="font-bold text-black leading-none"
          style={{ fontSize }}
        >
          ,{decimalPart}€
        </span>
      </>
    );
  };
  
  return (
    <div 
      className="relative w-full aspect-[4/4] border-4 rounded-none overflow-hidden flex flex-col" 
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
              width="20" 
              height="40" 
              viewBox="0 0 20 36" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 36L0 22L5 22L5 0L15 0L15 22L20 22L10 36Z" 
                fill="rgb(237, 28, 138)"
              />
            </svg>
          </div>

          {/* Product Name */}
          <div className="text-left">
            <h2 
              className="text-xl font-bold leading-tight text-center break-words"
              style={{ color: 'rgb(146 40 143)' }}
            >
              {data.artikelbezeichnung}
            </h2>
          </div>
        </div>
      </div>

      {/* === ГЛАВЕН КОНТЕЙНЕР ЗА СЪДЪРЖАНИЕТО === */}
      <div className="px-2 py-1 flex-1 flex flex-col">

        {/* === СРЕДЕН БЛОК === */}
        <div className="flex-1 flex flex-col justify-center space-y-0">
          <div className="text-center"> {/* "APP VORTEIL" бадж - залепен за горния border */}
            <div className="bg-black text-white font-bold tracking-wider py-1 px-3 inline-block rounded-full">
              <span className="text-3xl whitespace-nowrap">APP VORTEIL</span>
            </div>
          </div>
          <div className="text-center"> {/* "DEIN PREIS" текст - залепен до горния текст */}
            <p className="text-black text-lg font-bold leading-none mt-1">
              DEIN PREIS MIT DER<br />
              <span className="text-2xl font-bold">KÖLLE ZOO APP</span>
            </p>
          </div>
        </div>
        
        {/* === ДОЛЕН БЛОК (ЦЕНА) === */}
        <div className="text-center -mt-2"> {/* Цена - залепена до горния текст */}
          <span 
            className="font-bold text-black leading-none"
            style={{ fontSize: '4rem', letterSpacing: '-0.05em' }}
          >
            {formatPrice(data.verkaufspreis)}
          </span>
        </div>

      </div>
    </div>
  );
}

