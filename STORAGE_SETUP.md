# Supabase Storage Setup for Image Uploads

## Overview
This guide explains how to set up Supabase Storage to handle proof image uploads for tasks.

## Prerequisites
- Supabase project already set up
- Database tables already created
- Environment variables configured

## Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to "Storage" in the left sidebar

2. **Create a new bucket**
   - Click "Create a new bucket"
   - Name: `proof-images`
   - Public bucket: ✅ **Yes** (so images can be viewed without authentication)
   - File size limit: `5MB` (adjust as needed)
   - Allowed MIME types: `image/*`

3. **Bucket Settings**
   - Enable Row Level Security (RLS): ✅ **Yes**
   - This allows us to control access to images

## Step 2: Configure RLS Policies

Create the following policies for the `proof-images` bucket:

### Policy 1: Allow authenticated users to upload images
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'proof-images' AND 
  auth.role() = 'authenticated'
);
```

### Policy 2: Allow public read access to images
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'proof-images'
);
```

### Policy 3: Allow authenticated users to delete their own images
```sql
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'proof-images' AND 
  auth.role() = 'authenticated'
);
```

## Step 3: Update Environment Variables

Make sure your `.env` file includes:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Setup

1. **Upload a test image**
   - Go to your app
   - Create a task
   - Upload a proof image
   - Check if it appears correctly

2. **Verify storage**
   - Go to Supabase Dashboard → Storage → proof-images
   - You should see the uploaded image

## Step 5: Migration from Base64 (Optional)

If you have existing tasks with base64 images, you can migrate them:

1. **Export existing data**
2. **Convert base64 to files**
3. **Upload to Supabase Storage**
4. **Update database records**

## Features

### ✅ What's Implemented

1. **File Upload**: Images are uploaded to Supabase Storage
2. **Unique Naming**: Files are named with task ID and timestamp
3. **Public URLs**: Images are accessible via public URLs
4. **Loading States**: Shows "Uploading..." while processing
5. **Error Handling**: Graceful error handling for failed uploads
6. **Cleanup**: Images are deleted when proof is removed
7. **Backward Compatibility**: Still supports existing base64 images

### 🔧 Technical Details

- **Storage Location**: `proof-images/` bucket
- **File Naming**: `{taskId}_{timestamp}.{extension}`
- **File Size Limit**: 5MB per image
- **Supported Formats**: All image types (`image/*`)
- **URL Format**: `https://your-project.supabase.co/storage/v1/object/public/proof-images/filename.jpg`

### 🛡️ Security

- **Public Read**: Anyone can view images (needed for proof verification)
- **Authenticated Upload**: Only authenticated users can upload
- **Authenticated Delete**: Only authenticated users can delete
- **File Type Validation**: Only image files allowed
- **Size Limits**: Prevents abuse with large files

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Make sure the bucket name is exactly `proof-images`
   - Check that the bucket is created in the correct project

2. **"Permission denied" error**
   - Verify RLS policies are set up correctly
   - Check that user is authenticated

3. **Images not loading**
   - Check if bucket is public
   - Verify file paths are correct
   - Check browser console for errors

4. **Upload fails**
   - Check file size (should be under 5MB)
   - Verify file type is an image
   - Check network connection

### Debug Steps

1. **Check browser console** for error messages
2. **Verify Supabase connection** in network tab
3. **Test with smaller images** first
4. **Check bucket permissions** in Supabase dashboard

## Performance Considerations

- **Image Optimization**: Consider adding image compression
- **CDN**: Supabase Storage uses CDN for fast delivery
- **Caching**: Images are cached for 1 hour
- **Lazy Loading**: Images load only when needed

## Future Enhancements

- [ ] Image compression before upload
- [ ] Thumbnail generation
- [ ] Multiple image support per task
- [ ] Image editing capabilities
- [ ] Bulk image operations
