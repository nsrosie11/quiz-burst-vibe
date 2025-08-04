import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface QuizLevel {
  id: string;
  category_id: string;
  level_number: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  max_points: number;
  questions_count: number;
}

export interface UserLevelProgress {
  id: string;
  level_id: string;
  status: 'locked' | 'current' | 'completed';
  score: number;
  max_score: number;
  completed_at?: string;
}

export interface UserCategoryScore {
  category_id: string;
  total_score: number;
  levels_completed: number;
  last_played_at?: string;
}

export interface DailyRecommendation {
  category_id: string;
  reason: string;
}

export interface LeaderboardEntry {
  user_id: string;
  total_score: number;
  global_rank: number;
  display_name?: string;
}

export const useQuizData = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [userCategoryScores, setUserCategoryScores] = useState<UserCategoryScore[]>([]);
  const [userTotalScore, setUserTotalScore] = useState(0);
  const [globalRank, setGlobalRank] = useState(0);
  const [dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('quiz_categories')
      .select('*')
      .order('name');
    
    if (data && !error) {
      setCategories(data);
    }
  };

  // Fetch user category scores
  const fetchUserCategoryScores = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_category_scores')
      .select('*')
      .eq('user_id', user.id);
    
    if (data && !error) {
      setUserCategoryScores(data);
    }
  };

  // Fetch user total score and rank
  const fetchUserTotalScore = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_total_scores')
      .select('total_score, global_rank')
      .eq('user_id', user.id)
      .single();
    
    if (data && !error) {
      setUserTotalScore(data.total_score || 0);
      setGlobalRank(data.global_rank || 0);
    }
  };

  // Fetch daily recommendation
  const fetchDailyRecommendation = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_recommendations')
      .select('category_id, reason')
      .eq('user_id', user.id)
      .eq('recommendation_date', new Date().toISOString().split('T')[0])
      .single();
    
    if (data && !error) {
      setDailyRecommendation(data);
    } else {
      // Generate recommendation if none exists
      await generateDailyRecommendation();
    }
  };

  // Generate daily recommendation
  const generateDailyRecommendation = async () => {
    if (!user) return;

    // Find categories user hasn't played or has lowest progress
    const unplayedCategories = categories.filter(cat => 
      !userCategoryScores.find(score => score.category_id === cat.id)
    );

    let recommendedCategory;
    let reason;

    if (unplayedCategories.length > 0) {
      recommendedCategory = unplayedCategories[Math.floor(Math.random() * unplayedCategories.length)];
      reason = "Try something new today!";
    } else {
      // Find category with lowest progress
      const categoryWithLowestProgress = userCategoryScores.reduce((min, score) => 
        score.levels_completed < min.levels_completed ? score : min
      );
      recommendedCategory = categories.find(cat => cat.id === categoryWithLowestProgress.category_id);
      reason = "Continue your progress!";
    }

    if (recommendedCategory) {
      await supabase
        .from('daily_recommendations')
        .insert({
          user_id: user.id,
          category_id: recommendedCategory.id,
          reason,
          recommendation_date: new Date().toISOString().split('T')[0]
        });

      setDailyRecommendation({
        category_id: recommendedCategory.id,
        reason
      });
    }
  };

  // Initialize user progress for a category
  const initializeCategoryProgress = async (categoryId: string) => {
    if (!user) return;

    const { error } = await supabase.rpc('initialize_user_category_progress', {
      p_user_id: user.id,
      p_category_id: categoryId
    });

    if (!error) {
      fetchUserCategoryScores();
    }
  };

  // Complete a level
  const completeLevel = async (levelId: string, score: number) => {
    if (!user) return;

    const { error } = await supabase.rpc('complete_level', {
      p_user_id: user.id,
      p_level_id: levelId,
      p_score: score
    });

    if (!error) {
      fetchUserCategoryScores();
      fetchUserTotalScore();
    }
  };

  // Get levels for category
  const getLevelsForCategory = async (categoryId: string): Promise<QuizLevel[]> => {
    const { data, error } = await supabase
      .from('quiz_levels')
      .select('*')
      .eq('category_id', categoryId)
      .order('level_number');
    
    return (data || []) as QuizLevel[];
  };

  // Get user progress for levels
  const getUserLevelProgress = async (categoryId: string): Promise<UserLevelProgress[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_level_progress')
      .select(`
        id,
        level_id,
        status,
        score,
        max_score,
        completed_at,
        quiz_levels!inner(category_id)
      `)
      .eq('user_id', user.id)
      .eq('quiz_levels.category_id', categoryId);
    
    return (data || []) as UserLevelProgress[];
  };

  // Get quiz questions for category
  const getQuizQuestions = async (categoryId: string, levelId?: string): Promise<any[]> => {
    let query = supabase
      .from('quiz_questions')
      .select('*')
      .eq('category_id', categoryId);
    
    if (levelId) {
      query = query.eq('level_id', levelId);
    }
    
    const { data, error } = await query.limit(5);
    
    if (error || !data) return [];
    
    // Transform to match QuizInterface expected format
    return data.map(q => ({
      id: q.id,
      question: q.question_text,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correctAnswer: q.correct_answer
    }));
  };

  // Get leaderboard
  const getLeaderboard = async (timeframe: 'weekly' | 'monthly' = 'weekly'): Promise<LeaderboardEntry[]> => {
    // First get user scores
    const { data: scoreData, error: scoreError } = await supabase
      .from('user_total_scores')
      .select('user_id, total_score, global_rank')
      .order('total_score', { ascending: false })
      .limit(50);

    if (!scoreData || scoreError) return [];

    // Then get profiles for those users
    const userIds = scoreData.map(item => item.user_id);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    if (profileError) return [];

    // Combine the data
    return scoreData.map(item => ({
      user_id: item.user_id,
      total_score: item.total_score,
      global_rank: item.global_rank || 0,
      display_name: profileData?.find(p => p.user_id === item.user_id)?.display_name || 'Unknown User'
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      if (user) {
        await Promise.all([
          fetchUserCategoryScores(),
          fetchUserTotalScore(),
          fetchDailyRecommendation()
        ]);
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    categories,
    userCategoryScores,
    userTotalScore,
    globalRank,
    dailyRecommendation,
    loading,
    initializeCategoryProgress,
    completeLevel,
    getLevelsForCategory,
    getUserLevelProgress,
    getLeaderboard,
    getQuizQuestions,
    fetchUserCategoryScores,
    fetchUserTotalScore
  };
};