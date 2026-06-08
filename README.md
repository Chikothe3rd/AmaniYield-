# AmaniYield - Agricultural Marketplace & Climate Intelligence Platform

A full-stack application combining agricultural marketplace features with real-time climate data and yield predictions using AI/ML.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0+
- npm 9.0.0+
- PostgreSQL database
- Git

### Local Development Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd AmaniYield

# 2. Install dependencies
npm run setup

# 3. Create environment file
cp .env.example .env.local

# 4. Configure your local environment variables
# Edit .env.local with your database URL and API keys

# 5. Run database migrations
npm run db:migrate

# 6. Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
AmaniYield/
├── frontend/                 # Next.js 16 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/         # API route handlers
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── dashboard/   # User dashboards
│   │   │   └── marketplace/ # Marketplace pages
│   │   ├── components/      # Reusable React components
│   │   └── context/         # React context providers
│   └── package.json
│
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── routes/          # API endpoint handlers
│   │   │   ├── auth.ts
│   │   │   ├── marketplace.ts
│   │   │   ├── scan.ts
│   │   │   ├── reports.ts
│   │   │   └── ussd.ts
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   └── package.json
│
├── database/                # Database schema & migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migration history
│
├── mobile/                  # React Native mobile app
│   └── screens/
│
├── vercel.json              # Vercel deployment config
├── DEPLOYMENT.md            # Detailed deployment guide
└── package.json             # Root workspace config
```

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.4
- **Styling**: Tailwind CSS 4
- **Maps**: React Leaflet 5
- **Build Tool**: TypeScript 5

### Backend
- **Framework**: Express.js 4
- **Database ORM**: Prisma 5
- **Database**: PostgreSQL
- **Authentication**: JWT + bcryptjs
- **API Testing**: Axios

### DevOps
- **Hosting**: Vercel (recommended)
- **Database**: PostgreSQL (any provider)
- **CI/CD**: Vercel (automatic)

## 📱 Key Features

### For Farmers
- Real-time weather data and climate predictions
- Yield forecasting with AI/ML
- Farm management dashboard
- Direct marketplace access

### For Youth
- Agricultural marketplace for buying/selling
- Product scanning and verification
- Farmer network connectivity

### For Buyers/Wholesalers
- Direct access to farmers
- Supply chain transparency
- Market analytics and reporting

### For NGOs
- Farmer support programs
- Weather alerts
- Market data reporting

## 🔐 Security Features

- ✓ JWT-based authentication
- ✓ Password hashing with bcryptjs
- ✓ CORS protection
- ✓ Security headers (CSP, X-Frame-Options, etc.)
- ✓ HTTPS enforced in production
- ✓ Environment variable protection
- ✓ Rate limiting ready
- ✓ SQL injection prevention (Prisma ORM)

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:
- **Users**: Farmers, Buyers, Youth, NGOs
- **Products**: Marketplace items and yields
- **Scans**: Product verification records
- **Reports**: Analytics and weather data
- **USSD Sessions**: SMS-based interactions

See [database/schema.prisma](database/schema.prisma) for complete schema.

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

**Frontend Only (Easiest)**

```bash
cd frontend
vercel deploy --prod
```

**Full Stack (Monorepo)**

```bash
vercel deploy --prod
```

**Environment Variables Required:**
```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=your_frontend_url
WEATHER_API_KEY=your_weather_api_key
BACKEND_API_URL=your_backend_api_url (if separate deployment)
```

### Deploy Backend Separately (Optional)

Choose any Node.js hosting platform:
- Railway
- Heroku
- AWS
- Google Cloud
- DigitalOcean

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📝 Available Scripts

### Root Level
```bash
npm run dev              # Start all dev servers
npm run build            # Build both frontend and backend
npm start                # Start production backend
npm run lint             # Lint frontend code
npm run setup            # Install deps + run migrations
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
```

### Frontend Specific
```bash
cd frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

### Backend Specific
```bash
cd backend
npm run dev              # Start Express dev server
npm run build            # Compile TypeScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI
```

## 🧪 Testing

```bash
# Backend API testing
cd backend
npm test

# Frontend component testing (setup needed)
cd frontend
# Add test framework and run tests
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Marketplace
- `GET /api/marketplace/products` - List products
- `POST /api/marketplace/products` - Create product
- `GET /api/marketplace/products/:id` - Get product details

### Scanning
- `POST /api/scan/upload` - Upload crop scan
- `GET /api/scan/:id` - Get scan results

### Reports
- `GET /api/reports` - Get user reports
- `POST /api/reports` - Create new report

### USSD
- `POST /api/ussd/session` - Handle USSD session

Full API documentation available at `/api/docs` (when Swagger is configured).

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Team

- **Backend Lead**: [Name]
- **Frontend Lead**: [Name]
- **Mobile Lead**: [Name]
- **DevOps**: [Name]

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check existing issues and documentation

## 🔄 Troubleshooting

### Port already in use
```bash
# Backend on different port
PORT=3001 npm run dev -w backend
```

### Database connection issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall rules for database access

### CORS errors
- Update ALLOWED_ORIGINS in backend
- Verify NEXT_PUBLIC_API_URL is set correctly

### Build failures
- Clear node_modules and reinstall: `npm install`
- Clear Next.js cache: `rm -rf frontend/.next`
- Clear TypeScript build: `rm -rf backend/dist`

## 🎯 Roadmap

- [ ] Mobile app (React Native) deployment
- [ ] Advanced ML yield predictions
- [ ] SMS/USSD expanded features
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Blockchain supply chain tracking
- [ ] Offline mode for mobile

---

**AmaniYield** - Bringing technology to African agriculture 🌾
