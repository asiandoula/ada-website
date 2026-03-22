'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ImportExcelButton() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(file: File) {
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/import-excel', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setResult(`Error: ${data.error}`);
      } else {
        const parts = [];
        if (data.inserted) parts.push(`${data.inserted} added`);
        if (data.updated) parts.push(`${data.updated} updated`);
        if (data.skipped) parts.push(`${data.skipped} unchanged`);
        if (data.errors?.length) parts.push(`${data.errors.length} errors`);
        setResult(parts.join(', ') + ` (${data.total_excel} rows → ${data.total_db} total)`);
        router.refresh();
      }
    } catch {
      setResult('Upload failed — network error');
    }

    setUploading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Importing...' : '📥 Import Excel'}
      </Button>
      {result && (
        <span className={`text-xs ${result.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {result}
        </span>
      )}
    </div>
  );
}
