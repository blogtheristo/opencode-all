'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

/**
 * Code of Conduct Carousel Component
 * 
 * Displays company Code of Conduct in an interactive carousel format
 * Optimized for sub-100ms render performance with lazy loading
 * 
 * @component
 * @example
 * ```tsx
 * <CodeOfConductCarousel />
 * ```
 */

interface CodeSection {
  id: number;
  titleFi: string;
  titleEn: string;
  icon: string;
  summaryFi: string;
  summaryEn: string;
  color: string;
}

const codeOfConductSections: CodeSection[] = [
  {
    id: 1,
    titleFi: 'Missio ja Arvot',
    titleEn: 'Mission and Values',
    icon: '🎯',
    summaryFi: 'Kiihdytämme siirtymää perinteisjärjestelmistä älykkääseen päätöksentekoon. Sub-100ms vasteajat, EU-dataturvallisuus, ja ilmastovastuullisuus ovat standardimme.',
    summaryEn: 'We accelerate the transition from legacy operations to intelligent decisioning. Sub-100ms response times, EU data security, and climate responsibility are our standards.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    titleFi: 'Ammatillinen Käytös',
    titleEn: 'Professional Conduct',
    icon: '🤝',
    summaryFi: 'Lupaa vain mitä voidaan toimittaa. Code review pakollinen. Dokumentoi päätökset. Core hours 10-15 EET. Response time < 2h työaikana.',
    summaryEn: 'Promise only what can be delivered. Mandatory code review. Document decisions. Core hours 10-15 EET. Response time < 2h during work hours.',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 3,
    titleFi: 'Tietoturva ja Tietosuoja',
    titleEn: 'Data Security and Privacy',
    icon: '🔒',
    summaryFi: 'EU-compliance pakollinen. Kaikki asiakasdata EU-alueella. 2FA kaikille järjestelmille. Zero-knowledge encryption. GDPR-compliance quarterly audit.',
    summaryEn: 'EU compliance mandatory. All customer data in EU region. 2FA for all systems. Zero-knowledge encryption. GDPR compliance quarterly audit.',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 4,
    titleFi: 'Tekniset Standardit',
    titleEn: 'Technical Standards',
    icon: '⚙️',
    summaryFi: 'Sub-100ms inference 99th percentile. TypeScript strict mode. 80% test coverage. Infrastructure as Code. Disaster recovery: RTO < 4h, RPO < 15min.',
    summaryEn: 'Sub-100ms inference at 99th percentile. TypeScript strict mode. 80% test coverage. Infrastructure as Code. Disaster recovery: RTO < 4h, RPO < 15min.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 5,
    titleFi: 'Liiketoiminnan Etiikka',
    titleEn: 'Business Ethics',
    icon: '💼',
    summaryFi: 'Kiinteät hinnat kirjallisesti. Läpinäkyvä kustannusraportointi. Ei vendor lock-in. LTV:CAC 6.8-8.3:1. Open source contributions.',
    summaryEn: 'Fixed prices in writing. Transparent cost reporting. No vendor lock-in. LTV:CAC 6.8-8.3:1. Open source contributions.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 6,
    titleFi: 'Ympäristövastuu',
    titleEn: 'Environmental Responsibility',
    icon: '🌱',
    summaryFi: 'Google Cloud 100% uusiutuva energia. NVIDIA Jetson 5-15W per device. Paperless operations 95% recycling. CO2-vähennykset raportointi.',
    summaryEn: 'Google Cloud 100% renewable energy. NVIDIA Jetson 5-15W per device. Paperless operations 95% recycling. CO2 reduction reporting.',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 7,
    titleFi: 'Työhyvinvointi',
    titleEn: 'Workplace Wellbeing',
    icon: '❤️',
    summaryFi: '25 päivää lomaa + lomat. Ei 24/7 saavutettavuutta. €2000/vuosi koulutusbudjetti. Unlimited kirjabudjetti. Mental health support.',
    summaryEn: '25 days vacation + holidays. No 24/7 availability. €2000/year training budget. Unlimited book budget. Mental health support.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 8,
    titleFi: 'Riitojen Ratkaisu',
    titleEn: 'Conflict Resolution',
    icon: '⚖️',
    summaryFi: '4-vaiheinen prosessi. Anonyymi whistleblowing: ethics@lifetime.fi. Zero retaliation. 48h kuittaus. Transparent communication.',
    summaryEn: '4-step process. Anonymous whistleblowing: ethics@lifetime.fi. Zero retaliation. 48h acknowledgment. Transparent communication.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 9,
    titleFi: 'Compliance ja Auditointi',
    titleEn: 'Compliance and Auditing',
    icon: '📋',
    summaryFi: 'Quarterly GDPR audit. Puolivuosittain security audit. Vuosittain financial audit. 7v retention financial, 3v operational.',
    summaryEn: 'Quarterly GDPR audit. Biannual security audit. Annual financial audit. 7y retention financial, 3y operational.',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 10,
    titleFi: 'Toimintaohjeiden Noudattaminen',
    titleEn: 'Code Adherence',
    icon: '✅',
    summaryFi: 'Allekirjoitus työsopimuksessa. Vuosittainen päivityskoulutus. Pull request -prosessi muutosehdotuksille. Living document v1.0.0.',
    summaryEn: 'Signature upon employment. Annual refresher training. Pull request process for changes. Living document v1.0.0.',
    color: 'from-orange-500 to-orange-600'
  }
];

