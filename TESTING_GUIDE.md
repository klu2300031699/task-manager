# Testing Guide - TaskMaster Pro

## 🧪 How to Test the Application

### 1. User Registration Feature

**Test New User Registration:**
1. Open the application at http://localhost:5174/
2. Click on "Sign Up" button
3. Fill in the registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `test123`
   - Confirm Password: `test123`
4. Click "Create Account"
5. You should be automatically logged in and see the dashboard

**Test Validation:**
- Try registering with an existing username (e.g., "Gnanesh")
  - Should show error: "Username already exists"
- Try registering with mismatched passwords
  - Should show error: "Passwords do not match"
- Try short username/password
  - Should show appropriate validation errors

### 2. User Login Feature

**Test Existing User Login:**
1. If logged in, click "Logout" button in header
2. On login page, enter credentials:
   - Username: `Gnanesh`
   - Password: `Gnanesh`
3. Click "Sign In"
4. Should redirect to dashboard with welcome message

**Test Quick Login:**
1. Click any of the quick login buttons (Gnanesh, Ashika, or Ashesh)
2. Should auto-fill credentials
3. Click "Sign In" or submit form

### 3. Task Assignment Feature (IMPORTANT)

**Test Task Assignment Between Users:**

**Step 1: Create and Assign Task as User A**
1. Login as `Gnanesh` (password: `Gnanesh`)
2. Click "New Task" button
3. Fill in task details:
   - Task Title: `Review Backend Code`
   - Description: `Review the authentication API implementation`
   - Status: `To Do`
   - Priority: `High`
   - Category: `Development`
   - Due Date: Select tomorrow's date
   - **Assign To: Select `Ashika`** (This is the key part!)
   - Tags: Add `backend`, `urgent`
   - Notes: `Please review by EOD`
4. Click "Create Task"
5. Task should appear in your dashboard

**Step 2: Verify Task Appears for Assigned User**
1. Click "Logout" button in header
2. Login as `Ashika` (password: `Ashika`)
3. **Check the task filters:**
   - Click "Assigned to Me" filter
   - You should see the task "Review Backend Code"
   - The task card should show Ashika's avatar (assigned to)
   - It should also show a secondary avatar for Gnanesh (created by)

**Step 3: Verify Task Counts**
1. Check the statistics cards at the top:
   - Ashika's "Total Tasks" should include the assigned task
   - The task should count in "Active" tasks
2. Click "All Tasks" to see all tasks assigned to or created by Ashika

**Step 4: Complete Task as Assigned User**
1. As Ashika, find the task
2. Click the checkbox to mark it complete
3. Check statistics - "Completed" count should increase
4. Click "Completed" filter to verify

**Step 5: Verify from Creator's View**
1. Logout and login back as `Gnanesh`
2. Click "Created by Me" filter
3. You should see the task you created
4. The task should show as "Completed" if Ashika completed it
5. Check that the assignee avatar shows Ashika

### 4. Multi-User Task Assignment Test

**Create Multiple Assignments:**
1. Login as `Gnanesh`
2. Create 3 tasks:
   - Task 1: Assign to `Ashika`
   - Task 2: Assign to `Ashesh`
   - Task 3: Assign to yourself (`Gnanesh`)
3. Logout and verify:
   - Login as `Ashika` → Should see Task 1 in "Assigned to Me"
   - Logout and login as `Ashesh` → Should see Task 2 in "Assigned to Me"
   - Login back as `Gnanesh` → Should see all 3 in "Created by Me"

### 5. Real-time Update Test

**Test Live Updates:**
1. Login as `Gnanesh` and create a task assigned to `Ashika`
2. Leave this browser window open
3. Open a new incognito/private window
4. Login as `Ashika`
5. The task should appear immediately in Ashika's dashboard
6. If you complete the task in Ashika's window
7. The status should update (may need to refresh for cross-tab updates)

### 6. Task Editing and Reassignment

**Test Task Reassignment:**
1. Login as `Gnanesh`
2. Create a task assigned to `Ashika`
3. Click the edit button on the task
4. Change "Assign To" to `Ashesh`
5. Save the task
6. Logout and login as `Ashesh`
7. Task should now appear in Ashesh's "Assigned to Me" filter
8. Logout and login as `Ashika`
9. Task should no longer appear in "Assigned to Me"

### 7. Overdue Tasks Test

**Test Overdue Detection:**
1. Create a task with yesterday's date
2. Leave status as "Active" (not completed)
3. Check dashboard:
   - "Overdue" count should increase
   - Click "Overdue" filter to see the task
   - Task card should have red border
   - Due date should show "(Overdue)" label

### 8. Search and Filter Test

**Test Search:**
1. Create several tasks with different titles and tags
2. Use the search bar to search by:
   - Task title keywords
   - Description text
   - Tag names (e.g., search "urgent")
3. Results should filter in real-time

**Test Sorting:**
1. Create tasks with different due dates and priorities
2. Try each sort option:
   - Due Date: Tasks should order by date
   - Priority: High → Medium → Low
   - Created Date: Newest first

### 9. Tags and Categories Test

**Test Tag Management:**
1. Create a task
2. Add predefined tags (urgent, documentation, etc.)
3. Add custom tags in the input field
4. Verify tags appear on task card
5. Edit task and remove tags
6. Verify tags are removed

### 10. Data Persistence Test

**Test LocalStorage Persistence:**
1. Create several tasks
2. Close the browser completely
3. Reopen and navigate to the app
4. You should still be logged in
5. All tasks should still be visible
6. Try logging out and logging back in
7. Tasks should persist

## 🐛 Common Issues and Solutions

### Issue: Assigned tasks not showing up
**Solution:** 
- Make sure you're logged in as the assigned user
- Click "Assigned to Me" filter
- Verify the task was actually assigned to that user (check "Created by Me" from creator's account)

### Issue: Tasks not updating in real-time
**Solution:**
- Refresh the page
- For cross-tab updates, localStorage events should trigger
- Check browser console for any errors

### Issue: Can't see newly registered users in dropdown
**Solution:**
- Refresh the page after registration
- The user list loads when TaskForm component mounts

### Issue: Registration fails
**Solution:**
- Check if username/email already exists
- Try using a unique username and email
- Check browser console for errors

## ✅ Expected Behavior Checklist

- [ ] New users can register successfully
- [ ] Users can login with correct credentials
- [ ] Invalid login shows error message
- [ ] Tasks created by User A and assigned to User B appear in User B's dashboard
- [ ] Task counts update correctly in statistics
- [ ] "Assigned to Me" filter shows only assigned tasks
- [ ] "Created by Me" filter shows only created tasks
- [ ] Task completion updates statistics
- [ ] Overdue tasks are highlighted
- [ ] Search filters tasks correctly
- [ ] Sorting works for all options
- [ ] Tags can be added and removed
- [ ] Task editing updates the task
- [ ] Task deletion removes the task
- [ ] Logout clears session
- [ ] Data persists after browser close

## 📝 Notes

- All data is currently stored in browser localStorage
- Clearing browser data will reset all tasks and users (except default demo accounts which re-initialize)
- Each browser/device has its own data until backend is integrated
- For production, implement the backend API as described in README.md

---

**Happy Testing! 🎉**
