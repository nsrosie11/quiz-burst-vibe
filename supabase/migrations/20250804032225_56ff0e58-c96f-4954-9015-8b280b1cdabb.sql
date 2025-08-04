-- Add two new categories
INSERT INTO public.quiz_categories (id, name, icon, color) VALUES 
('science', 'Science', '🧪', '#10b981'),
('general', 'General Knowledge', '🌍', '#8b5cf6');

-- Add corresponding levels for Science category
INSERT INTO public.quiz_levels (category_id, level_number, name, difficulty, max_points, questions_count) VALUES
('science', 1, 'Basic Science', 'easy', 100, 5),
('science', 2, 'Chemistry Basics', 'medium', 150, 5),
('science', 3, 'Physics Fundamentals', 'hard', 200, 5);

-- Add corresponding levels for General category
INSERT INTO public.quiz_levels (category_id, level_number, name, difficulty, max_points, questions_count) VALUES
('general', 1, 'World Facts', 'easy', 100, 5),
('general', 2, 'Mixed Knowledge', 'medium', 150, 5),
('general', 3, 'Expert Quiz', 'hard', 200, 5);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.quiz_categories(id),
  level_id UUID REFERENCES public.quiz_levels(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create policy for quiz questions (publicly readable)
CREATE POLICY "Quiz questions are publicly readable" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_quiz_questions_updated_at
BEFORE UPDATE ON public.quiz_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample questions for Math category
INSERT INTO public.quiz_questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('math', 'What is 12 × 7?', '74', '84', '94', '104', 1, 'easy'),
('math', 'What is the square root of 144?', '11', '12', '13', '14', 1, 'easy'),
('math', 'What is 15% of 200?', '25', '30', '35', '40', 1, 'easy'),
('math', 'What is 8³ (8 to the power of 3)?', '256', '512', '64', '128', 1, 'medium'),
('math', 'What is the derivative of x²?', 'x', '2x', '2x²', 'x²', 1, 'hard');

-- Insert sample questions for English category
INSERT INTO public.quiz_questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('english', 'Which word is a synonym for "happy"?', 'Sad', 'Joyful', 'Angry', 'Tired', 1, 'easy'),
('english', 'What is the past tense of "run"?', 'Runned', 'Ran', 'Running', 'Runs', 1, 'easy'),
('english', 'Which is the correct spelling?', 'Recieve', 'Receive', 'Recive', 'Receeve', 1, 'easy'),
('english', 'What type of word is "quickly"?', 'Noun', 'Adjective', 'Adverb', 'Verb', 2, 'medium'),
('english', 'What literary device is used in "The wind whispered"?', 'Metaphor', 'Simile', 'Personification', 'Alliteration', 2, 'hard');

-- Insert sample questions for History category
INSERT INTO public.quiz_questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('history', 'In which year did World War II end?', '1944', '1945', '1946', '1947', 1, 'easy'),
('history', 'Who was the first President of the United States?', 'Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin', 1, 'easy'),
('history', 'Which empire was ruled by Julius Caesar?', 'Greek Empire', 'Roman Empire', 'Egyptian Empire', 'Persian Empire', 1, 'easy'),
('history', 'The French Revolution began in which year?', '1789', '1799', '1779', '1809', 0, 'medium'),
('history', 'Who wrote "The Communist Manifesto"?', 'Vladimir Lenin', 'Karl Marx', 'Joseph Stalin', 'Leon Trotsky', 1, 'hard');

-- Insert sample questions for Science category
INSERT INTO public.quiz_questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('science', 'What is the chemical symbol for water?', 'H2O', 'CO2', 'NaCl', 'O2', 0, 'easy'),
('science', 'How many bones are in the adult human body?', '196', '206', '216', '226', 1, 'easy'),
('science', 'What planet is closest to the Sun?', 'Venus', 'Earth', 'Mercury', 'Mars', 2, 'easy'),
('science', 'What is the speed of light in vacuum?', '299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s', 0, 'medium'),
('science', 'What is the most abundant gas in Earth''s atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon', 1, 'hard');

-- Insert sample questions for General category
INSERT INTO public.quiz_questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('general', 'What is the capital of Australia?', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 2, 'easy'),
('general', 'Which is the largest ocean on Earth?', 'Atlantic', 'Pacific', 'Indian', 'Arctic', 1, 'easy'),
('general', 'Mount Everest is located in which mountain range?', 'Andes', 'Alps', 'Himalayas', 'Rocky Mountains', 2, 'easy'),
('general', 'What is the currency of Japan?', 'Yuan', 'Won', 'Yen', 'Ringgit', 2, 'medium'),
('general', 'Which philosopher wrote "The Republic"?', 'Aristotle', 'Socrates', 'Plato', 'Descartes', 2, 'hard');