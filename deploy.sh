#!/bin/bash

echo "=========================================="
echo "FocusFlow Deployment Setup"
echo "=========================================="

echo ""
echo "1. Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Backend dependency installation failed"
    exit 1
fi

echo ""
echo "2. Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "Error: Prisma generation failed"
    exit 1
fi

echo ""
echo "3. Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Frontend dependency installation failed"
    exit 1
fi

echo ""
echo "4. Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed"
    exit 1
fi

cd ..
echo ""
echo "=========================================="
echo "Deployment Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Set up your production database"
echo "2. Configure environment variables"
echo "3. Deploy to your hosting platform"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"
echo "=========================================="