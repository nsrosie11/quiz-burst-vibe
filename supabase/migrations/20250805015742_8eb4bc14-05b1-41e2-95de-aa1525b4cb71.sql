-- First, add missing categories
INSERT INTO public.quiz_categories (id, name, icon, color) VALUES
('history', 'History', '🏛️', '#8B5CF6'),
('math', 'Math', '🔢', '#EF4444'),
('sports', 'Sports', '⚽', '#10B981'),
('random', 'Random', '🎲', '#F59E0B')
ON CONFLICT (id) DO NOTHING;

-- Add levels for new categories
INSERT INTO public.quiz_levels (category_id, level_number, name, difficulty, questions_count, max_points) VALUES
-- History levels
('history', 1, 'Ancient Times', 'easy', 5, 100),
('history', 2, 'Medieval Era', 'medium', 5, 150),
('history', 3, 'Modern History', 'hard', 5, 200),
-- Math levels  
('math', 1, 'Basic Math', 'easy', 5, 100),
('math', 2, 'Algebra', 'medium', 5, 150),
('math', 3, 'Advanced Math', 'hard', 5, 200),
-- Sports levels
('sports', 1, 'Popular Sports', 'easy', 5, 100),
('sports', 2, 'Olympic Games', 'medium', 5, 150),
('sports', 3, 'Sports History', 'hard', 5, 200),
-- Random levels
('random', 1, 'Mixed Easy', 'easy', 5, 100),
('random', 2, 'Mixed Medium', 'medium', 5, 150),
('random', 3, 'Mixed Hard', 'hard', 5, 200)
ON CONFLICT (category_id, level_number) DO NOTHING;

-- Add comprehensive quiz questions for all categories and levels

-- English Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 1), 'What is the plural of "child"?', 'childs', 'children', 'childrens', 'child', 1, 'easy'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 1), 'Which word is a noun?', 'run', 'quickly', 'book', 'beautiful', 2, 'easy'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 1), 'What is the opposite of "hot"?', 'warm', 'cool', 'cold', 'freezing', 2, 'easy'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 1), 'Which sentence is correct?', 'I are happy', 'I am happy', 'I is happy', 'I be happy', 1, 'easy'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 1), 'What does "big" mean?', 'small', 'large', 'fast', 'slow', 1, 'easy');

-- English Questions (Level 2 - Medium)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 2), 'What is a synonym for "difficult"?', 'easy', 'hard', 'simple', 'clear', 1, 'medium'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 2), 'Which is the correct past tense of "go"?', 'goed', 'went', 'gone', 'going', 1, 'medium'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 2), 'What type of word is "quickly"?', 'noun', 'verb', 'adjective', 'adverb', 3, 'medium'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 2), 'Which sentence uses correct grammar?', 'She don''t like pizza', 'She doesn''t like pizza', 'She not like pizza', 'She no like pizza', 1, 'medium'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 2), 'What is the comparative form of "good"?', 'gooder', 'more good', 'better', 'best', 2, 'medium');

-- English Questions (Level 3 - Hard)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 3), 'What is a "metaphor"?', 'A direct comparison using like or as', 'A comparison without using like or as', 'A sound effect', 'A type of poem', 1, 'hard'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 3), 'Which sentence uses subjunctive mood?', 'I am going to the store', 'If I were rich, I would travel', 'She runs every day', 'They ate dinner', 1, 'hard'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 3), 'What is the meaning of "ubiquitous"?', 'rare', 'everywhere', 'ancient', 'modern', 1, 'hard'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 3), 'Which is an example of alliteration?', 'The sun is bright', 'Peter Piper picked peppers', 'I went to the store', 'She is very tall', 1, 'hard'),
('english', (SELECT id FROM quiz_levels WHERE category_id = 'english' AND level_number = 3), 'What is the passive voice of "The cat caught the mouse"?', 'The mouse was caught by the cat', 'The cat was catching the mouse', 'The mouse caught the cat', 'The cat will catch the mouse', 0, 'hard');

-- History Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('history', (SELECT id FROM quiz_levels WHERE category_id = 'history' AND level_number = 1), 'Who built the pyramids?', 'Romans', 'Greeks', 'Egyptians', 'Chinese', 2, 'easy'),
('history', (SELECT id FROM quiz_levels WHERE category_id = 'history' AND level_number = 1), 'In which year did World War II end?', '1944', '1945', '1946', '1947', 1, 'easy'),
('history', (SELECT id FROM quiz_levels WHERE category_id = 'history' AND level_number = 1), 'Who was the first President of the United States?', 'Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin', 2, 'easy'),
('history', (SELECT id FROM quiz_levels WHERE category_id = 'history' AND level_number = 1), 'Which empire was ruled by Julius Caesar?', 'Greek Empire', 'Roman Empire', 'Persian Empire', 'Ottoman Empire', 1, 'easy'),
('history', (SELECT id FROM quiz_levels WHERE category_id = 'history' AND level_number = 1), 'The Titanic sank in which year?', '1910', '1911', '1912', '1913', 2, 'easy');

