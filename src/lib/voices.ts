export interface VoiceCharacter {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  age: 'young' | 'adult' | 'senior';
  accent: string;
  emotion: string;
  avatar: string;
  isPremium?: boolean;
}

export const voices: VoiceCharacter[] = [
  {
    id: 'Spanish_SophisticatedLady',
    name: 'Sophisticated Lady',
    description: 'A refined and sophisticated adult lady\'s voice in Standard Spanish.',
    gender: 'female',
    age: 'adult',
    accent: 'Spanish',
    emotion: 'sophisticated',
    avatar: '👩‍🎓',
    isPremium: false
  },
  {
    id: 'English_Trustworth_Man',
    name: 'Trustworthy Man',
    description: 'A trustworthy and resonant adult male voice with a general American accent.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'trustworthy',
    avatar: '🤵',
    isPremium: false
  },
  {
    id: 'English_CaptivatingStoryteller',
    name: 'Captivating Storyteller',
    description: 'A captivating senior male storyteller with a cold, detached tone.',
    gender: 'male',
    age: 'senior',
    accent: 'American',
    emotion: 'captivating',
    avatar: '👴',
    isPremium: true
  },
  {
    id: 'English_ManWithDeepVoice',
    name: 'Deep Voice Man',
    description: 'An adult male with a deep, commanding voice and a general American accent.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'commanding',
    avatar: '🎙️',
    isPremium: false
  },
  {
    id: 'English_Graceful_Lady',
    name: 'Graceful Lady',
    description: 'A graceful and elegant middle-aged female voice with a classic British accent.',
    gender: 'female',
    age: 'adult',
    accent: 'British',
    emotion: 'elegant',
    avatar: '👸',
    isPremium: true
  },
  {
    id: 'English_Insightful_Speaker',
    name: 'Insightful Speaker',
    description: 'A deliberate and authoritative male voice with a scholarly tone.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'authoritative',
    avatar: '👨‍🏫',
    isPremium: true
  },
  {
    id: 'English_Whispering_girl_v3',
    name: 'Whispering Girl',
    description: 'A young adult female voice delivering a soft whisper, perfect for ASMR content.',
    gender: 'female',
    age: 'young',
    accent: 'American',
    emotion: 'whisper',
    avatar: '🤫',
    isPremium: true
  },
  {
    id: 'English_patient_man_v1',
    name: 'Patient Man',
    description: 'An adult male voice with a gentle, soft-spoken delivery. The calm and reassuring tone.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'patient',
    avatar: '😌',
    isPremium: false
  },
  {
    id: 'English_Persuasive_Man',
    name: 'Persuasive Man',
    description: 'An adult male voice with a gentle, soft-spoken delivery. The calm and reassuring tone.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'persuasive',
    avatar: '🗣️',
    isPremium: false
  },
  {
    id: 'English_MatureBoss',
    name: 'Bossy Lady',
    description: 'A mature, middle-aged female voice with a general American accent.',
    gender: 'female',
    age: 'adult',
    accent: 'American',
    emotion: 'bossy',
    avatar: '👩‍💼',
    isPremium: true
  },
  {
    id: 'English_MaturePartner',
    name: 'Mature Partner',
    description: 'A mature, gentle middle-aged male voice with a British accent, suitable for partnerships.',
    gender: 'male',
    age: 'adult',
    accent: 'British',
    emotion: 'gentle',
    avatar: '🤝',
    isPremium: false
  },
  {
    id: 'English_Explanatory_Man',
    name: 'Explanatory Man',
    description: 'An Adult Male English voice with a general American accent, characterized by clear explanations.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'explanatory',
    avatar: '💡',
    isPremium: false
  },
  {
    id: 'moss_audio_737a299c-734a-11f0-918f-4e0486034804',
    name: 'Knowledge Pill',
    description: 'A vibrant young male voice, with the kind of clear, trustworthy delivery ideal for educational content.',
    gender: 'male',
    age: 'young',
    accent: 'American',
    emotion: 'vibrant',
    avatar: '📚',
    isPremium: true
  },
  {
    id: 'moss_audio_c12a59b9-7115-11f0-a447-9613c873494c',
    name: 'Engaging Girl',
    description: 'An engaging and expressive vocal tone, typical of a young woman.',
    gender: 'female',
    age: 'young',
    accent: 'American',
    emotion: 'engaging',
    avatar: '🌟',
    isPremium: false
  },
  {
    id: 'English_CalmWoman',
    name: 'Calm Woman',
    description: 'A calm and soothing adult female voice with a general American accent.',
    gender: 'female',
    age: 'adult',
    accent: 'American',
    emotion: 'calm',
    avatar: '🧘‍♀️',
    isPremium: false
  },
  {
    id: 'English_magnetic_voiced_man',
    name: 'Magnetic-voiced Male',
    description: 'A magnetic and persuasive adult male voice with a general American accent.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'magnetic',
    avatar: '🧲',
    isPremium: true
  },
  {
    id: 'English_UpsetGirl',
    name: 'Upset Girl',
    description: 'A young adult female voice with a British accent, effectively conveying sadness.',
    gender: 'female',
    age: 'young',
    accent: 'British',
    emotion: 'upset',
    avatar: '😢',
    isPremium: false
  },
  {
    id: 'English_captivating_female1',
    name: 'Captivating Female',
    description: 'A captivating adult female voice with a general American accent, ideal for presentations.',
    gender: 'female',
    age: 'adult',
    accent: 'American',
    emotion: 'captivating',
    avatar: '✨',
    isPremium: true
  },
  {
    id: 'English_PlayfulGirl',
    name: 'Playful Girl',
    description: 'A playful female youth voice with a general American accent, ideal for fun content.',
    gender: 'female',
    age: 'young',
    accent: 'American',
    emotion: 'playful',
    avatar: '🎭',
    isPremium: false
  },
  {
    id: 'English_Gentle-voiced_man',
    name: 'Gentle-voiced Man',
    description: 'A gentle and resonant adult male voice with a general American accent.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'gentle',
    avatar: '🕊️',
    isPremium: false
  },
  {
    id: 'English_Upbeat_Woman',
    name: 'Upbeat Woman',
    description: 'An upbeat and bright adult female voice with a general American accent.',
    gender: 'female',
    age: 'adult',
    accent: 'American',
    emotion: 'upbeat',
    avatar: '☀️',
    isPremium: false
  },
  {
    id: 'English_ReservedYoungMan',
    name: 'Reserved Young Man',
    description: 'A reserved and cold adult male voice with a general American accent.',
    gender: 'male',
    age: 'young',
    accent: 'American',
    emotion: 'reserved',
    avatar: '🤐',
    isPremium: false
  },
  {
    id: 'moss_audio_6dc281eb-713c-11f0-a447-9613c873494c',
    name: 'Wise Grandma',
    description: 'A sweet old granny, mumbling slightly, sharing life lessons with you with great warmth.',
    gender: 'female',
    age: 'senior',
    accent: 'American',
    emotion: 'wise',
    avatar: '👵',
    isPremium: true
  },
  {
    id: 'English_Diligent_Man',
    name: 'Diligent Man',
    description: 'A diligent and sincere adult male voice with an Indian accent, conveying honesty and hard work.',
    gender: 'male',
    age: 'adult',
    accent: 'Indian',
    emotion: 'diligent',
    avatar: '💪',
    isPremium: false
  },
  {
    id: 'English_expressive_narrator',
    name: 'Expressive Narrator',
    description: 'An expressive adult male voice with a British accent, perfect for engaging audiobook narration.',
    gender: 'male',
    age: 'adult',
    accent: 'British',
    emotion: 'expressive',
    avatar: '📖',
    isPremium: true
  },
  {
    id: 'English_radiant_girl',
    name: 'Radiant Girl',
    description: 'A radiant and lively young adult female voice with a general American accent, full of energy and brightness.',
    gender: 'female',
    age: 'young',
    accent: 'American',
    emotion: 'radiant',
    avatar: '🌈',
    isPremium: false
  },
  {
    id: 'moss_audio_a0d611da-737c-11f0-ad20-f2bc95e89150',
    name: 'Approachable Dan',
    description: 'A middle-aged man with a warm and welcoming voice, delivering an introduction.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'approachable',
    avatar: '🤗',
    isPremium: false
  },
  {
    id: 'moss_audio_570551b1-735c-11f0-b236-0adeeecad052',
    name: 'Contrarian Konrad',
    description: 'A self-assured man with a German accent. He comes across as cocky.',
    gender: 'male',
    age: 'adult',
    accent: 'German',
    emotion: 'contrarian',
    avatar: '🤨',
    isPremium: true
  },
  {
    id: 'English_compelling_lady1',
    name: 'Compelling Lady',
    description: 'A compelling adult female voice with a British accent, suitable for broadcast and formal announcements. Clear and authoritative.',
    gender: 'female',
    age: 'adult',
    accent: 'British',
    emotion: 'compelling',
    avatar: '🎯',
    isPremium: true
  },
  {
    id: 'moss_audio_4f4172f4-737b-11f0-9540-7ef9b4b62566',
    name: 'Understated Camden',
    description: 'A middle-aged man speaking about his hobbies in a quiet, unassuming way.',
    gender: 'male',
    age: 'adult',
    accent: 'American',
    emotion: 'understated',
    avatar: '🤫',
    isPremium: false
  }
];