export default function CodeOfConductCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [language, setLanguage] = useState<'fi' | 'en'>('fi');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % codeOfConductSections.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % codeOfConductSections.length);
    setIsAutoPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? codeOfConductSections.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentSection = codeOfConductSections[currentSlide];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {language === 'fi' ? 'Toimintaohjeet' : 'Code of Conduct'}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {language === 'fi' 
            ? 'Kirjalliset toimintaohjeet, joihin voit tukeutua. Living document, versio 1.0.0.'
            : 'Written guidelines you can rely on. Living document, version 1.0.0.'}
        </p>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => setLanguage('fi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              language === 'fi'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Suomi
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide Content */}
        <div className={`bg-gradient-to-br ${currentSection.color} p-8 md:p-12 min-h-[400px] flex flex-col justify-between`}>
          <div>
            {/* Section Number and Icon */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-white/80 text-sm font-semibold">
                {currentSlide + 1} / {codeOfConductSections.length}
              </span>
              <span className="text-5xl">{currentSection.icon}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'fi' ? currentSection.titleFi : currentSection.titleEn}
            </h3>

            {/* Summary */}
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              {language === 'fi' ? currentSection.summaryFi : currentSection.summaryEn}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {codeOfConductSections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Auto-play Indicator */}
        {isAutoPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-[6000ms] ease-linear"
              style={{ width: '100%' }}
              key={currentSlide} // Re-trigger animation on slide change
            />
          </div>
        )}
      </div>

      {/* Download Full Document */}
      <div className="mt-8 text-center">
        <a
          href="/documents/code-of-conduct.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Download className="w-5 h-5" />
          <span>
            {language === 'fi' 
              ? 'Lataa täydellinen dokumentti (PDF)'
              : 'Download Full Document (PDF)'}
          </span>
        </a>
      </div>

      {/* Additional Info */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'fi' ? 'Living Document' : 'Living Document'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'fi'
              ? 'Päivitetään kvartaalittain tiimin feedbackin perusteella'
              : 'Updated quarterly based on team feedback'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'fi' ? 'EU Compliance' : 'EU Compliance'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'fi'
              ? 'GDPR-compliance quarterly audit, data residency EU'
              : 'GDPR compliance quarterly audit, data residency EU'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'fi' ? 'Tekninen Erinomainen' : 'Technical Excellence'}
          </h4>
          <p className="text-sm text-gray-600">
            {language === 'fi'
              ? 'Sub-100ms standardit, 80% test coverage'
              : 'Sub-100ms standards, 80% test coverage'}
          </p>
        </div>
      </div>

      {/* Contact for Questions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
        <p className="text-gray-700">
          {language === 'fi'
            ? 'Kysymyksiä toimintaohjeista? Ota yhteyttä: '
            : 'Questions about the Code of Conduct? Contact: '}
          <a href="mailto:ethics@lifetime.fi" className="text-blue-600 hover:underline font-semibold">
            ethics@lifetime.fi
          </a>
        </p>
      </div>
    </div>
  );
}
