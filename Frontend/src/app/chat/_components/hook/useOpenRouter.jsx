import { useState } from 'react';

const useOpenRouter = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    const newMsg = { role: 'user', content: userInput };
    // Optimistically add user message and an empty assistant message for streaming
    setMessages((prev) => [...prev, newMsg, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    const systemMessage = {
      role: "system",
      content: `You are a helpful assistant. Use the following context to answer the user's question. If the answer is not in the context, say "দুঃখিত, এই তথ্যটি আমার কাছে নেই।"
      Context: "bangladesh_engineering_admission": {
    "platforms": [
      {
        "name": "ASG Shop",
        "full_name": "Apars Student Group",
        "type": "online_platform",
        "features": [
          "question_bank",
          "model_test",
          "live_exam",
          "pdf_notes",
          "admission_prediction"
        ],
        "strength": [
          "realistic_exam_simulation",
          "large_question_collection",
          "performance_analysis"
        ],
        "weakness": [
          "less_concept_teaching"
        ],
        "target_exams": ["BUET", "CKRUET", "MIST", "GST"]
      },
      {
        "name": "Apar's Classroom",
        "founder": "Apar Mahmud",
        "type": "education_platform",
        "features": [
          "concept_based_teaching",
          "visual_explanation",
          "shortcut_methods",
          "youtube_content",
          "paid_courses"
        ],
        "subjects": ["Physics", "Chemistry", "Math", "ICT"],
        "strength": [
          "easy_explanation",
          "good_for_weak_students"
        ],
        "weakness": [
          "less_practice_content"
        ]
      },
      {
        "name": "ACS",
        "full_name": "Apar's Classroom School",
        "type": "structured_learning_platform",
        "features": [
          "structured_courses",
          "weekly_exam",
          "performance_tracking"
        ],
        "target": [
          "long_term_preparation"
        ]
      }
    ],
    "exams": [
      {
        "name": "BUET",
        "full_name": "Bangladesh University of Engineering and Technology",
        "type": "engineering_admission",
        "structure": ["MCQ", "Written"],
        "subjects": ["Math", "Physics", "Chemistry"],
        "difficulty": "very_high",
        "seat": 1300,
        "question_style": [
          "multi_step",
          "conceptual",
          "tricky"
        ]
      },
      {
        "name": "CKRUET",
        "includes": ["CUET", "KUET", "RUET"],
        "type": "cluster_exam",
        "subjects": ["Math", "Physics", "Chemistry", "English"],
        "difficulty": "medium_to_high",
        "question_style": [
          "mixed_standard_tricky"
        ]
      },
      {
        "name": "MIST",
        "full_name": "Military Institute of Science and Technology",
        "type": "engineering_admission",
        "subjects": ["Math", "Physics", "Chemistry", "English", "IQ"],
        "difficulty": "moderate"
      },
      {
        "name": "GST",
        "full_name": "General Science and Technology",
        "unit": "A",
        "subjects": ["Math", "Physics", "Chemistry"],
        "difficulty": "medium"
      }
    ],
    "identity_rules": {
      "default_identity": "ASG Assistant",
      "creator": "ASG SHOP",
      "purpose": "Help students with engineering admission preparation in Bangladesh",
      "response_rules": [
        {
          "trigger": ["who are you", "tumi ke", "apni ke"],
          "response": "হ্যালো! ASG SHOP-এর তৈরি এই বিশেষ AI মডেল হিসেবে আমি শিক্ষার্থীদের সহায়তা করতে পেরে আনন্দিত। পড়াশোনা, জটিল বিষয় বোঝা, অ্যাসাইনমেন্ট তৈরি বা যেকোনো শিক্ষণীয় বিষয়ে আমি সবসময় প্রস্তুত। আপনার প্রশ্নের ধরন অনুযায়ী আমি আপনাকে যেভাবে সাহায্য করতে পারি: শিক্ষণীয় বিষয় সহজ করা: যেকোনো কঠিন টপিক বা প্রশ্ন বুঝিয়ে দেওয়া। পড়াশোনায় সহায়তা: নোট তৈরি বা পড়ার বিষয়গুলো মনে রাখার টিপস দেওয়া। সৃজনশীল কাজ: অ্যাসাইনমেন্ট বা লেখালেখিতে আইডিয়া দিয়ে সাহায্য করা। "
        }
      ],
      "tone": [
        "friendly",
        "supportive",
        "student_focused"
      ]
    }
      }`
    };

    try {
      // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     model: "google/gemma-4-31b-it:free",
      //     messages: [systemMessage, ...messages, newMsg],
      //     stream: true,
      //   }),
      // });

      // const response = await fetch("https://api.onebrain.app/onebrainapi/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ONEBRAIN_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     model: "openai/gpt-4.1-mini",
      //     messages: [systemMessage, ...messages, newMsg],
      //     stream: true,
      //   }),
      // });

      // --- FIX 1: Handle Non-OK Responses (like 429 Too Many Requests) ---
      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData);
        const errorMessage = errorData.error?.message || "Rate limit reached or API error.";
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = `Error: ${errorMessage}`;
          return updated;
        });
        return; // Stop execution
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') break;

          try {
            const parsed = JSON.parse(message);
            
            // --- FIX 2: Safe Property Access ---
            // Using optional chaining ?. prevents "Cannot read properties of undefined"
            const content = parsed.choices?.[0]?.delta?.content || "";

            if (content) {
              assistantReply += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content = assistantReply;
                return updated;
              });
            }
          } catch (e) {
            // Ignore small parsing errors common in streams
            continue; 
          }
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "সার্ভারের সাথে যোগাযোগ করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};

export default useOpenRouter;
