import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import * as XLSX from "xlsx";
import { LabelData } from "@/types";
import { parseExcelData } from "@/lib/utils";

interface FileUploadProps {
  onDataParsed: (data: LabelData[]) => void;
  hasLabelData: boolean;
}

export interface FileUploadRef {
  clearFile: () => void;
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(({ onDataParsed, hasLabelData }, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref за input елемента
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Функция за изчистване на файла
  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    setIsLoading(false);
    // Изчистваме и input полето
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  // Предоставяме clearFile функцията на родителския компонент
  useImperativeHandle(ref, () => ({
    clearFile
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    // Изчистваме старата грешка
    setError(null);
    // Задаваме състояние на зареждане
    setIsLoading(true);
    
    if (!selectedFile) {
      console.log("Няма избран файл");
      setIsLoading(false);
      return;
    }

    // Проверка за типа на файла
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setError("Bitte wählen Sie eine gültige Excel-Datei (.xlsx oder .xls).");
      setIsLoading(false);
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
        
        // Парсваме данните с нашата функция
        const parsedData = parseExcelData(jsonData);
        
        // Проверяваме дали има парсирани данни
        if (parsedData.length === 0) {
          setError("Die Datei enthält nicht die erforderlichen Spalten 'Artikelbezeichnung' und 'Verkaufspreis\r\nKölle-Zoo' oder enthält keine gültigen Daten.");
          setIsLoading(false);
          return;
        }
        
        // Предаваме данните към родителския компонент
        onDataParsed(parsedData);
        
      } catch (error) {
        console.error("Грешка при четене на файла:", error);
        setError("Fehler beim Verarbeiten der Datei. Bitte überprüfen Sie die Dateistruktur.");
      } finally {
        // Спираме зареждането винаги след края на операцията
        setIsLoading(false);
      }
    };
    
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="space-y-4 ">
      <div className="flex flex-col space-y-2">
        <label htmlFor="file-upload" className="text-xl text-center font-bold  text-black">
          Excel-Datei auswählen
        </label>
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleUpload}
        disabled={!selectedFile || isLoading || hasLabelData}
        className="w-full cursor-pointer text-xl font-bold bg-black text-[#a8c706] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Wird verarbeitet..." : "Datei hochladen"}
      </Button>
      {selectedFile && (
        <p className="text-xl font-bold text-black">
          Ausgewählte Datei: <span className="text-black text-lg">{selectedFile.name}</span>
        </p>
      )}
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