-- Math Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 1), 'What is 5 + 3?', '7', '8', '9', '10', 1, 'easy'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 1), 'What is 12 - 4?', '6', '7', '8', '9', 2, 'easy'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 1), 'What is 6 × 4?', '20', '22', '24', '26', 2, 'easy'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 1), 'What is 20 ÷ 4?', '4', '5', '6', '7', 1, 'easy'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 1), 'What is 50% of 100?', '25', '50', '75', '100', 1, 'easy');

-- Math Questions (Level 2 - Medium)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 2), 'What is x if 2x + 5 = 15?', '5', '10', '15', '20', 0, 'medium'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 2), 'What is the square root of 64?', '6', '7', '8', '9', 2, 'medium'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 2), 'What is 15% of 200?', '25', '30', '35', '40', 1, 'medium'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 2), 'What is the area of a rectangle with length 8 and width 5?', '35', '40', '45', '50', 1, 'medium'),
('math', (SELECT id FROM quiz_levels WHERE category_id = 'math' AND level_number = 2), 'If y = 3x + 2 and x = 4, what is y?', '12', '14', '16', '18', 1, 'medium');

-- Science Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('science', (SELECT id FROM quiz_levels WHERE category_id = 'science' AND level_number = 1), 'What gas do plants absorb from the atmosphere?', 'Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen', 1, 'easy'),
('science', (SELECT id FROM quiz_levels WHERE category_id = 'science' AND level_number = 1), 'How many bones are in the adult human body?', '196', '206', '216', '226', 1, 'easy'),
('science', (SELECT id FROM quiz_levels WHERE category_id = 'science' AND level_number = 1), 'What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'NaCl', 0, 'easy'),
('science', (SELECT id FROM quiz_levels WHERE category_id = 'science' AND level_number = 1), 'Which planet is closest to the Sun?', 'Venus', 'Mars', 'Mercury', 'Earth', 2, 'easy'),
('science', (SELECT id FROM quiz_levels WHERE category_id = 'science' AND level_number = 1), 'What force keeps us on the ground?', 'Magnetism', 'Gravity', 'Friction', 'Pressure', 1, 'easy');

-- Sports Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('sports', (SELECT id FROM quiz_levels WHERE category_id = 'sports' AND level_number = 1), 'How many players are on a basketball team on the court?', '4', '5', '6', '7', 1, 'easy'),
('sports', (SELECT id FROM quiz_levels WHERE category_id = 'sports' AND level_number = 1), 'In which sport would you perform a slam dunk?', 'Football', 'Basketball', 'Tennis', 'Golf', 1, 'easy'),
('sports', (SELECT id FROM quiz_levels WHERE category_id = 'sports' AND level_number = 1), 'How many holes are there in a standard golf course?', '16', '17', '18', '19', 2, 'easy'),
('sports', (SELECT id FROM quiz_levels WHERE category_id = 'sports' AND level_number = 1), 'What color card does a referee show for a serious foul in soccer?', 'Yellow', 'Red', 'Blue', 'Green', 1, 'easy'),
('sports', (SELECT id FROM quiz_levels WHERE category_id = 'sports' AND level_number = 1), 'How many points is a touchdown worth in American football?', '5', '6', '7', '8', 1, 'easy');

-- General Knowledge Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('general', (SELECT id FROM quiz_levels WHERE category_id = 'general' AND level_number = 1), 'What is the capital of France?', 'London', 'Berlin', 'Madrid', 'Paris', 3, 'easy'),
('general', (SELECT id FROM quiz_levels WHERE category_id = 'general' AND level_number = 1), 'How many continents are there?', '5', '6', '7', '8', 2, 'easy'),
('general', (SELECT id FROM quiz_levels WHERE category_id = 'general' AND level_number = 1), 'What is the largest ocean?', 'Atlantic', 'Pacific', 'Indian', 'Arctic', 1, 'easy'),
('general', (SELECT id FROM quiz_levels WHERE category_id = 'general' AND level_number = 1), 'Which animal is known as the King of the Jungle?', 'Tiger', 'Lion', 'Elephant', 'Gorilla', 1, 'easy'),
('general', (SELECT id FROM quiz_levels WHERE category_id = 'general' AND level_number = 1), 'What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Luxembourg', 1, 'easy');

-- Random Questions (Level 1 - Easy)
INSERT INTO public.quiz_questions (category_id, level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
('random', (SELECT id FROM quiz_levels WHERE category_id = 'random' AND level_number = 1), 'What color do you get when you mix red and blue?', 'Green', 'Purple', 'Orange', 'Yellow', 1, 'easy'),
('random', (SELECT id FROM quiz_levels WHERE category_id = 'random' AND level_number = 1), 'How many days are in a leap year?', '365', '366', '367', '364', 1, 'easy'),
('random', (SELECT id FROM quiz_levels WHERE category_id = 'random' AND level_number = 1), 'What instrument does Yo-Yo Ma famously play?', 'Violin', 'Piano', 'Cello', 'Flute', 2, 'easy'),
('random', (SELECT id FROM quiz_levels WHERE category_id = 'random' AND level_number = 1), 'Which Disney movie features the song "Let It Go"?', 'Moana', 'Frozen', 'Tangled', 'Brave', 1, 'easy'),
('random', (SELECT id FROM quiz_levels WHERE category_id = 'random' AND level_number = 1), 'What does "www" stand for?', 'World Wide Web', 'World Web Wide', 'Web World Wide', 'Wide World Web', 0, 'easy');