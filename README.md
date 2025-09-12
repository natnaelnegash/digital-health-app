# Digital Health System - Administrative Backend with Prisma

A comprehensive Node.js backend API using **Prisma ORM** and **Docker** for the Digital Health Appointment and Records System, focusing on administrative functions.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Clone and Start
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd digital-health-admin-backend

# Start all services with Docker Compose
docker-compose up -d

# Check if services are running
docker-compose ps
\`\`\`

### 2. Initialize Database
\`\`\`bash
# Run database migrations
docker-compose exec api npx prisma migrate deploy

# Seed the database with initial data
docker-compose exec api npx prisma db seed
\`\`\`

### 3. Test the API
\`\`\`bash
# Health check
curl http://localhost:3000/health

# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@healthsystem.com",
    "password": "Admin123!"
  }'
\`\`\`

## 🛠️ Development Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment
\`\`\`bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL="mysql://username:password@localhost:3306/digital_health_system"
\`\`\`

### 3. Setup Database
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

## 📊 Database Management with Prisma

### Prisma Studio (Database GUI)
\`\`\`bash
# Open Prisma Studio
npx prisma studio

# Or with Docker
docker-compose exec api npx prisma studio
\`\`\`

### Database Operations
\`\`\`bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Reset database
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# Generate Prisma client after schema changes
npx prisma generate
\`\`\`

## 🐳 Docker Commands

### Basic Operations
\`\`\`bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f mysql
\`\`\`

### Development with Docker
\`\`\`bash
# Rebuild and start
docker-compose up --build

# Execute commands in containers
docker-compose exec api npm run dev
docker-compose exec api npx prisma studio
docker-compose exec mysql mysql -u root -p
\`\`\`

### Production Deployment
\`\`\`bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Scale API instances
docker-compose up --scale api=3
\`\`\`

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/logout\` - User logout  
- \`GET /api/auth/profile\` - Get user profile

### Administrative Functions
- \`GET /api/admin/users\` - Get all users (paginated)
- \`POST /api/admin/users\` - Create new user
- \`PUT /api/admin/users/:id\` - Update user
- \`DELETE /api/admin/users/:id\` - Deactivate user
- \`GET /api/admin/reports\` - Generate system reports
- \`GET /api/admin/configurations\` - Get system configurations
- \`PUT /api/admin/configurations\` - Update configuration
- \`GET /api/admin/provider-schedules\` - Get provider schedules
- \`PUT /api/admin/provider-schedules/:id\` - Update schedule

## 📈 Report Types

### Available Reports
1. **Appointments** (\`?reportType=appointments\`)
   - Appointment statistics by status
   - Daily appointment counts

2. **No-Shows** (\`?reportType=no-shows\`)
   - No-show details by patient/provider
   - Overall no-show rate

3. **Users** (\`?reportType=users\`)
   - User registration statistics
   - Role-based breakdowns

4. **System Usage** (\`?reportType=system-usage\`)
   - Login statistics
   - System activity logs

### Example Report Request
\`\`\`bash
curl -X GET "http://localhost:3000/api/admin/reports?reportType=appointments&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## 👥 Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthsystem.com | Admin123! |
| Provider | dr.smith@healthsystem.com | Admin123! |
| Patient | patient@example.com | Admin123! |

## 🔒 Security Features

- **JWT Authentication** with role-based access control
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Audit Logging** for all administrative actions
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet.js
- **Input Validation** with express-validator

## 🗄️ Database Schema

### Core Models
- **User** - Base user accounts with roles
- **Provider** - Healthcare provider details
- **Patient** - Patient-specific information
- **Appointment** - Appointment scheduling
- **ProviderSchedule** - Provider availability
- **SystemConfiguration** - System settings
- **AuditLog** - Activity tracking
- **UserSession** - Session management

## 🚀 Production Deployment

### Environment Variables
\`\`\`env
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

### Docker Production
\`\`\`bash
# Build production image
docker build -t health-api:prod .

# Run with production compose
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🔍 Monitoring & Logging

### Health Checks
- API: \`http://localhost:3000/health\`
- Database: Built-in Docker health checks
- Redis: Connection monitoring

### Logs
- Application logs: \`./logs/\` directory
- Docker logs: \`docker-compose logs\`
- Audit logs: Stored in database

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in Docker
docker-compose exec api npm test
\`\`\`

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   \`\`\`bash
   # Check if MySQL is running
   docker-compose ps mysql
   
   # Check logs
   docker-compose logs mysql
   \`\`\`

2. **Prisma Client Not Generated**
   \`\`\`bash
   # Regenerate client
   npx prisma generate
   \`\`\`

3. **Port Already in Use**
   \`\`\`bash
   # Change port in docker-compose.yml or .env
   PORT=3001
   \`\`\`

4. **Migration Issues**
   \`\`\`bash
   # Reset and re-migrate
   npx prisma migrate reset
   npx prisma migrate dev
   \`\`\`

## 📞 Support

For issues or questions:
1. Check the logs: \`docker-compose logs -f\`
2. Verify environment variables
3. Ensure all services are healthy: \`docker-compose ps\`
4. Review the SRS document for requirements
\`\`\`

