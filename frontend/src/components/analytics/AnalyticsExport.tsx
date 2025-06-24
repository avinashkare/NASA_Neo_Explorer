import React from 'react';
import { X, Download, FileText, Database, Image } from 'lucide-react';
import { Asteroid } from '../../types/asteroid';

interface AnalyticsExportProps {
  data: Asteroid[];
  onExport: (format: 'json' | 'csv' | 'pdf') => void;
  onClose: () => void;
}

export const AnalyticsExport: React.FC<AnalyticsExportProps> = ({
  data,
  onExport,
  onClose
}) => {
  const exportOptions = [
    {
      format: 'json' as const,
      title: 'JSON Format',
      description: 'Complete data structure for developers',
      icon: <Database className="text-blue-400" size={24} />,
      size: `~${Math.round((JSON.stringify(data).length / 1024))} KB`
    },
    {
      format: 'csv' as const,
      title: 'CSV Format',
      description: 'Spreadsheet compatible format',
      icon: <FileText className="text-green-400" size={24} />,
      size: `~${Math.round((data.length * 20) / 1024)} KB` // Rough estimate
    },
    {
      format: 'pdf' as const,
      title: 'PDF Report',
      description: 'Formatted analytics report',
      icon: <Image className="text-red-400" size={24} />,
      size: 'Variable'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-lg w-full border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Export Analytics Data</h2>
            <p className="text-gray-400">Choose your preferred export format</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => onExport(option.format)}
              className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{data.length} records</span>
                    <span className="text-xs text-gray-500">{option.size}</span>
                  </div>
                </div>
                <Download className="text-gray-400 group-hover:text-white transition-colors" size={20} />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Database className="text-blue-400 mt-0.5" size={16} />
            <div>
              <h4 className="text-blue-300 font-medium text-sm mb-1">Data Information</h4>
              <p className="text-blue-200 text-xs leading-relaxed">
                Export includes filtered asteroid data with orbital parameters, 
                approach data, and risk classifications. Large datasets may take a moment to process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};