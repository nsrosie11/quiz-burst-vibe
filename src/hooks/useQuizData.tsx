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
    const { data } = await supabase
      .from('quiz_categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
  };

  // Fetch user category scores
  const fetchUserCategoryScores = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_category_scores')
      .select('*')
      .eq('user_id', user.id);
    if (data) setUserCategoryScores(data);
  };

  // Fetch user total score and rank
  const fetchUserTotalScore = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_total_scores')
      .select('total_score, global_rank')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setUserTotalScore(data.total_score || 0);
      setGlobalRank(data.global_rank || 0);
    }
  };

  // Fetch daily recommendation
  const fetchDailyRecommendation = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('daily_recommendations')
      .select('category_id, reason')
      .eq('user_id', user.id)
      .eq('recommendation_date', new Date().toISOString().split('T')[0])
      .single();

    if (data) {
      setDailyRecommendation(data);
    } else {
      await generateDailyRecommendation();
    }
  };

  // Generate daily recommendation
  const generateDailyRecommendation = async () => {
    if (!user || categories.length === 0) return;

    const unplayedCategories = categories.filter(cat =>
      !userCategoryScores.find(score => score.category_id === cat.id)
    );

    let recommendedCategory;
    let reason;

    if (unplayedCategories.length > 0) {
      recommendedCategory = unplayedCategories[Math.floor(Math.random() * unplayedCategories.length)];
      reason = "Try something new today!";
    } else if (userCategoryScores.length > 0) {
      const categoryWithLowestProgress = userCategoryScores.reduce((min, score) =>
        score.levels_completed < min.levels_completed ? score : min
      );
      recommendedCategory = categories.find(cat => cat.id === categoryWithLowestProgress.category_id);
      reason = "Continue your progress!";
    } else {
      recommendedCategory = categories[0];
      reason = "Start your quiz journey!";
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
    await supabase.rpc('initialize_user_category_progress', {
      p_user_id: user.id,
      p_category_id: categoryId
    });
    fetchUserCategoryScores();
  };

  // ✅ Complete a level + unlock next level
  const completeLevel = async (levelId: string, score: number) => {
    if (!user) return;

    // 1. Tandai level sekarang jadi completed
    await supabase
      .from('user_level_progress')
      .upsert({
        user_id: user.id,
        level_id: levelId,
        status: 'completed',
        score,
        max_score: score,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id, level_id' });

    // 2. Ambil info level sekarang
    const { data: currentLevel } = await supabase
      .from('quiz_levels')
      .select('category_id, level_number')
      .eq('id', levelId)
      .single();

    if (currentLevel) {
      // 3. Cari level berikutnya
      const { data: nextLevel } = await supabase
        .from('quiz_levels')
        .select('id')
        .eq('category_id', currentLevel.category_id)
        .eq('level_number', currentLevel.level_number + 1)
        .single();

      if (nextLevel) {
        // 4. Cek progress user di level berikutnya
        const { data: existingProgress } = await supabase
          .from('user_level_progress')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('level_id', nextLevel.id)
          .maybeSingle();

        if (!existingProgress) {
          await supabase
            .from('user_level_progress')
            .insert({
              user_id: user.id,
              level_id: nextLevel.id,
              status: 'current',
              score: 0,
              max_score: 0
            });
        } else if (existingProgress.status === 'locked') {
          await supabase
            .from('user_level_progress')
            .update({ status: 'current' })
            .eq('id', existingProgress.id);
        }
      }
    }

    await Promise.all([
      fetchUserCategoryScores(),
      fetchUserTotalScore()
    ]);
  };

  // ✅ Save category progress (akumulasi skor, bukan replace)
  const saveCategoryProgress = async (categoryId: string, score: number) => {
    if (!user) return;

    await initializeCategoryProgress(categoryId);

    const { data: oldCategoryScore } = await supabase
      .from('user_category_scores')
      .select('total_score, levels_completed')
      .eq('user_id', user.id)
      .eq('category_id', categoryId)
      .single();

    const existingCategoryScore = oldCategoryScore?.total_score || 0;
    const existingLevelsCompleted = oldCategoryScore?.levels_completed || 0;
    const newCategoryScore = existingCategoryScore + score;

    await supabase
      .from('user_category_scores')
      .upsert({
        user_id: user.id,
        category_id: categoryId,
        total_score: newCategoryScore,
        levels_completed: existingLevelsCompleted + 1,
        last_played_at: new Date().toISOString()
      }, { onConflict: 'user_id,category_id' });

    const { data: oldTotalScore } = await supabase
      .from('user_total_scores')
      .select('total_score')
      .eq('user_id', user.id)
      .single();

    const existingTotalScore = oldTotalScore?.total_score || 0;
    const newTotalScore = existingTotalScore + score;

    await supabase
      .from('user_total_scores')
      .upsert({
        user_id: user.id,
        total_score: newTotalScore
      }, { onConflict: 'user_id' });

    await Promise.all([
      fetchUserCategoryScores(),
      fetchUserTotalScore()
    ]);
  };

  // Get levels for category
  const getLevelsForCategory = async (categoryId: string): Promise<QuizLevel[]> => {
    const { data } = await supabase
      .from('quiz_levels')
      .select('*')
      .eq('category_id', categoryId)
      .order('level_number');
    return (data || []) as QuizLevel[];
  };

  // Get user progress for levels
  const getUserLevelProgress = async (categoryId: string): Promise<UserLevelProgress[]> => {
    if (!user) return [];
    const { data } = await supabase
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

  // Get leaderboard
  // Get questions from database
  const getQuizQuestions = async (categoryId: string, levelId?: string): Promise<any[]> => {
    try {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('category_id', categoryId)
        .eq('level_id', levelId || '')
        .limit(5);
      
      if (data && data.length > 0) {
        return data.map(q => ({
          id: q.id,
          question: q.question_text,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correctAnswer: q.correct_answer
        }));
      }
    } catch (error) {
      console.error('Error fetching questions from database:', error);
    }
    
    // Fallback to mock questions if database is empty
    return [];
  };

  const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const { data: scoreData } = await supabase
      .from('user_total_scores')
      .select('user_id, total_score, global_rank')
      .order('total_score', { ascending: false })
      .limit(50);

    if (!scoreData) return [];

    const userIds = scoreData.map(item => item.user_id);
    const { data: profileData } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

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
    saveCategoryProgress,
    getLevelsForCategory,
    getUserLevelProgress,
    getLeaderboard,
    getQuizQuestions,
    fetchUserCategoryScores,
    fetchUserTotalScore
  };
};
