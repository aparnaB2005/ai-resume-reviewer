const express = require('express');
const Groq    = require('groq-sdk');
const Review  = require('../models/Review');
const protect = require('../middleware/authMiddleware');
const router  = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── POST /api/review ─────────────────────────────────────
router.post('/', protect, async (req, res) => {
  const { resumeText, jobDescription, jobTitle } = req.body;

  if (!resumeText || !jobDescription || !jobTitle) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert ATS resume reviewer and career coach.
Analyze the resume against the job description.
Return ONLY valid JSON, no markdown, no backticks, no extra text whatsoever.
Exact format:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`
        },
        {
          role: 'user',
          content: `JOB TITLE: ${jobTitle}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text     = completion.choices[0].message.content;
    const cleaned  = text.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(cleaned);

    const review = await Review.create({
      user: req.user._id,
      jobTitle,
      resumeText,
      jobDescription,
      feedback
    });

    res.status(201).json(review);

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ message: 'AI review failed: ' + err.message });
  }
});

// ── GET /api/review ───────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
                                .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/review/:id ────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;