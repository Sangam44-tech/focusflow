// Quick database verification script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check tables exist
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const aiPlanCount = await prisma.aIPlan.count();
    
    console.log('📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Tasks: ${taskCount}`);
    console.log(`   AI Plans: ${aiPlanCount}`);
    
    // Test AI Plan structure
    const samplePlan = await prisma.aIPlan.findFirst();
    if (samplePlan) {
      console.log('✅ AI Plan structure verified');
      console.log('   Sample plan:', samplePlan.goal);
    }
    
    console.log('✅ All database checks passed!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('💡 Suggestion: Check if PostgreSQL is running');
    } else if (error.code === 'P1003') {
      console.log('💡 Suggestion: Check database name and credentials');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();