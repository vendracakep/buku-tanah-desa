# CLAUDE.md - AI Assistant Guide for Buku Tanah Desa

## Project Overview

**Sistem Informasi Buku Tanah Desa** (Village Land Book Information System) is a land registry management system designed for Indonesian village administration. This system manages land ownership records, land certificates, land transactions, and related administrative processes at the village level.

### Project Status
- **Current State**: Initial setup phase
- **Language**: Indonesian (Bahasa Indonesia)
- **Target Users**: Village administrators, land registry officials, and citizens

### Purpose
- Digitize village land records and ownership documentation
- Manage land certificates (sertifikat tanah)
- Track land ownership transfers and transactions
- Generate reports for land administration
- Provide citizen access to land information

---

## Repository Structure

### Recommended Architecture

This project should follow a modern web application architecture:

```
buku-tanah-desa/
├── src/                    # Source code
│   ├── app/               # Application entry point
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-based modules
│   │   ├── auth/         # Authentication & authorization
│   │   ├── lands/        # Land management
│   │   ├── owners/       # Land owner management
│   │   ├── certificates/ # Certificate management
│   │   ├── transactions/ # Land transactions
│   │   └── reports/      # Reporting system
│   ├── lib/              # Utility libraries
│   ├── hooks/            # Custom React hooks (if React)
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── public/               # Static assets
├── tests/                # Test files
├── docs/                 # Documentation
├── scripts/              # Build and deployment scripts
└── config/               # Configuration files
```

---

## Technology Stack Recommendations

### Frontend
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or similar component library
- **State Management**: React Context API, Zustand, or TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)

### Backend
- **API**: Next.js API Routes or separate NestJS/Express backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js or custom JWT implementation
- **File Storage**: Local filesystem or cloud storage (for land documents)

### DevOps
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel, Docker, or VPS
- **Environment**: Docker for consistent development environment

---

## Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Feature development branches
- **bugfix/***: Bug fix branches
- **hotfix/***: Critical production fixes
- **claude/***: AI assistant working branches (auto-generated)

### Commit Conventions

Follow Conventional Commits specification:

```
feat: add land certificate generation
fix: correct ownership transfer validation
docs: update API documentation
style: format code with prettier
refactor: restructure land service layer
test: add unit tests for transaction module
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Create PR with clear description
6. Request review
7. Merge after approval

---

## Code Conventions

### General Principles

1. **Write in Indonesian for:**
   - User-facing text and messages
   - Comments explaining business logic
   - Documentation for end users
   - Database field descriptions

2. **Write in English for:**
   - Variable and function names
   - Code comments (technical explanations)
   - Git commit messages
   - Developer documentation

3. **Keep code simple and maintainable:**
   - Follow DRY (Don't Repeat Yourself)
   - Use meaningful variable names
   - Write self-documenting code
   - Add comments only when necessary

### TypeScript Guidelines

```typescript
// Good: Clear interfaces and types
interface LandRecord {
  id: string;
  nomorSertifikat: string; // Certificate number
  luasTanah: number; // Land area in m²
  lokasiDesa: string; // Village location
  pemilikId: string; // Owner ID
  tanggalTerbit: Date; // Issue date
  statusSertifikat: 'aktif' | 'nonaktif' | 'pending';
}

// Good: Descriptive function names
async function createLandCertificate(data: LandRecord): Promise<LandRecord> {
  // Implementation
}

// Avoid: Unclear abbreviations
// Bad: function crtLnd(d: any): any { }
```

### File Naming

- **Components**: PascalCase (`LandCertificateForm.tsx`)
- **Utilities**: camelCase (`formatLandArea.ts`)
- **Pages**: kebab-case (`land-registry.tsx`)
- **Types**: PascalCase with `.types.ts` suffix (`LandRecord.types.ts`)
- **Tests**: Same as source file with `.test.ts` or `.spec.ts`

### Component Structure

```typescript
// Component template
import { FC } from 'react';

interface ComponentProps {
  // Props definition
}

export const ComponentName: FC<ComponentProps> = ({ props }) => {
  // Hooks
  // Event handlers
  // Render logic

  return (
    // JSX
  );
};
```

---

## Database Schema Guidelines

### Key Entities

1. **Tanah (Lands)**
   - id, nomorSertifikat, luasTanah, lokasiDesa, koordinatGPS, etc.

2. **Pemilik (Owners)**
   - id, nama, nik, alamat, nomorTelepon, email, etc.

3. **Sertifikat (Certificates)**
   - id, tanahId, pemilikId, nomorSertifikat, tanggalTerbit, status, etc.

4. **Transaksi (Transactions)**
   - id, tanahId, pemilikLama, pemiliktBaru, tanggalTransaksi, jenis, etc.

5. **Dokumen (Documents)**
   - id, tanahId, jenisDokumen, filePath, uploadedAt, etc.

### Naming Conventions

- Table names: Plural in Indonesian (`tanahs`, `pemiliks`, `sertifikats`)
- Foreign keys: Singular + Id (`pemilikId`, `tanahId`)
- Timestamps: `createdAt`, `updatedAt`, `deletedAt`
- Use soft deletes where appropriate

---

## Testing Strategy

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: Critical user flows
- **E2E Tests**: Key features (certificate generation, transactions)

### Test Structure

```typescript
describe('LandCertificateService', () => {
  describe('createCertificate', () => {
    it('should create a valid certificate with proper data', async () => {
      // Arrange
      const mockData = { /* ... */ };

      // Act
      const result = await service.createCertificate(mockData);

      // Assert
      expect(result).toMatchObject({ /* ... */ });
    });

    it('should reject invalid land area', async () => {
      // Test negative cases
    });
  });
});
```

---

## Security Considerations

### Critical Security Rules

1. **Authentication & Authorization**
   - Implement role-based access control (RBAC)
   - Roles: Admin, Staff, Citizen (read-only)
   - Secure all land modification endpoints
   - Implement session management

2. **Data Protection**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use parameterized queries (Prisma handles this)
   - Encrypt sensitive data at rest

3. **File Uploads**
   - Validate file types (PDF, images for land documents)
   - Limit file sizes
   - Scan for malware if possible
   - Store files securely with access control

4. **Audit Logging**
   - Log all land record modifications
   - Track user actions (who, what, when)
   - Maintain audit trail for transactions

---

## API Design Principles

### RESTful Conventions

```
GET    /api/lands              # List all lands
GET    /api/lands/:id          # Get specific land
POST   /api/lands              # Create new land record
PUT    /api/lands/:id          # Update land record
DELETE /api/lands/:id          # Delete land record

GET    /api/lands/:id/certificates
POST   /api/lands/:id/transfer  # Transfer ownership
GET    /api/reports/ownership   # Generate reports
```

### Response Format

```typescript
// Success response
{
  success: true,
  data: { /* ... */ },
  message: "Operasi berhasil"
}

// Error response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Data tidak valid",
    details: { /* ... */ }
  }
}
```

---

## AI Assistant Workflow

### When Working on This Project

1. **Understand Context First**
   - Read related files before making changes
   - Understand the business logic (Indonesian land registry system)
   - Consider Indonesian administrative requirements

2. **Code Development**
   - Use TypeScript with strict mode
   - Follow the file structure conventions
   - Write tests for new features
   - Update documentation when needed

3. **Indonesian Context Awareness**
   - Use proper Indonesian terminology for land registry
   - Consider Indonesian legal requirements for land documents
   - Format dates as DD/MM/YYYY (Indonesian standard)
   - Use rupiah (Rp) for currency formatting

4. **Validation and Testing**
   - Test with realistic Indonesian data (addresses, names, NIK format)
   - Validate NIK (16 digits) format
   - Validate land certificate numbers
   - Check proper date handling

5. **Commit and Push**
   - Write clear commit messages
   - Push to designated claude/* branches
   - Create PRs with comprehensive descriptions

### Common Tasks

#### Adding a New Feature

```bash
# 1. Create/checkout feature branch
git checkout -b claude/feature-name-sessionid

# 2. Implement feature with tests
# 3. Run tests
npm test

# 4. Commit changes
git add .
git commit -m "feat: add feature description"

