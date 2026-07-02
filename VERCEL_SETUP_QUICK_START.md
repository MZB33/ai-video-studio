# ⚡ Quick Start: Fix Voice Generation on Vercel

## Status: Voice Generation Not Working? 🎤❌

If you're seeing "🔑 Environment variables not configured on Vercel" when generating voice in Voice Studio Pro, follow this guide.

---

## 🚀 Fix in 3 Steps (5 minutes)

### Step 1️⃣: Get a Free API Token (2 minutes)

**Option A: RECOMMENDED - HuggingFace (Best for all languages)**
1. Open: https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it: "ai-video-app"
4. Click "Create token"
5. **Copy the token** (looks like: `hf_xxxxxxxxxxx...`)

**Alternative Options:**
- **Google Cloud TTS**: https://console.cloud.google.com (Free 1M chars/month)
- **VoiceRSS**: https://voicerss.org (Free 350/day)
- **ElevenLabs**: https://elevenlabs.io/app/developers (Free 10k chars/month)

### Step 2️⃣: Add to Vercel Dashboard (2 minutes)

1. Go to: **https://vercel.com/dashboard**
2. Click on your **ai-video-app** project
3. Click **Settings** (top navigation)
4. Scroll down to **Environment Variables**
5. Click **Add New**

**Fill in:**
- **Name**: `HUGGINGFACE_API_KEY`
- **Value**: Paste your token from Step 1
- **Environments**: Select all (Production, Preview, Development)

6. Click **Save**

### Step 3️⃣: Redeploy & Test (1 minute)

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **Redeploy**
4. Wait for ✅ (usually 1-2 minutes)
5. Visit your app → Voice Studio Pro
6. Type text and click **Generate Voice** 🎉

---

## ✅ How to Verify It Worked

**Option 1: Check Diagnostic Page**
- Visit: `https://your-app.vercel.app/api/diagnose`
- Look for: ✅ next to HUGGINGFACE_API_KEY
- Should show: "valid" in green

**Option 2: Generate a Voice**
- Go to Voice Studio Pro in your app
- Type any text (e.g., "Hello world")
- Click "Generate Voice"
- If you hear audio → 🎉 **It's working!**

---

## ❌ Still Not Working? Troubleshooting

### Check 1: Did You Redeploy?
- After adding environment variables, Vercel often auto-redeploysto
- **But**: If it didn't, go to **Deployments** and manually click **Redeploy**
- Wait for the deployment to finish (green ✅ checkmark)

### Check 2: Did You Copy the Token Correctly?
- HuggingFace tokens start with: `hf_`
- Should NOT have quotes: ❌ `"hf_xxx"` (correct: ✅ `hf_xxx`)
- Should NOT have spaces at end: ❌ `hf_xxx ` (correct: ✅ `hf_xxx`)
- Length: Usually 30-40 characters

### Check 3: Environment Variables Actually Set?
1. Go to Vercel project **Settings**
2. Check **Environment Variables** section
3. Do you see `HUGGINGFACE_API_KEY` listed?
4. If not, add it again
5. Redeploy

### Check 4: Clear Browser Cache
- Press: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Clear browsing data
- Hard refresh your app: `Ctrl+F5`

### Check 5: Check Error Message
- Go to Voice Studio Pro
- Click "Generate Voice"
- Look at the error message shown
- Visit the "Check Configuration Status" link
- This will show exactly what's missing

---

## 🆘 Advanced Troubleshooting

### Check Logs in Vercel
1. Go to Vercel dashboard
2. Click on your project
3. Click **Logs** tab
4. Try generating a voice
5. Check for errors (red text)

### Try Different TTS Provider
If HuggingFace isn't working, try another:

**Add VoiceRSS:**
- Name: `VOICERSS_API_KEY`
- Value: Your key from https://voicerss.org

**Add ElevenLabs:**
- Name: `ELEVENLABS_API_KEY`  
- Value: Your key from https://elevenlabs.io/app/developers

**Add Google:**
- Name: `GOOGLE_TTS_KEY`
- Value: Your service account JSON

### Check Local Development First
Before deploying to Vercel, test locally:
1. Create `.env.local` in project root
2. Add: `HUGGINGFACE_API_KEY=your_token_here`
3. Run: `npm run dev`
4. Test Voice Studio Pro at `http://localhost:3000`
5. If it works locally, the Vercel setup is the same

---

## 📋 Complete Provider List

| Provider | Cost | Limit | Language | Get Key |
|----------|------|-------|----------|---------|
| **HuggingFace** ⭐ | Free | Unlimited | 1100+ | https://huggingface.co/settings/tokens |
| VoiceRSS | Free | 350/day | 60+ | https://voicerss.org |
| Google TTS | Free | 1M chars/month | 100+ | https://console.cloud.google.com |
| ElevenLabs | Free | 10k chars/month | Limited | https://elevenlabs.io/app/developers |
| OpenAI | Paid | Usage | All | https://platform.openai.com/api-keys |

**Recommendation**: Use **HuggingFace** - it's completely free with no usage limits! ✨

---

## 🎯 Expected Result

After setup, when you generate voice in Voice Studio Pro:
- ✅ Error message disappears
- ✅ Audio plays immediately
- ✅ Can download MP3 file
- ✅ Can copy audio link
- ✅ All 300+ voices work

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Diagnostic Status | `/api/diagnose` (on your app domain) |
| HuggingFace Tokens | https://huggingface.co/settings/tokens |
| Full Troubleshooting | `VOICE_GENERATION_TROUBLESHOOTING.md` |
| Project README | `README.md` |

---

## 💬 How It Works (Behind the Scenes)

1. **You type text** → Frontend sends to `/api/voice` endpoint
2. **API checks environment variables** → Looks for HUGGINGFACE_API_KEY (or alternatives)
3. **Vercel has no variables?** → Returns setup guide + diagnostic link
4. **You add environment variables** → Adds to Vercel dashboard
5. **You redeploy** → New deployment includes the variables
6. **API finds variables** → Converts text to speech using HuggingFace
7. **Audio plays** → Frontend receives and plays MP3 file 🎉

---

**Last Updated**: 2026-07-01  
**Status**: ✅ Production Ready  
**Build**: ✅ Compiled Successfully (4.5s)
