import localFont from 'next/font/local';

// Lexia Std шрифт (TTF)
export const lexiaStd = localFont({
  src: '../../../public/fonts/Lexia_Std.ttf',
  variable: '--font-lexia-std',
  display: 'swap',
});

// DIN Engschrift Std шрифт (OTF)
export const dinEngschriftStd = localFont({
  src: '../../../public/fonts/DINEngschriftStd.otf',
  variable: '--font-din-engschrift-std',
  display: 'swap',
});

// Export за лесно използване
export const fonts = {
  lexiaStd,
  dinEngschriftStd,
};
