import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/* =========================
 * Types / Interfaces
 * ========================= */

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
  score: number;             // points (we treat this as the level points)
  max_score: number;         // max points possible for the attempt
  correct_answers: number;
  total_questions: number;
  completed_at?: string | null;
}

export interface UserCategoryScore {
  category_id: string;
  total_score: number;
  levels_completed: number;
  last_played_at?: string | null;
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

/** Helper for CategoryLevelsPage: latest points per level for this user */
export interface LevelScore {
  level_id: string;
  level_number: number;
  name: string;
  points: number;            // what you’ll show as level.points
  correct_answers: number;
  total_questions: number;
  status: 'available' | 'current' | 'completed';
}

/** Params ketika menyimpan progress */
interface SaveProgressParams {
  categoryId: string;
  levelId: string;
  /** points yang ingin ditambahkan/ditulis untuk level tsb */
  score: number;
  /** maksimum points (biasanya = total_questions) */
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

/* =========================
 * Hook
 * ========================= */

export const useQuizData = () => {
  const { user } = useAuth();

  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [userCategoryScores, setUserCategoryScores] = useState<UserCategoryScore[]>([]);
  const [userTotalScore, setUserTotalScore] = useState<number>(0);
  const [globalRank, setGlobalRank] = useState<number>(0);
  const [dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- Fetchers ---------- */

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('quiz_categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) setCategories(data as QuizCategory[]);
  };

  const fetchUserCategoryScores = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_category_scores')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) setUserCategoryScores(data as UserCategoryScore[]);
  };

  const fetchUserTotalScore = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_total_scores')
      .select('total_score, global_rank')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setUserTotalScore(data.total_score ?? 0);
      setGlobalRank(data.global_rank ?? 0);
    }
  };

  const fetchDailyRecommendation = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('daily_recommendations')
      .select('category_id, reason')
      .eq('user_id', user.id)
      .eq('recommendation_date', today)
      .maybeSingle();

