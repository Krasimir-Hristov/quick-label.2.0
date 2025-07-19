import { Button } from "@/components/ui/button";

export default function FileUpload() {
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
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <Button className="w-full">
        Качи файл
      </Button>
    </div>
  );
}