# 5. Push to remote
git push -u origin claude/feature-name-sessionid
```

#### Fixing a Bug

1. Identify the root cause
2. Write a test that reproduces the bug
3. Fix the bug
4. Ensure test passes
5. Commit with descriptive message

#### Adding Documentation

- Update relevant .md files in `/docs`
- Add inline code documentation
- Update API documentation
- Include Indonesian translations for user-facing docs

---

## Indonesian Land Registry Context

### Key Terminology

- **Tanah**: Land
- **Sertifikat Tanah**: Land certificate
- **Pemilik**: Owner
- **NIK**: Nomor Induk Kependudukan (National ID number)
- **Desa**: Village
- **Kecamatan**: Sub-district
- **Kabupaten**: Regency
- **Hak Milik**: Right of ownership
- **Jual Beli**: Sale and purchase
- **Hibah**: Grant/gift
- **Waris**: Inheritance

### Document Types

1. **Sertifikat Hak Milik (SHM)**: Ownership certificate
2. **Sertifikat Hak Guna Bangunan (SHGB)**: Building use rights
3. **Sertifikat Hak Pakai (SHP)**: Usage rights
4. **Girik/Letter C**: Traditional land ownership document

### Required Information

- Nomor Induk Bidang (NIB): Land parcel number
- Luas tanah: Land area (m²)
- Batas-batas tanah: Land boundaries (North, South, East, West)
- Lokasi: Location (village, sub-district, regency)
- Nama pemilik: Owner name
- NIK pemilik: Owner's national ID
- Jenis hak: Type of rights

---

## Performance Guidelines

### Optimization Rules

1. **Database Queries**
   - Use pagination for land listings
   - Implement proper indexing
   - Avoid N+1 queries
   - Cache frequently accessed data

2. **File Handling**
   - Compress uploaded documents
   - Generate thumbnails for images
   - Implement lazy loading for documents

3. **Frontend Performance**
   - Code splitting for routes
   - Lazy load heavy components
   - Optimize images and assets
   - Use React.memo for expensive components

---

## Environment Variables

### Required Configuration

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/buku_tanah_desa"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# File Storage
UPLOAD_DIR="/var/uploads/land-documents"
MAX_FILE_SIZE="10485760" # 10MB

# Application
NODE_ENV="development"
APP_NAME="Sistem Informasi Buku Tanah Desa"
```

---

## Error Handling

### Standard Error Codes

```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  DUPLICATE_CERTIFICATE = 'DUPLICATE_CERTIFICATE',
  INVALID_TRANSFER = 'INVALID_TRANSFER',
  DOCUMENT_UPLOAD_FAILED = 'DOCUMENT_UPLOAD_FAILED',
}
```

### Error Messages (Indonesian)

```typescript
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid',
  NOT_FOUND: 'Data tidak ditemukan',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  DUPLICATE_CERTIFICATE: 'Nomor sertifikat sudah terdaftar',
  INVALID_TRANSFER: 'Transfer kepemilikan tidak valid',
};
```

---

## Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Backup strategy in place

### Post-deployment

- [ ] Monitor error logs
- [ ] Verify core functionality
- [ ] Check database connections
- [ ] Test file uploads
- [ ] Verify authentication flows

---

## Resources and References

### Indonesian Government Standards

- BPN (Badan Pertanahan Nasional) regulations
- Village administration requirements
- Land certificate formats
- Data protection laws (UU PDP)

### Technical Documentation

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## AI Assistant Checklist

Before completing any task, ensure:

- [ ] Read existing code context
- [ ] Follow TypeScript conventions
- [ ] Use proper Indonesian terminology
- [ ] Write or update tests
- [ ] Update documentation if needed
- [ ] Commit with conventional commits
- [ ] Push to correct branch (claude/*)
- [ ] No security vulnerabilities introduced
- [ ] No over-engineering (keep it simple)
- [ ] Code is properly formatted

---

## Questions or Issues?

When encountering ambiguity:
1. Check this CLAUDE.md file
2. Review existing similar code
3. Ask clarifying questions to the user
4. Document decisions made

---

**Last Updated**: 2025-11-29
**Version**: 1.0.0
**Maintained by**: AI Assistants working on this project
