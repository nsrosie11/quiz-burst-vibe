-- Create table for quiz categories
CREATE TABLE public.quiz_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for quiz levels within categories
CREATE TABLE public.quiz_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.quiz_categories(id),
  level_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  max_points INTEGER NOT NULL DEFAULT 100,
  questions_count INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, level_number)
);

-- Create table for user progress per level
CREATE TABLE public.user_level_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  level_id UUID NOT NULL REFERENCES public.quiz_levels(id),
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, level_id)
);

-- Create table for user category scores (aggregated)
CREATE TABLE public.user_category_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.quiz_categories(id),
  total_score INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create table for daily recommendations
CREATE TABLE public.daily_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.quiz_categories(id),
  recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recommendation_date)
);

-- Create table for overall user scores (for leaderboard)
CREATE TABLE public.user_total_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  global_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_total_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_categories (public read)
CREATE POLICY "Quiz categories are publicly readable" 
ON public.quiz_categories FOR SELECT 
USING (true);

-- RLS Policies for quiz_levels (public read)
CREATE POLICY "Quiz levels are publicly readable" 
ON public.quiz_levels FOR SELECT 
USING (true);

-- RLS Policies for user_level_progress
CREATE POLICY "Users can view their own level progress" 
ON public.user_level_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own level progress" 
ON public.user_level_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own level progress" 
ON public.user_level_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_category_scores
CREATE POLICY "Users can view their own category scores" 
ON public.user_category_scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category scores" 
ON public.user_category_scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category scores" 
ON public.user_category_scores FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for daily_recommendations
CREATE POLICY "Users can view their own daily recommendations" 
ON public.daily_recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily recommendations" 
ON public.daily_recommendations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_total_scores
CREATE POLICY "Users can view all total scores for leaderboard" 
ON public.user_total_scores FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own total score" 
ON public.user_total_scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own total score" 
ON public.user_total_scores FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_quiz_categories_updated_at
BEFORE UPDATE ON public.quiz_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_levels_updated_at
BEFORE UPDATE ON public.quiz_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_level_progress_updated_at
BEFORE UPDATE ON public.user_level_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_category_scores_updated_at
BEFORE UPDATE ON public.user_category_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_total_scores_updated_at
BEFORE UPDATE ON public.user_total_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories
INSERT INTO public.quiz_categories (id, name, icon, color) VALUES
('math', 'Math', '🔢', 'from-blue-500 to-purple-600'),
('history', 'History', '🏛️', 'from-amber-500 to-red-600'),
('sports', 'Sports', '⚽', 'from-green-500 to-blue-600'),
('random', 'Random', '🎲', 'from-purple-500 to-pink-600');

-- Insert sample levels for each category
INSERT INTO public.quiz_levels (category_id, level_number, name, difficulty, max_points, questions_count) VALUES
-- Math levels
('math', 1, 'Basic Arithmetic', 'easy', 50, 5),
('math', 2, 'Algebra Basics', 'medium', 75, 5),
('math', 3, 'Advanced Math', 'hard', 100, 5),
-- History levels
('history', 1, 'Ancient Times', 'easy', 50, 5),
('history', 2, 'Medieval Era', 'medium', 75, 5),
('history', 3, 'Modern History', 'hard', 100, 5),
-- Sports levels
('sports', 1, 'Popular Sports', 'easy', 50, 5),
('sports', 2, 'Sports Rules', 'medium', 75, 5),
('sports', 3, 'Sports Trivia', 'hard', 100, 5),
-- Random levels
('random', 1, 'Easy Mix', 'easy', 50, 5),
('random', 2, 'Medium Mix', 'medium', 75, 5),
('random', 3, 'Hard Mix', 'hard', 100, 5);

-- Function to initialize user progress for a category
CREATE OR REPLACE FUNCTION public.initialize_user_category_progress(p_user_id UUID, p_category_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  level_record RECORD;
  is_first_level BOOLEAN := true;
BEGIN
  -- Insert user category score record if not exists
  INSERT INTO public.user_category_scores (user_id, category_id)
  VALUES (p_user_id, p_category_id)
  ON CONFLICT (user_id, category_id) DO NOTHING;

  -- Insert user level progress for all levels in category
  FOR level_record IN 
    SELECT id, level_number FROM public.quiz_levels 
    WHERE category_id = p_category_id 
    ORDER BY level_number
  LOOP
    INSERT INTO public.user_level_progress (user_id, level_id, status)
    VALUES (
      p_user_id, 
      level_record.id, 
      CASE WHEN is_first_level THEN 'current' ELSE 'locked' END
    )
    ON CONFLICT (user_id, level_id) DO NOTHING;
    
    is_first_level := false;
  END LOOP;
END;
$$;

-- Function to complete a level and unlock next
CREATE OR REPLACE FUNCTION public.complete_level(p_user_id UUID, p_level_id UUID, p_score INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_level RECORD;
  next_level_id UUID;
  category_record RECORD;
BEGIN
  -- Get current level info
  SELECT ql.category_id, ql.level_number, ql.max_points
  INTO current_level
  FROM public.quiz_levels ql
  WHERE ql.id = p_level_id;

  -- Update current level progress
  UPDATE public.user_level_progress
  SET status = 'completed',
      score = p_score,
      max_score = current_level.max_points,
      completed_at = now()
  WHERE user_id = p_user_id AND level_id = p_level_id;

  -- Find and unlock next level
  SELECT id INTO next_level_id
  FROM public.quiz_levels
  WHERE category_id = current_level.category_id
    AND level_number = current_level.level_number + 1;

  IF next_level_id IS NOT NULL THEN
    UPDATE public.user_level_progress
    SET status = 'current'
    WHERE user_id = p_user_id AND level_id = next_level_id;
  END IF;

  -- Update category score
  UPDATE public.user_category_scores
  SET total_score = total_score + p_score,
      levels_completed = levels_completed + 1,
      last_played_at = now()
  WHERE user_id = p_user_id AND category_id = current_level.category_id;

  -- Update total user score
  INSERT INTO public.user_total_scores (user_id, total_score)
  VALUES (p_user_id, p_score)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_score = user_total_scores.total_score + p_score,
    updated_at = now();

  -- Update global ranks
  WITH ranked_users AS (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
    FROM public.user_total_scores
  )
  UPDATE public.user_total_scores uts
  SET global_rank = ru.rank
  FROM ranked_users ru
  WHERE uts.user_id = ru.user_id;
END;
$$;