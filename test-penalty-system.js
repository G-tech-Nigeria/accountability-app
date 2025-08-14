// Test script to verify penalty system functionality
// Run this in the browser console to test the penalty system

console.log('Testing Penalty System...');

// Import the storage functions (you'll need to run this in the browser console)
const { 
  getUsers, 
  getTasks, 
  getPenalties, 
  calculateMissedTaskPenalties, 
  getPenaltySummary 
} = window.storage || {};

// Test function
function testPenaltySystem() {
  console.log('=== Penalty System Test ===');
  
  // 1. Get current data
  const users = getUsers();
  const tasks = getTasks();
  const penalties = getPenalties();
  
  console.log('Current users:', users);
  console.log('Current tasks:', tasks);
  console.log('Current penalties:', penalties);
  
  // 2. Test penalty calculation for yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  console.log('Testing penalty calculation for:', yesterdayStr);
  const newPenalties = calculateMissedTaskPenalties(yesterdayStr);
  console.log('New penalties calculated:', newPenalties);
  
  // 3. Get updated penalty summary
  const penaltySummary = getPenaltySummary();
  console.log('Updated penalty summary:', penaltySummary);
  
  // 4. Calculate total penalties
  let totalPenalties = 0;
  Object.values(penaltySummary).forEach(summary => {
    totalPenalties += summary.owed + summary.owedTo;
  });
  
  console.log('Total penalties across all users:', totalPenalties);
  
  return {
    users,
    tasks,
    penalties: getPenalties(),
    penaltySummary,
    totalPenalties
  };
}

// Run the test
const testResults = testPenaltySystem();
console.log('Test completed. Results:', testResults);

// Instructions for manual testing:
console.log(`
=== Manual Testing Instructions ===

1. Create some tasks for yesterday
2. Leave some tasks incomplete
3. Run this test script
4. Check if penalties are calculated correctly
5. Verify penalties appear in the Dashboard

To test date manipulation:
1. Change your system date to yesterday
2. Create tasks and leave them incomplete
3. Change your system date back to today
4. Run the penalty recalculation in Settings
5. Check if penalties are calculated correctly
`);
