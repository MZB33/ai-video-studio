# Voice Generation Troubleshooting Guide

## ❌ Problem: Voice Not Generating on Vercel

When you deploy the AI Video App to Vercel, the Voice Studio Pro stops generating audio. You'll see a message like:
> "🔑 Environment variables not configured on Vercel"

This is because **environment variables in `.env.local` are NOT sent to Vercel** - they only work locally.

---

## ✅ Solution: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find and click on your **ai-video-app** project

### Step 2: Open Environment Variables Settings
1. Click **Settings** (top menu)
2. Scroll down to **Environment Variables**
3. Click **Add New**

### Step 3: Add API Keys (Choose at least ONE)

Copy-paste these environment variable names and their values:

#### **Option A: RECOMMENDED - HuggingFace (Completely Free)**
- **Name:** `HUGGINGFACE_API_KEY`
- **Value:** Your token from https://huggingface.co/settings/tokens
- **Example:** `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Why:** Free, supports 1100+ languages, no rate limits for hobby use

**How to get HuggingFace token:**
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it any name (e.g., "AI Video App")
4. Click "Create token"
5. Copy the token (starts with `hf_`)
6. Paste into Vercel

#### **Option B: VoiceRSS (Free 350 requests/day)**
- **Name:** `VOICERSS_API_KEY`
- **Value:** Your key from https://voicerss.org/
- **Why:** Great for Urdu/Hindi/Arabic/Persian

#### **Option C: ElevenLabs (Free 10k chars/month)**
- **Name:** `ELEVENLABS_API_KEY`
- **Value:** Your key from https://elevenlabs.io/app/developers/api-keys
- **Why:** Best English voice quality

#### **Option D: Google Cloud (Free 1M chars/month)**
- **Name:** `GOOGLE_TTS_KEY`
- **Value:** Your service account JSON from Google Cloud Console
- **Why:** Excellent for Urdu/Arabic

#### **Option E: OpenAI (Paid)**
- **Name:** `OPENAI_API_KEY`
- **Value:** Your key from https://platform.openai.com/api-keys (must start with `sk-`)
- **Why:** Highest quality, but costs money

### Step 4: Also Add MODE (Optional)
- **Name:** `MODE`
- **Value:** `huggingface` (or `mock` for testing)

### Step 5: Redeploy
1. After adding variables, Vercel should auto-redeploy (check the Deployments tab)
2. If not, go to **Deployments** and click "Redeploy" on the latest deployment

### Step 6: Test Voice Generation
1. Visit your deployed app
2. Go to **Voice Studio Pro**
3. Enter some text and click **Generate Voice**
4. You should hear audio now! 🎉

---

## 🔍 Verify Configuration

To check if your environment variables are correctly set:

1. Visit your app: `https://your-app.vercel.app/api/diagnose`
2. You'll see the current configuration status
3. Look for green ✅ marks next to your API keys

---

## 🐛 Still Not Working?

### Check 1: Environment Variables Actually Set?
- Visit `/api/diagnose` endpoint
- All TTS keys should show either ✅ (valid) or ❌ (not set)
- If ❌ appears, go back to Vercel Settings and re-add the key

### Check 2: Did You Redeploy?
- After adding environment variables, Vercel may not auto-deploy
- Go to **Deployments** tab
- Click "Redeploy" on the latest build
- Wait for it to finish (should show ✅)

### Check 3: Browser Cache
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Or use private/incognito window
- Hard refresh the page (Ctrl+F5)

### Check 4: API Key Format
- **HuggingFace:** Must start with `hf_`
- **OpenAI:** Must start with `sk-` (NOT `sk_`)
- **ElevenLabs:** Random alphanumeric string, 20+ chars
- **VoiceRSS:** Usually numeric/alphanumeric ID

### Check 5: Correct Copy-Paste
- Make sure you didn't accidentally include quotes or spaces
- Your API key should be: `hf_xxxxx` NOT `"hf_xxxxx"` or `hf_xxxxx ` (with space)

---

## 📋 Priority Order (If Using Multiple Keys)

Vercel will try providers in this order:
1. **VoiceRSS** (if set)
2. **HuggingFace** (for non-English)
3. **ElevenLabs** (if set)
4. **OpenAI** (if set)
5. **Google** (if set)
6. **HuggingFace** (fallback for English)

**Recommendation:** Just set HUGGINGFACE_API_KEY - it works for everything and is free.

---

## 🎯 Quick Setup (5 minutes)

1. **Get HuggingFace token** (2 min):
   - Go to https://huggingface.co/settings/tokens
   - Create new token
   - Copy it

2. **Add to Vercel** (1 min):
   - Go to Vercel project settings
   - Add environment variable: `HUGGINGFACE_API_KEY` = your token
   - Save

3. **Redeploy** (1 min):
   - Click Redeploy on latest deployment
   - Wait for ✅ (usually 1-2 minutes)

4. **Test** (1 min):
   - Visit Voice Studio Pro
   - Type text and click Generate
   - Listen to the voice! 🎙️

---

## 🚀 Advanced: Testing Locally Before Deploying

To test before deploying to Vercel:

1. **Create `.env.local` in your project root:**
```
HUGGINGFACE_API_KEY=hf_your_token_here
MODE=huggingface
```

2. **Restart dev server:**
```bash
npm run dev
```

3. **Test locally** at http://localhost:3000/tools/voice

4. **Deploy to Vercel** with the same environment variables

---

## 📞 Need Help?

If voice generation still isn't working:

1. **Check the diagnostic endpoint:** `https://your-app.vercel.app/api/diagnose`
2. **Verify each API key's format** is correct
3. **Ensure you redeployed** after adding environment variables
4. **Try a different TTS provider** if one isn't working
5. **Check browser console** (F12) for error messages

---

## 🎬 What's Happening Behind the Scenes

When you generate a voice:

1. Frontend sends: text + voice preferences to `/api/voice`
2. Backend tries providers in order (VoiceRSS → HuggingFace → ElevenLabs → OpenAI → Google)
3. First successful provider returns audio
4. Frontend plays audio in browser

**If no environment variables are set:**
- Backend returns error: "No valid TTS API key found"
- Frontend shows setup instructions
- **No audio is generated**

**After adding environment variables to Vercel:**
- Backend finds the key
- Converts text to speech successfully
- Streams audio back to frontend
- **Audio plays!** 🎉

---

## 💡 Cost Comparison (For Reference)

| Provider | Cost | Monthly Limit |
|----------|------|---------------|
| HuggingFace | Free | Unlimited (hobby) |
| VoiceRSS | Free | 350 requests/day |
| Google | Free | 1M characters/month |
| ElevenLabs | Free | 10k characters/month |
| OpenAI | Paid | Based on usage |

**Recommendation:** Use HuggingFace - it's completely free and supports all languages! ✨

---

**Last Updated:** 2026-07-01
**Status:** ✅ Production Ready
