# 🧪 Accountability App Testing Guide

## 🚀 Quick Start
1. **Open the app**: http://localhost:3000
2. **Clear existing data** (if any) in Settings → Danger Zone
3. **Follow the testing steps below**

---

## 📅 **Test 1: Date Change Functionality**

### Setup
1. **Go to Settings** → Add 2 test users:
   - User A: 👨‍💼 "John"
   - User B: 👩‍💼 "Sarah"

2. **Go to Daily Tasks** → Add tasks for today:
   - John: "Complete project", "Exercise", "Read book"
   - Sarah: "Workout", "Study", "Call mom"

3. **Complete some tasks**:
   - John: Complete 2/3 tasks
   - Sarah: Complete 1/3 tasks

### Test Date Change
1. **Change your system date** to tomorrow
2. **Refresh the app**
3. **Check what happens**:
   - ✅ Previous tasks should still be visible
   - ✅ New tasks can be added for new date
   - ✅ Streaks should recalculate
   - ✅ Achievements should trigger

---

## 💰 **Test 2: Penalty System**

### Setup
1. **Go to Settings** → App Settings:
   - Set "Penalty Amount" to £5
   - Set "Points per Completed Task" to 10
   - Set "Points Penalty per Missed Task" to 5

2. **Go to Daily Tasks** → Create penalty scenario:
   - John: Complete 1/3 tasks (miss 2 = owe £10)
   - Sarah: Complete 2/3 tasks (miss 1 = owe £5)

### Test Penalties
1. **Go to Dashboard** → Check penalty summary
2. **Verify calculations**:
   - John owes: £10
   - Sarah owes: £5
   - Net: John owes Sarah £5

---

## 🏆 **Test 3: Achievement System**

### Setup
1. **Complete all tasks** for one user
2. **Check if achievements unlock**:
   - ✅ "Perfect Day" achievement
   - ✅ "First Steps" achievement
   - ✅ Points should increase

### Test Multiple Days
1. **Complete tasks for 7 consecutive days**
2. **Check for streak achievements**:
   - ✅ "Week Warrior" (7-day streak)
   - ✅ "Month Master" (30-day streak)

---

## 📸 **Test 4: Proof Upload System**

### Setup
1. **Go to Daily Tasks**
2. **Click "Upload proof"** on any task
3. **Take a photo or select an image**

### Test Features
1. **Image upload**:
   - ✅ Camera opens on mobile
   - ✅ File picker on desktop
   - ✅ Image preview shows

2. **Image viewing**:
   - ✅ Click image to enlarge
   - ✅ Modal opens with full view
   - ✅ Click outside to close

---

## 🔄 **Test 5: Dynamic Columns**

### Setup
1. **Go to Settings** → Add users:
   - Test with 1 user → Should show 1 column
   - Test with 2 users → Should show 2 columns
   - Test with 3 users → Should show 3 columns
   - Test with 4+ users → Should show 4 columns max

### Verify Layout
- ✅ Columns adjust automatically
- ✅ Equal spacing between columns
- ✅ Responsive on mobile

---

## 📊 **Test 6: Data Persistence**

### Setup
1. **Add some data** (users, tasks, achievements)
2. **Export data** from Settings → Data Management
3. **Clear all data** from Settings → Danger Zone
4. **Import data** back

### Verify Persistence
- ✅ All data should be restored
- ✅ Users, tasks, achievements intact
- ✅ Settings preserved

---

## 🐛 **Common Issues & Solutions**

### Issue: Tasks not saving
**Solution**: Check browser console for errors, ensure localStorage is enabled

### Issue: Images not uploading
**Solution**: Check camera permissions, try different image formats

### Issue: Date not updating
**Solution**: Refresh page after changing system date

### Issue: Penalties not calculating
**Solution**: Ensure tasks are marked as incomplete, check Settings for penalty amount

---

## ✅ **Success Criteria**

### Date Change Test ✅
- [ ] Previous tasks remain visible
- [ ] New tasks can be added for new date
- [ ] Streaks recalculate correctly
- [ ] Achievements trigger appropriately

### Penalty Test ✅
- [ ] Penalties calculate correctly
- [ ] Dashboard shows penalty summary
- [ ] Net amounts are accurate
- [ ] Settings affect penalty amounts

### Achievement Test ✅
- [ ] Achievements unlock automatically
- [ ] Points are awarded correctly
- [ ] Achievement cards display properly
- [ ] Streak achievements work

### Proof Upload Test ✅
- [ ] Images upload successfully
- [ ] Click to view works
- [ ] Modal displays properly
- [ ] Images can be removed

---

## 🎯 **Next Steps After Testing**

1. **Report any bugs** you find
2. **Test edge cases** (many users, many tasks)
3. **Test mobile responsiveness**
4. **Verify data export/import**
5. **Check all achievement types**

---

## 📱 **Mobile Testing**

### Test on Mobile Device
1. **Open app on phone/tablet**
2. **Test camera functionality**
3. **Verify responsive design**
4. **Check touch interactions**

### Mobile-Specific Tests
- ✅ Camera opens for proof upload
- ✅ Touch gestures work properly
- ✅ Layout adapts to screen size
- ✅ Performance is smooth

---

**Happy Testing! 🎉**
