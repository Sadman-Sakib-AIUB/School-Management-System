export const contextDataASG = {
  "bangladesh_engineering_admission": {
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
  }
}
