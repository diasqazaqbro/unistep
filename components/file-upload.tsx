import { Upload, Loader2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface FileUploaderProps {
  label: string;
  field: string;
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (field: string, file: File) => void | Promise<void>;
}

export function FileUploader({
  label,
  field,
  value,
  onChange,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onChange(field, file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3 relative">
        {isUploading ? (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading file...
          </div>
        ) : value ? (
          <>
            {value.match(/\.(jpg|jpeg|png)$/i) ? (
              <Image
                src={value}
                alt="uploaded file"
                width={100}
                height={100}
                className="mx-auto rounded"
              />
            ) : (
              <p className="text-sm text-gray-700 font-medium">
                File uploaded:{" "}
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Open
                </a>
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Replace File
            </Button>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drag a file here or</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Choose File
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPEG, PNG (max. 5MB)
            </p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
