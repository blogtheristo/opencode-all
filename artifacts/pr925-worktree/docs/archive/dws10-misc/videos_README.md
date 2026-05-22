# Campaign Hero Video Assets

This folder contains the video assets for the €500K Construction Heroes Campaign.

## Required Files

Place these files in this directory:

1. **gemini_generated_video_EA97318F.mp4** (2.2MB)
   - Main video file (MP4 format)
   - 8 seconds duration
   - 1280×720 HD resolution

2. **gemini_generated_video_EA97318F.webm** (1.2MB)
   - Optimized WebM format (better compression)
   - Same 8-second video
   - Fallback for modern browsers

3. **construction-poster.jpg** (307KB)
   - Video thumbnail/poster image
   - Shows while video loads
   - Fallback if video doesn't play

## Where to Get the Files

The optimized video files were provided by Claude in the chat conversation.

Download them from the chat and copy them to this folder.

## How to Add Files

### Option 1: File Explorer (Easiest)
1. Download the 3 files from the chat
2. Open File Explorer
3. Navigate to: `D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\`
4. Copy/paste the files here

### Option 2: PowerShell
```powershell
# If files are in Downloads:
copy "C:\Users\risto\Downloads\gemini_generated_video_EA97318F.*" "D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\"
copy "C:\Users\risto\Downloads\construction-poster.jpg" "D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\"
```

## Testing

After adding the files:

1. Open `index.html` in your browser
2. Scroll to the top - you should see the hero section
3. Video should autoplay (muted)
4. If video doesn't show, check browser console (F12) for errors

## Deployment

Once files are in place:

```powershell
cd "D:\Proton\My files\2026\Repos2026\dws6"
git add dws10.com/public/videos/
git commit -m "feat: add €500k campaign hero video assets"
git push origin main
```

Cloudflare will deploy automatically in 2-3 minutes.

## File Sizes

- MP4: ~2.2MB (60% smaller than original)
- WebM: ~1.2MB (80% smaller than original)
- Poster: ~307KB

Total: ~3.7MB (optimized for fast loading)

## Status

- [x] Folder created
- [x] HTML updated with correct paths
- [ ] Video files added (YOU NEED TO DO THIS)
- [ ] Tested locally
- [ ] Deployed to production

## Next Steps

1. **Download the 3 files** from the chat conversation above
2. **Copy them to this folder**
3. **Test locally** by opening index.html
4. **Deploy** with git push

Your €500K campaign will be live! 🚀

