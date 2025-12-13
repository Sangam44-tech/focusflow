// Simple database test
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test tables exist
    const userCount = await prisma.user.count();
    console.log(`✅ Users table exists (${userCount} users)`);
    
    const projectCount = await prisma.project.count();
    console.log(`✅ Projects table exists (${projectCount} projects)`);
    
    const taskCount = await prisma.task.count();
    console.log(`✅ Tasks table exists (${taskCount} tasks)`);
    
    const aiPlanCount = await prisma.aIPlan.count();
    console.log(`✅ AI Plans table exists (${aiPlanCount} plans)`);
    
    console.log('✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();