'use client';

import { useState } from 'react';
import { AlertTriangle, Bug, Database, FileX } from 'lucide-react';

interface ErrorTestPanelProps {
  onTestError: (errorType: string) => void;
}

export default function ErrorTestPanel({ onTestError }: ErrorTestPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const errorTests = [
    {
      id: 'localStorage',
      name: 'Test localStorage Errors',
      description: 'Simulate localStorage quota exceeded and corruption',
      icon: Database,
      action: () => {
        // Test localStorage quota
        try {
          const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB string
          localStorage.setItem('test-quota', largeData);
        } catch (error) {
          console.log('Quota error triggered:', error);
          alert('localStorage quota error triggered!');
        }
        
        // Test corrupt data
        localStorage.setItem('pokemon-wishlist', 'invalid json data');
        onTestError('localStorage');
      }
    },
    {
      id: 'filtering',
      name: 'Test Filter Edge Cases',
      description: 'Test filtering with null/undefined values',
      icon: Bug,
      action: () => {
        onTestError('filtering');
      }
    },
    {
      id: 'export',
      name: 'Test Export Errors',
      description: 'Test Excel export with invalid data',
      icon: FileX,
      action: () => {
        // Try to export invalid data
        const invalidData = [
          null,
          { label: null },
          { label: { eng: null } },
          undefined
        ] as any;
        
        try {
          const { exportCardsToExcel } = require('@/lib/excel');
          exportCardsToExcel(invalidData);
        } catch (error) {
          console.log('Export error triggered:', error);
        }
        
        onTestError('export');
      }
    },
    {
      id: 'memory',
      name: 'Test Memory Issues',
      description: 'Create large arrays to test memory handling',
      icon: AlertTriangle,
      action: () => {
        // Create a large array to test memory
        try {
          const largeArray = new Array(1000000).fill({
            set: 'TEST',
            number: 1,
            label: { eng: 'Test Pokemon'.repeat(100) },
            rarity: 'Common',
            packs: new Array(1000).fill('Test Pack')
          });
          
          console.log('Large array created:', largeArray.length);
          onTestError('memory');
        } catch (error) {
          console.log('Memory error:', error);
          alert('Memory error triggered!');
        }
      }
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
        title="Open Error Test Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Bug className="w-4 h-4 text-red-600" />
          Error Testing
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        {errorTests.map((test) => {
          const IconComponent = test.icon;
          return (
            <button
              key={test.id}
              onClick={test.action}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <IconComponent className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{test.name}</div>
                  <div className="text-xs text-gray-500">{test.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          ⚠️ These tests will trigger errors for debugging purposes
        </div>
      </div>
    </div>
  );
}