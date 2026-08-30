# DWS IQ Mobile Dashboard

A comprehensive mobile application for construction project management and portfolio oversight, built for NCC Corporate.

## 📋 Overview

DWS IQ Mobile Dashboard is a real-time analytics and project management platform designed specifically for construction industry professionals. It provides KPI tracking, portfolio management, and instant access to critical project metrics.

### Key Features

- **Real-time KPI Monitoring** - Track construction project performance indicators
- **Portfolio Management** - Oversee multiple projects simultaneously
- **Performance Analytics** - Detailed project metrics and trend analysis
- **Budget Tracking** - Real-time cost and budget monitoring
- **Team Collaboration** - Project updates and communication tools
- **Offline Support** - Access key data when connectivity is limited
- **Mobile-First Design** - Optimized for iOS and Android devices

## 🎯 Target Audience

- NCC Corporate project managers
- Construction site supervisors
- Portfolio directors
- Financial controllers
- Executive stakeholders

## 🏗️ Project Structure

```
mobile-dashboard/
├── src/
│   ├── components/        # Reusable React Native components
│   ├── screens/           # Screen components for navigation
│   ├── services/          # API and data services
│   ├── utils/             # Utility functions and helpers
│   ├── hooks/             # Custom React hooks
│   ├── context/           # Global state management
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
│   ├── images/
│   └── icons/
├── docs/                  # Project documentation
├── tests/                 # Test files
├── config/                # Configuration files
├── .github/workflows/     # CI/CD workflows
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: React Native / Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit / Context API
- **UI Components**: React Native Paper (standardized 2026-07-03 — matches Firehorse/mobile-app; NativeBase dropped as unmaintained)
- **Data Fetching**: Axios / TanStack Query
- **Testing**: Jest / Detox
- **CI/CD**: GitHub Actions

## 📱 Core Screens

1. **Dashboard** - Overview of key metrics and alerts
2. **Projects** - Portfolio view of all active projects
3. **Project Details** - Deep dive into individual project KPIs
4. **Budget & Costs** - Financial tracking and analysis
5. **Team** - Project team management and communication
6. **Reports** - Custom report generation and export
7. **Settings** - User preferences and account management

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Expo CLI
- iOS/Android development environment

### Installation

```bash
cd mobile-dashboard
npm install
npm start
```

### Development

```bash
npm run dev           # Start development server
npm run test          # Run tests
npm run lint          # Run linter
npm run build         # Build for production
```

## 📊 KPI Dashboard Components

### Primary KPIs

- **Schedule Performance** - Timeline adherence metrics
- **Budget Performance** - Cost control and burn rate
- **Safety Metrics** - Incident rates and safety compliance
- **Quality Metrics** - Defect rates and rework percentages
- **Resource Utilization** - Equipment and workforce efficiency
- **Weather Impact** - Environmental factors affecting schedule

## 🔐 Security

- End-to-end encryption for sensitive data
- OAuth 2.0 authentication
- Role-based access control (RBAC)
- Secure API communication
- Data validation and sanitization
- Regular security audits

## 📈 Performance Targets

- App load time: < 2 seconds
- Screen navigation: < 300ms
- API response time: < 500ms
- Offline functionality: 100% critical features
- Battery consumption: Optimized for 8+ hour operation

## 🤝 Contributing

Guidelines for contributing to the project:

1. Create a feature branch from `main`
2. Follow TypeScript and React Native best practices
3. Write unit tests for new components
4. Submit a pull request with detailed description
5. Ensure CI/CD checks pass

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/SETUP.md)
- [API Integration](./docs/API_INTEGRATION.md)
- [Component Library](./docs/COMPONENTS.md)
- [Testing Guide](./docs/TESTING.md)

## 📄 License

Proprietary - NCC Corporate 2025

## 👥 Team

Created with GitHub Copilot assistance for optimal development velocity.

## 📞 Support

For questions and support, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 23, 2025  
**Status**: In Development

