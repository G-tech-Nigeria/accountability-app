// Test script to verify real-time updates are working
// Run this in the browser console to test real-time functionality

console.log('🧪 Testing Real-time Updates...');

// Test 1: Check if real-time subscriptions are active
function testRealtimeSubscriptions() {
  console.log('📡 Checking real-time subscriptions...');
  
  // Check if the real-time system is initialized
  if (window.supabase) {
    console.log('✅ Supabase client found');
  } else {
    console.log('❌ Supabase client not found');
  }
  
  // Check for real-time channels
  const channels = window.supabase?.getChannels();
  if (channels && channels.length > 0) {
    console.log('✅ Real-time channels active:', channels.length);
    channels.forEach(channel => {
      console.log(`  - ${channel.topic}`);
    });
  } else {
    console.log('❌ No real-time channels found');
  }
}

// Test 2: Simulate a database change event
function testDatabaseChangeEvent() {
  console.log('🔄 Testing database change event...');
  
  // Simulate a task update event
  const mockPayload = {
    table: 'tasks',
    eventType: 'UPDATE',
    new: { id: 'test-task', title: 'Test Task', status: 'completed' },
    old: { id: 'test-task', title: 'Test Task', status: 'pending' }
  };
  
  // Dispatch the event
  const event = new CustomEvent('databaseChange', {
    detail: { table: 'tasks', payload: mockPayload }
  });
  
  window.dispatchEvent(event);
  console.log('✅ Database change event dispatched');
}

// Test 3: Check if components are listening for real-time updates
function testComponentListeners() {
  console.log('👂 Checking component listeners...');
  
  // Check if the real-time update function exists
  if (typeof window.onTableUpdate === 'function') {
    console.log('✅ onTableUpdate function available');
  } else {
    console.log('❌ onTableUpdate function not found');
  }
  
  // Check for specific page listeners
  const currentPath = window.location.pathname;
  console.log(`📍 Current page: ${currentPath}`);
  
  if (currentPath.includes('/tasks')) {
    console.log('📋 On DailyTasks page - should have task/user listeners');
  } else if (currentPath.includes('/dashboard')) {
    console.log('📊 On Dashboard page - should have real-time data hook');
  } else if (currentPath.includes('/achievements')) {
    console.log('🏆 On Achievements page - should have achievement/user listeners');
  } else if (currentPath.includes('/settings')) {
    console.log('⚙️ On Settings page - should have user listeners');
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Real-time Update Tests...\n');
  
  testRealtimeSubscriptions();
  console.log('');
  
  testComponentListeners();
  console.log('');
  
  testDatabaseChangeEvent();
  console.log('');
  
  console.log('✅ All tests completed!');
  console.log('💡 To test real functionality:');
  console.log('   1. Open the app in multiple browser tabs');
  console.log('   2. Add/edit/complete tasks in one tab');
  console.log('   3. Watch for instant updates in other tabs');
}

// Export for use in browser console
window.testRealtimeUpdates = runAllTests;
window.testRealtimeUpdates();