// Helper functions
export const getVoiceById = (id: string): VoiceCharacter | undefined => {
  return voices.find(voice => voice.id === id);
};

export const getFreeVoices = (): VoiceCharacter[] => {
  return voices.filter(voice => !voice.isPremium);
};

export const getPremiumVoices = (): VoiceCharacter[] => {
  return voices.filter(voice => voice.isPremium);
};

export const getVoicesByGender = (gender: 'male' | 'female'): VoiceCharacter[] => {
  return voices.filter(voice => voice.gender === gender);
};

export const getVoicesByAge = (age: 'young' | 'adult' | 'senior'): VoiceCharacter[] => {
  return voices.filter(voice => voice.age === age);
};

export const getVoicesByAccent = (accent: string): VoiceCharacter[] => {
  return voices.filter(voice => voice.accent.toLowerCase().includes(accent.toLowerCase()));
};

export const searchVoices = (query: string): VoiceCharacter[] => {
  const lowercaseQuery = query.toLowerCase();
  return voices.filter(voice =>
    voice.name.toLowerCase().includes(lowercaseQuery) ||
    voice.description.toLowerCase().includes(lowercaseQuery) ||
    voice.emotion.toLowerCase().includes(lowercaseQuery) ||
    voice.accent.toLowerCase().includes(lowercaseQuery)
  );
};