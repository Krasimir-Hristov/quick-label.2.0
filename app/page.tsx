import { FeatureCard } from '@/components/shared/FeatureCard';
import { Tag, FileText, BarChart3, Settings, PawPrint } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-4 mb-4'>
              <PawPrint className='w-10 h-10 text-[#a8c706]' />
              <h1 className='text-5xl font-bold text-white'>KÖLLE ZOO</h1>
              <PawPrint className='w-10 h-10 text-[#a8c706]' />
            </div>
            <p className='text-xl text-gray-300'>
              Wählen Sie die Funktionalität, mit der Sie arbeiten möchten
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            <FeatureCard
              title='Etiketten'
              description='Generieren Sie professionelle Etiketten aus Excel-Dateien. Unterstützung für mehrere Produkte und automatische Formatierung.'
              href='/labels'
              icon={Tag}
              isActive={true}
              badge='Aktiv'
            />

            <FeatureCard
              title='Rechnungen'
              description='Erstellen und verwalten Sie Rechnungen. Automatische Berechnung von Summen und Generierung von PDF-Dokumenten.'
              href='/invoices'
              icon={FileText}
              isActive={false}
            />

            <FeatureCard
              title='Berichte'
              description='Überblick über Statistiken und Analysen. Visualisierung von Daten und Export in verschiedene Formate.'
              href='/reports'
              icon={BarChart3}
              isActive={false}
            />

            <FeatureCard
              title='Einstellungen'
              description='Systemkonfiguration. Verwaltung von Benutzern, Vorlagen und Präferenzen.'
              href='/settings'
              icon={Settings}
              isActive={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
