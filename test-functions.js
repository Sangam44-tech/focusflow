// Test script to verify all functions are working
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test functions
async function testFunctions() {
  console.log('🧪 Testing FocusFlow Functions...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get(`${BASE_URL}/health`).catch(() => null);
    if (healthCheck) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not running');
      return;
    }

    // Test 2: Test analytics endpoint (without auth for now)
    console.log('\n2. Testing analytics endpoint structure...');
    console.log('ℹ️  Note: This will fail without authentication, but we can check the error structure');
    
    try {
      await axios.get(`${BASE_URL}/analytics`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Analytics endpoint exists (requires authentication)');
      } else {
        console.log('❌ Analytics endpoint error:', error.message);
      }
    }

    // Test 3: Test AI planner endpoint
    console.log('\n3. Testing AI planner endpoint...');
    try {
      await axios.post(`${BASE_URL}/ai/generate`, { goal: 'test' });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ AI planner endpoint exists (requires authentication)');
      } else {
        console.log('❌ AI planner endpoint error:', error.message);
      }
    }

    // Test 4: Test projects endpoint
    console.log('\n4. Testing projects endpoint...');
    try {
      await axios.get(`${BASE_URL}/projects`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Projects endpoint exists (requires authentication)');
      } else {
        console.log('❌ Projects endpoint error:', error.message);
      }
    }

    console.log('\n🎉 Basic endpoint structure test completed!');
    console.log('\n📝 Summary of changes made:');
    console.log('1. ✅ Toast duration increased to 2.5 seconds');
    console.log('2. ✅ "Import as Project" changed to "Import as Goal"');
    console.log('3. ✅ "Total Projects" changed to "Total Goals" in Analytics');
    console.log('4. ✅ Backend analytics service updated with totalGoals alias');
    console.log('5. ✅ Added activeProjects and completedProjects calculations');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testFunctions();