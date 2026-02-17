'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function PageSectionsEditor() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Page Sections</h1>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <CardTitle className="text-blue-900">Firebase Configuration Required</CardTitle>
              <p className="text-sm text-blue-700 mt-2">
                Please complete Firebase setup to edit page sections.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            See <code className="bg-white px-2 py-1 rounded">FIREBASE_SETUP.md</code> for setup instructions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