    if (data) {
      setDailyRecommendation(data as DailyRecommendation);
    } else {
      await generateDailyRecommendation();
    }
  };

  const generateDailyRecommendation = async () => {
    if (!user) return;

    const unplayed = categories.filter(
      (cat) => !userCategoryScores.find((s) => s.category_id === cat.id)
    );

    let recommended: QuizCategory | undefined;
    let reason = '';

    if (unplayed.length > 0) {
      recommended = unplayed[Math.floor(Math.random() * unplayed.length)];
      reason = 'Try something new today!';
    } else if (userCategoryScores.length > 0) {
      const lowest = userCategoryScores.reduce((min, s) =>
        s.levels_completed < min.levels_completed ? s : min
      );
      recommended = categories.find((c) => c.id === lowest.category_id);
      reason = 'Continue your progress!';
    }

    if (recommended) {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('daily_recommendations').insert({
        user_id: user.id,
        category_id: recommended.id,
        reason,
        recommendation_date: today,
      });

      setDailyRecommendation({ category_id: recommended.id, reason });
    }
  };

  /** Pastikan baris Progress Kategori tersetup (via RPC buatanmu) */
  const initializeCategoryProgress = async (categoryId: string) => {
    if (!user) return;
    await supabase.rpc('initialize_user_category_progress', {
      p_user_id: user.id,
      p_category_id: categoryId,
    });
    await fetchUserCategoryScores();
  };

  /* ---------- Mutators ---------- */

  /** Selesaikan 1 level + unlock level berikutnya */
  const completeLevel = async (
    levelId: string,
    score: number,            // points
    correctAnswers: number,
    totalQuestions: number
  ) => {
    if (!user) return;

    // 1) Upsert progress level ini (status completed)
    await supabase
      .from('user_level_progress')
      .upsert(
        {
          user_id: user.id,
          level_id: levelId,
          status: 'completed',
          score,                          // treat as points
          max_score: totalQuestions,      // biasanya = total pertanyaan
          correct_answers: correctAnswers,
          total_questions: totalQuestions,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, level_id' }
      );

    // 2) Ambil info level saat ini untuk cari next level
    const { data: currentLevel } = await supabase
      .from('quiz_levels')
      .select('category_id, level_number')
      .eq('id', levelId)
      .single();

    if (currentLevel) {
      const { data: nextLevel } = await supabase
        .from('quiz_levels')
        .select('id')
        .eq('category_id', currentLevel.category_id)
        .eq('level_number', currentLevel.level_number + 1)
        .maybeSingle();

      if (nextLevel?.id) {
        const { data: existingProgress } = await supabase
          .from('user_level_progress')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('level_id', nextLevel.id)
          .maybeSingle();

        if (!existingProgress) {
          await supabase.from('user_level_progress').insert({
            user_id: user.id,
            level_id: nextLevel.id,
            status: 'current',
            score: 0,
            max_score: 0,
            correct_answers: 0,      // Add these fields
            total_questions: 0       // Add these fields
          });
        }
        if (existingProgress.status === 'locked') {
          await supabase
            .from('user_level_progress')
            .update({ status: 'current' })
            .eq('id', existingProgress.id);
        }
      }
    }

    // 3) Refresh skor ringkasan
    await Promise.all([fetchUserCategoryScores(), fetchUserTotalScore()]);
  };

  /** Simpan progress + update skor kategori & total (leaderboard) */
  const saveCategoryProgress = async ({
    categoryId,
    levelId,
    score,
    maxScore,
    correctAnswers,
    totalQuestions,
  }: SaveProgressParams) => {
    if (!user) return;

    // a) Simpan / update progress level
    const { error: progressError } = await supabase
      .from('user_level_progress')
      .upsert(
        {
          user_id: user.id,
          level_id: levelId,
          status: 'completed',    // Add status
          score,
          max_score: maxScore,
          correct_answers: correctAnswers,
          total_questions: totalQuestions,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, level_id' }
      );

    if (progressError) throw progressError;

    // b) Pastikan progress kategori terinisialisasi
    await initializeCategoryProgress(categoryId);

    // c) Update skor kategori (akumulasi)
    const { data: oldCat } = await supabase
      .from('user_category_scores')
      .select('total_score, levels_completed')
      .eq('user_id', user.id)
      .eq('category_id', categoryId)
      .maybeSingle();

    const existingCategoryScore = oldCat?.total_score ?? 0;
    const existingLevelsCompleted = oldCat?.levels_completed ?? 0;
    const newCategoryScore = existingCategoryScore + score;

    await supabase
      .from('user_category_scores')
      .upsert(
        {
          user_id: user.id,
          category_id: categoryId,
          total_score: newCategoryScore,
          levels_completed: existingLevelsCompleted + 1,
          last_played_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,category_id' }
      );

    // d) Update total skor user (akumulasi)
    const { data: oldTotal } = await supabase
      .from('user_total_scores')
      .select('total_score')
      .eq('user_id', user.id)
      .maybeSingle();

    const existingTotalScore = oldTotal?.total_score ?? 0;
    const newTotalScore = existingTotalScore + score;

    await supabase
      .from('user_total_scores')
      .upsert(
        {
          user_id: user.id,
          total_score: newTotalScore,
        },
        { onConflict: 'user_id' }
      );

    await Promise.all([fetchUserCategoryScores(), fetchUserTotalScore()]);
  };

  /* ---------- Query helpers for pages ---------- */

  const getLevelsForCategory = async (categoryId: string): Promise<QuizLevel[]> => {
    const { data } = await supabase
      .from('quiz_levels')
      .select('*')
      .eq('category_id', categoryId)
      .order('level_number', { ascending: true });

    return (data ?? []) as QuizLevel[];
  };

  const getUserLevelProgress = async (categoryId: string): Promise<UserLevelProgress[]> => {
    if (!user) return [];
    // Join untuk filter progress by category
    const { data } = await supabase
      .from('user_level_progress')
      .select(
        `id, 
    level_id,
    status,
    score,
    max_score,
    correct_answers,
    total_questions,
    completed_at,
    quiz_levels!inner(category_id)`
      )
      .eq('user_id', user.id)
      .eq('quiz_levels.category_id', categoryId);


return data ? (data as  UserLevelProgress[]) : [];
  };

  /** Ambil daftar level + points terakhir user untuk kategori tertentu */
  const getLatestLevelScores = async (categoryId: string): Promise<LevelScore[]> => {
    const [levels, progress] = await Promise.all([
      getLevelsForCategory(categoryId),
      getUserLevelProgress(categoryId),
    ]);

    // Map progress by level_id for quick lookup
    const progressMap = new Map<string, UserLevelProgress>();
    progress.forEach((p) => progressMap.set(p.level_id, p));

    const result: LevelScore[] = levels.map((lvl) => {
      const p = progressMap.get(lvl.id);
      const points = p?.score ?? p?.correct_answers ?? 0;

      let status: LevelScore['status'] = 'available';
      if (p?.status === 'current') status = 'current';
      if (p?.status === 'completed' || (p && (p.score > 0 || p.correct_answers > 0))) {
        status = 'completed';
      }

      return {
        level_id: lvl.id,
        level_number: lvl.level_number,
        name: lvl.name,
        points,
        correct_answers: p?.correct_answers ?? 0,
        total_questions: p?.total_questions ?? lvl.questions_count,
        status,
      };
    });

    return result;
  };

  const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const { data: scoreData } = await supabase
      .from('user_total_scores')
      .select('user_id, total_score, global_rank')
      .order('total_score', { ascending: false })
      .limit(50);

    if (!scoreData || scoreData.length === 0) return [];

    const userIds = scoreData.map((s) => s.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    return scoreData.map((s) => ({
      user_id: s.user_id,
      total_score: s.total_score,
      global_rank: s.global_rank ?? 0,
      display_name:
        profiles?.find((p) => p.user_id === s.user_id)?.display_name ?? 'Unknown User',
    }));
  };

  /* ---------- Effect: initial load ---------- */

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCategories();
      if (user) {
        await Promise.all([
          fetchUserCategoryScores(),
          fetchUserTotalScore(),
          fetchDailyRecommendation(),
        ]);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // re-run when login/logout

  /* ---------- Expose ---------- */

  return {
    // state
    categories,
    userCategoryScores,
    userTotalScore,
    globalRank,
    dailyRecommendation,
    loading,

    // write
    initializeCategoryProgress,
    completeLevel,
    saveCategoryProgress,

    // read
    getLevelsForCategory,
    getUserLevelProgress,
    getLatestLevelScores,
    getLeaderboard,

    // optional manual refetch
    fetchUserCategoryScores,
    fetchUserTotalScore,
  };
};