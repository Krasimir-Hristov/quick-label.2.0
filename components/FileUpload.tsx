import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as XLSX from "xlsx";
import { LabelData } from "@/types";
import { parseExcelData } from "@/lib/utils";

interface FileUploadProps {
  onDataParsed: (data: LabelData[]) => void;
}

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.log("Няма избран файл");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        
        // Вземаме първия лист
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Конвертираме в JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Excel данни в JSON формат:", jsonData);
        console.log("Брой редове:", jsonData.length);
        
        // Парсваме данните с нашата функция
        const parsedData = parseExcelData(jsonData);
        console.log("Парсвани данни:", parsedData);
        console.log("Брой парсвани елементи:", parsedData.length);
        
        // Предаваме данните към родителския компонент
        console.log("Извиквам onDataParsed с данни:", parsedData);
        onDataParsed(parsedData);
        
      } catch (error) {
        console.error("Грешка при четене на файла:", error);
      }
    };
    
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
          Избери Excel файл
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <Button 
        onClick={handleUpload}
        disabled={!selectedFile}
        className="w-full"
      >
        Качи файл
      </Button>
      {selectedFile && (
        <p className="text-sm text-gray-600">
          Избран файл: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
